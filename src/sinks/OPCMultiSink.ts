import { Frame } from "../common/frame.interface";
import { OPCSink } from "./OPCSink";

export class OPCMultiSink {
    opcSinks: OPCSink[];

    constructor(addresses: string[]) {
        this.opcSinks = addresses.map(address => {
            if (address) {
                try {
                    const url = new URL('udp://' + address);
                    const port = parseInt(url.port);
                    if (!isNaN(port) && port >= 1 && port <= 65535) {
                        return new OPCSink(0, 0, url.hostname, port);
                    }
                }
                catch (e) {
                    if (e.code != 'ERR_INVALID_URL') {
                        console.error(e);   // only print unexpected errors
                    }
                }
            }
            return null;
        });
    }

    close() {
        // just close every sink for now, no reason to keep unchanged sinks as they're not stateful
        this.opcSinks.forEach(sink => {
            if (sink?.close) {
                sink.close();
            }
        });
    }

    sendFrames(frames: Frame[]) {
        frames.forEach((frame, i) => {
            if (this.opcSinks[i]?.sendFrame) {
                this.opcSinks[i].sendFrame(frame);
            }
        });
    }
}