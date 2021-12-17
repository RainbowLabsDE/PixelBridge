import { BaseSource } from "./BaseSource";

import * as dgram from "dgram";

const artnetPort = 6454;

interface ArtnetPacket {
    sequence: number;
    physical: number;
    universe: number;
    length: number;
    data: Buffer;
}

let artnetHeader = Buffer.from("Art-Net\0");

export class ArtnetSource extends BaseSource {
    protected server: dgram.Socket;
    private frameBuf: Frame;
    private sendBufferTimeout: NodeJS.Timeout;

    constructor(width: number, height: number, newFrameCallback: (frame: Frame) => void) {
        super(width, height, newFrameCallback);
        this.frameBuf = { width: width, height: height, buffer: Buffer.alloc(width * height * 3) };
        this.open();
    }

    private async parseArtnetPacket(msg: Buffer): Promise<ArtnetPacket> {
        // check if Art-Net header is present
        if (msg.subarray(0, 8).compare(artnetHeader) == 0) {
            // check if OpCode == ArtDMX
            if (msg.readUInt16LE(8) == 0x5000) {
                // check if protocol version == 14
                if (msg.readUInt16BE(10) == 14) {
                    // valid Art-Net packet
                    let result: ArtnetPacket = {
                        sequence: msg.readUInt8(12),
                        physical: msg.readUInt8(13),
                        universe: msg.readUInt16LE(14),
                        length: msg.readUInt16BE(16),
                        data: msg.subarray(18)

                    };
                    return result;
                }
            }
        }
        return undefined;
    }

    private async sendBuffer() {
        this.newFrameCallback(this.frameBuf);
    }

    private async handleArtnetPacket(pkg: ArtnetPacket, fromIp: string) {
        if (pkg) {
            // currently Art-Net packets are expected to start at universe 1 and be 510 channels in length
            let offset = (pkg.universe - 1) * 510;
            if(offset < 0) {
                offset = 0;
            }
            pkg.data.copy(this.frameBuf.buffer, offset);
            
            // pushes buffer to display after 10ms of idle time
            // TODO: make this more robust with Art-Net sequence numbers
            clearTimeout(this.sendBufferTimeout);
            this.sendBufferTimeout = setTimeout(() => this.sendBuffer(), 10);
        }
    }

    private async udpCallback(msg: Buffer, rinfo: dgram.RemoteInfo) {
        let fromIp = rinfo.address;
        this.handleArtnetPacket(await this.parseArtnetPacket(msg), fromIp);
    }

    open() {
        this.server = dgram.createSocket({type: 'udp4', reuseAddr: true});
        this.server.bind(artnetPort);
        this.server.on('listening', () => {
            let addr = this.server.address();
            console.log(`[Art-Net] Server listening on ${addr.address}:${addr.port}`);
        });
        this.server.on('message', (a, b) => this.udpCallback(a, b));
        this.server.on('close', () => {
            console.log("[Art-Net] Server closed");
        });
    }

    close() {
        this.server.close();
    }
}
