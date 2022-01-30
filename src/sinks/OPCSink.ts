import { BaseSink } from "./BaseSink"

import * as dgram from "dgram";
import { Frame } from "../common/frame.interface";

export class OPCSink extends BaseSink {
    protected udp: dgram.Socket;
    open: boolean;

    constructor(width: number, height: number, protected ip: string, protected port: number) {
        super(width, height);
        this.initConnection();
    }
    
    initConnection() {
        this.udp = dgram.createSocket('udp4');
        this.udp.on('error', (err) => {
            if (err) {
                this.open = false;
                console.log(`[OPC] Sink unhandled error`, err);
            }
        })
        this.udp.connect(this.port, this.ip, () => {
            this.open = true;
            console.log(`[OPC] Sink initialized for ${this.ip}:${this.port}`);
        });
        
    }

    close() {
        this.open = false;
        this.udp.close();
    }
    
    async sendFrame(frame: Frame): Promise<void> {
        if (this.open) {
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
    
}