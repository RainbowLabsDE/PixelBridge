import { Frame } from "../common/frame.interface";
import { FrameArr } from "../common/frameArr.interface";

export class SplitFrameToModulesConverter {
    bufSize: number;

    constructor(protected moduleSizeX: number, protected moduleSizeY) {
        this.bufSize = moduleSizeX * moduleSizeY * 3;
    }

    // TODO: do parameter getting and precalculation only once during init
    async convert(frame: Frame): Promise<FrameArr> {
        let frameArr: FrameArr = {
            width: Math.ceil(frame.width / this.moduleSizeX),
            height: Math.ceil(frame.height / this.moduleSizeY),
            frames: []
        }
        // initialize frame array
        frameArr.frames = Array.from({length: frameArr.width * frameArr.height}, (): Frame => {
            return {
                width: this.moduleSizeX,
                height: this.moduleSizeY,
                buffer: Buffer.alloc(this.moduleSizeX * this.moduleSizeY * 3)
            }
        });

        // traverse through modules column-wise, starting top left and copy buffers to the respective module frames to split a single frame into modules
        for (let xFrame = 0; xFrame < frameArr.width; xFrame++) {   // iterate through modules in x direction
            for (let y = 0; y < frame.height; y++) {                // iterate through individual lines in y direction
                let moduleId = xFrame + Math.floor(y / this.moduleSizeY) * frameArr.width;   // calculate module id
                let sourceOffset = ((xFrame * this.moduleSizeX) + (y * frame.width)) * 3;
                let targetOffset = Math.floor(y % this.moduleSizeY) * this.moduleSizeX * 3;
                let length = this.moduleSizeX * 3;
                frame.buffer.copy(frameArr.frames[moduleId].buffer, targetOffset, sourceOffset, sourceOffset + length);
            }
        }

        return frameArr;
    }

}