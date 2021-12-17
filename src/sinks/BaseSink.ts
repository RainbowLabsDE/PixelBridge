export abstract class BaseSink {
    constructor(protected width: number, protected height: number) {
    }

    abstract sendFrame(frame: Frame): Promise<void>;
    abstract setBrightness(brightness: number);
}
