import { Frame } from "../common/frame.interface";

export class BaseSource {
    constructor(protected width: number, protected height: number, protected newFrameCallback: (frame: Frame) => void) {
    }
}