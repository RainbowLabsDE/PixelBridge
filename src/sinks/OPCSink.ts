import { BaseSink } from "./BaseSink"

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

    /**
     * This command is a system exclusive implementation using the command 255.
     * @param brightness from 0 to 255
     */
    setBrightness(brightness: number) {
        let buf = Buffer.alloc(7);
        // build OPC packet
        buf.writeUInt8(0, 0); // channel
        buf.writeUInt8(255, 1); // command
        buf.writeUInt16BE(7, 2); // length
        buf.writeUInt16BE(69, 4); // system id
        buf.writeUInt8(brightness, 6); // brightness info

        // TODO: not working
        this.udp.send(buf, this.port, this.ip, function(err, bytes) {
            if (err) throw err;
        });
    }
}
