import { Frame } from "../common/frame.interface";
import { FrameArr } from "../common/frameArr.interface";
import { MappingGenerator, MappingParams } from "../common/MappingGenerator";

export class PixelMappingConverter {

    constructor(protected moduleMappingParams: MappingParams) { }

    // TODO: do parameter getting and precalculation only once during init
    async convert(frameArr: FrameArr): Promise<FrameArr> {
        if (this.moduleMappingParams.mapType == 'line' 
            && this.moduleMappingParams.mapOrientation == 'horz' 
            && this.moduleMappingParams.mapStart == 'tl') {
            return frameArr; // nothing to do, frames are already in correct order
        }

        // assume that all frames have the same dimensions
        const mapping = await new MappingGenerator(this.moduleMappingParams).generateMapping(frameArr.frames[0].width, frameArr.frames[0].height);
        
        // do the pixel mapping
        frameArr.frames.forEach(frame => {
            let tempBuf = Buffer.from(frame.buffer);
            for (let i = 0; i < frame.width * frame.height; i++) {
                tempBuf.copy(frame.buffer, mapping[i] * 3, i * 3, (i * 3) + 3);
            }
        });

        return frameArr;
    }

}