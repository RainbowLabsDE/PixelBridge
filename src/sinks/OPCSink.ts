import { BaseSink } from "./BaseSink"

import * as dgram from "dgram";
import { Frame } from "../common/frame.interface";

export class OPCSink extends BaseSink {
    protected udp: dgram.Socket;
    constructor(width: number, height: number, protected ip: string, protected port: number) {
        super(width, height);
        this.initConnection();
    }
    
    initConnection() {
        this.udp = dgram.createSocket('udp4');
        this.udp.connect(this.port, this.ip);
        console.log(`[OPC] Sink initialized for ${this.ip}:${this.port}`);
    }

    close() {
        this.udp.close();
    }
    
    async sendFrame(frame: Frame): Promise<void> {
        let length = frame.width * frame.height * 3;
        let buf = Buffer.alloc(4 + length);
        // build OPC packet
        buf.writeUInt8(0, 0); // channel
        buf.writeUInt8(0, 1); // command
        buf.writeUInt16BE(length, 2); // length
        frame.buffer.copy(buf, 4);
        // console.log(this.port);

        await new Promise((resolve, reject) => this.udp.send(buf, resolve));
    }
    
}