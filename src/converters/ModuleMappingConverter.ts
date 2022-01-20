import { Frame } from "../common/frame.interface";
import { FrameArr } from "../common/frameArr.interface";

export type ModuleMapType =         'line' | 'snake';
export type ModuleMapOrientation =  'horz' | 'vert';
export type ModuleMapFlip =         'none' | 'even' | 'odd';
export type ModuleMapStart =        'tl' | 'tr' | 'bl' | 'br';

export interface ModuleMappingParams {
    mapType: ModuleMapType;
    mapOrientation: ModuleMapOrientation;
    mapFlip: ModuleMapFlip;
    mapStart: ModuleMapStart;
}

export class ModuleMappingConverter {

    constructor(protected moduleMappingParams: ModuleMappingParams) { }

    // TODO: do parameter getting and precalculation only once during init
    // TODO: implement rotation of frames
    async convert(frameArr: FrameArr): Promise<FrameArr> {
        const snake = this.moduleMappingParams.mapType == 'snake';
        const vertical = this.moduleMappingParams.mapOrientation == 'vert';
        const startingLeft = this.moduleMappingParams.mapStart == 'tl' || this.moduleMappingParams.mapStart == 'bl';
        const startingTop = this.moduleMappingParams.mapStart == 'tl' || this.moduleMappingParams.mapStart == 'tr';

        if (startingLeft && startingTop && !vertical && !snake && this.moduleMappingParams.mapFlip == 'none') {
            return; // nothing to do, frames are already in correct order
        }


        // ‧͙⁺˚* Magic, do not touch! *˚⁺‧͙
        
        // for vertical orientation, invert the meaning of X and Y
        const width = vertical ? frameArr.height : frameArr.width;
        const height = vertical ? frameArr.width : frameArr.height;

        let mapping = [];
        for (let i = 0; i < frameArr.width * frameArr.height; i++) {
            let x: number, y: number;

            // for vertical orientation, invert the meaning of X and Y
            let flipX = vertical ? !startingTop : !startingLeft;
            let flipY = vertical ? !startingLeft : !startingTop;

            if (!flipY)
                y = Math.floor(i / width);
            else
                y = height - Math.floor(i / width) - 1;

            // implement snake by flipping x depending on which y we're on
            if (snake) {
                const flipOnEvenLine = flipY && (height % 2 == 0); // normally flip on odd lines, except when starting from bottom and height is even (flipY is said start flag, horz/vert corrected)
                if (y % 2 == (flipOnEvenLine ? 0 : 1)) {     
                    flipX = !flipX;
                }
            }
            
            if (!flipX)
                x = Math.floor(i % width);
            else
                x = width - (i % width) - 1;
                
            let newPos: number;
            // for vertical orientation, invert the meaning of X and Y
            if (!vertical)
                newPos = y * width + x;
            else
                newPos = x * height + y;

            mapping[newPos] = i;
        }

        // reorder the frames
        let tempFrames = [...frameArr.frames];  // clone array, but leave object references intact
        mapping.forEach((mapPos, i) => {
            frameArr.frames[i] = tempFrames[mapPos];
        });

        // // debug mapping
        // for (let y = 0; y < frameArr.height; y++) {
        //     for (let x = 0; x < frameArr.width; x++) {
        //         let i = y * frameArr.width + x;
        //         let m = mapping[i];
        //         process.stdout.write(`${m < 10 ? ' ' : ''}${m} `);
        //     }
        //     process.stdout.write('\n');
        // }

        return frameArr;
    }

}