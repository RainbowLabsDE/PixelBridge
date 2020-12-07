import { BaseSink } from "./BaseSink"

import "dgram";
import * as dgram from "dgram";

export class OPCSink extends BaseSink {
    protected udp: dgram.Socket;
    constructor(width: number, height: number, protected ip: string, protected port: number) {
        super(width, height);
        this.initConnection();
    }
    
    initConnection() {
        this.udp = dgram.createSocket('udp4');
        this.udp.connect(this.port, this.ip);
        // console.log("connected");
    }
    
    async sendFrame(frame: Frame): Promise<void> {
        let length = frame.width * frame.height * 3;
        let buf = Buffer.alloc(4 + length);
        // build OPC packet
        buf.writeUInt8(0, 0); // channel
        buf.writeUInt8(0, 1); // command
        buf.writeUInt16BE(length, 2); // length
        frame.buffer.copy(buf, 4);

        await new Promise((resolve, reject) => this.udp.send(buf, resolve));
    }
    
}