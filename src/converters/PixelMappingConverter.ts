import { Frame } from "../common/frame.interface";
import { FrameArr } from "../common/frameArr.interface";
import { MappingGenerator, MappingParams } from "../common/MappingGenerator";

export class PixelMappingConverter {

    constructor(protected moduleMappingParams: MappingParams) { }

    // TODO: do parameter getting and precalculation only once during init
    async convert(frameArr: FrameArr): Promise<FrameArr> {
        let newFrameArr = {...frameArr};

        // assume that all frames have the same dimensions
        const mapping = await new MappingGenerator(this.moduleMappingParams).generateMapping(frameArr.frames[0].width, frameArr.frames[0].height);
        
        // do the pixel mapping
        newFrameArr.frames.forEach(frame => {
            let tempBuf = Buffer.from(frame.buffer);
            for (let i = 0; i < frame.width * frame.height; i++) {
                tempBuf.copy(frame.buffer, mapping[i].position * 3, i * 3, (i * 3) + 3);
            }
        });

        newFrameArr.height *= newFrameArr.width;
        newFrameArr.width = 1;

        return newFrameArr;
    }

}