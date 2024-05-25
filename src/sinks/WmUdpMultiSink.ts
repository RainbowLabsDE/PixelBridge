import { Frame } from "../common/frame.interface";
import { OPCSink } from "./OPCSink";
import * as dgram from "dgram";

export class WmUdpMultiSink {
    protected udp: dgram.Socket;
    opcSinks: OPCSink[];
    open: boolean;
    macs: Buffer[];

    constructor(address: string, protected macAddresses: string[]) {
        if (address) {
            try {
                const url = new URL('udp://' + address);
                const port = parseInt(url.port);
                if (!isNaN(port) && port >= 1 && port <= 65535) {
                    this.initConnection(url.hostname, port);
                }
            }
            catch (e) {
                if (e.code != 'ERR_INVALID_URL') {
                    console.error(e);   // only print unexpected errors
                }
            }
        }

        this.macs = macAddresses.map(macStr => {
            let result = macStr.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
            if (result && result[0]) {
                const hexStr = result[0].replace(/[:-]/g, '');
                return Buffer.from(hexStr, 'hex');
            }
        });

        console.log(`[wmUDP] parsed MACs:`, this.macs);
    }

    initConnection(ip: string, port: number) {
        this.udp = dgram.createSocket('udp4');
        this.udp.on('error', (err) => {
            if (err) {
                this.open = false;
                console.log(`[wmUDP] Sink unhandled error`, err);
            }
        })
        this.udp.connect(port, ip, () => {
            this.open = true;
            console.log(`[wmUDP] Sink initialized for ${ip}:${port}`);
        });
        
    }

    close() {
        console.log("Close WM UDP Sink");
        this.open = false;
        if (this.udp) {
            this.udp.close();
        }
    }

    async sendFrame(frame: Frame, mac: Buffer): Promise<void> {
        if (this.open) {
            let length = frame.width * frame.height * 3;
            let buf = Buffer.alloc(7 + length);

            mac.copy(buf);
            buf.writeUInt8(0x01, 6);    // Command (write LED data)
            frame.buffer.copy(buf, 7);

            await new Promise((resolve, reject) => this.udp.send(buf, resolve));
        }
    }

    sendFrames(frames: Frame[]) {
        frames.forEach((frame, i) => {
            if (this.macs[i]) {
                this.sendFrame(frame, this.macs[i]);
            }
        });
    }
}