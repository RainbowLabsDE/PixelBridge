import { Frame } from "../common/frame.interface";

export class FrameLimiterConverter {
    lastFrame = 0;
    minimumFrameTime: number;   // ms

    constructor(protected fps: number) { 
        this.minimumFrameTime = 1000 / fps;
    }

    // returns null, if frame needs to be dropped
    async convert(frame: Frame): Promise<Frame> {
        if ((Date.now() - this.lastFrame) > this.minimumFrameTime) {
            this.lastFrame = Date.now();
            return frame;
        }
        else {
            return null;
        }
    }

}