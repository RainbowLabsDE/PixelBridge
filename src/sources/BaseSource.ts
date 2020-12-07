export class BaseSource {
    constructor(protected width: number, protected height: number, protected newFrameCallback: (frame: Frame) => void) {
    }
}