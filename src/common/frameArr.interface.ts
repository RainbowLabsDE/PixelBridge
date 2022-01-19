import { Frame } from "./frame.interface";

export interface FrameArr {
    width: number;      // width in amount of frames
    height: number;     // height in amount of frames
    frames: Frame[];
}