import { Frame } from "../common/frame.interface";

export abstract class BaseSink {
    constructor(protected width: number, protected height: number) {
    }

    abstract sendFrame(frame: Frame): Promise<void>;
}