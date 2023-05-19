import { Frame } from "../common/frame.interface";

export class GammaConverter {
    lastFrame = 0;
    minimumFrameTime: number;   // ms
    gammaLookup: number[] = [];

    constructor(protected gamma: number) { 
        //generate gamma lookup table
        for (let i = 0; i < 256; i++) {
            this.gammaLookup[i] = Math.round(Math.pow(i/255, gamma) * 255);
        }
    }

    // returns null, if frame needs to be dropped
    async convert(frame: Frame): Promise<Frame> {
        for (let i = 0; i < frame.height * frame.width * 3; i++) {
            frame.buffer[i] = this.gammaLookup[frame.buffer[i]];
        }

        return frame;
    }

}