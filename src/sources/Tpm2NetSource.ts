import { BaseSource } from "./BaseSource";
import * as dgram from "dgram";
import { Frame } from "../common/frame.interface";

enum Tpm2PacketType {
    DataFrame = 0xDA,
    Command = 0xC0,
    RequestResponse = 0xAA
}

interface Tpm2NetPacket {
    // startByte: number;
    packetType: Tpm2PacketType | number;
    frameSize: number;
    packetNumber: number;
    numPackets: number;
    data: Buffer;
    // endByte: number;
}

const tpm2NetPort = 65506;
const tpm2NetStartByte = 0x9C;
const tpm2NetEndByte = 0x36;

export class Tpm2NetSource extends BaseSource {
    protected server: dgram.Socket;
    protected frameBuf: Frame;
    protected sendBufferTimeout: NodeJS.Timeout;
    packetLength: number;

    constructor(width: number, height: number, newFrameCallback: (frame: Frame) => void, private port: number = tpm2NetPort) {
        super(width, height, newFrameCallback);
        this.frameBuf = { width: width, height: height, buffer: Buffer.alloc(width * height * 3) };
        this.open();
    }

    private async parseTpm2NetPacket(msg: Buffer): Promise<Tpm2NetPacket> {
        // check for correct start and end bytes
        if (msg.readUInt8(0) === tpm2NetStartByte && msg.readUInt8(msg.length - 1) === tpm2NetEndByte) {
            let result: Tpm2NetPacket = {
                packetType: msg.readUInt8(1),
                frameSize: msg.readUInt16BE(2),
                packetNumber: msg.readUInt8(4),
                numPackets: msg.readUInt8(5),
                data: msg.subarray(6, msg.length - 1) // cut off end byte
            }
            return result;
        }
        return null;
    }

    private async sendBuffer() {
        this.newFrameCallback(this.frameBuf);
    }

    private async handleTpm2NetPacket(pkg: Tpm2NetPacket, fromIp: string) {
        if (pkg) {
            if (pkg.packetType == Tpm2PacketType.DataFrame) {
                if (pkg.packetNumber != pkg.numPackets || pkg.numPackets == 1) {
                    this.packetLength = pkg.frameSize;
                }
                if (this.packetLength) {
                    const offset = (pkg.packetNumber - 1) * this.packetLength;
                    pkg.data.copy(this.frameBuf.buffer, offset);

                    // pushes buffer to display after 10ms of idle time
                    // TODO: make this more robust with Art-Net sequence numbers
                    clearTimeout(this.sendBufferTimeout);
                    this.sendBufferTimeout = setTimeout(() => this.sendBuffer(), 10);
                }
            }
        }
    }

    private udpCallback = async (msg: Buffer, rinfo: dgram.RemoteInfo) => {
        let fromIp = rinfo.address;
        this.handleTpm2NetPacket(await this.parseTpm2NetPacket(msg), fromIp);
    }

    open() {
        this.server = dgram.createSocket({type: 'udp4', reuseAddr: true});
        this.server.bind(this.port);
        this.server.on('listening', () => {
            let addr = this.server.address();
            console.log(`[TPM2.net] Server listening on ${addr.address}:${addr.port}`);
        });
        this.server.on('message', this.udpCallback);
        this.server.on('close', () => {
            console.log("[TPM2.net] Server closed");
        });
    }

    close() {
        this.server.close();
    }
}