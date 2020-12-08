import { BaseSource } from "./BaseSource";
import * as sharp from "sharp"

export class GifSource extends BaseSource {
    private gifBuf: Buffer;
    private gifFramesNum: number;
    private gifFrameIdx: number;
    private gifInterval: NodeJS.Timeout;

    constructor(width: number, height: number, newFrameCallback: (frame: Frame) => void) {
        super(width, height, newFrameCallback);
    }

    private showGifTick() {
        let frameSize = this.width * this.height * 3;
        let offset = this.gifFrameIdx * frameSize;
        let buf = this.gifBuf.subarray(offset, offset + frameSize);

        let frame: Frame = { width: this.width, height: this.height, buffer: buf };
        this.newFrameCallback(frame);

        this.gifFrameIdx++;
        if (this.gifFrameIdx >= this.gifFramesNum) {
            this.gifFrameIdx = 0;
        }
    }

    private async resizeGifFramesToBuffer(image: sharp.Sharp, targetWidth: number, targetHeight: number): Promise<Buffer> {
        let input = await image.metadata();

        let outputFrameSize = targetWidth * targetHeight * 3;
        let outputBuf = Buffer.alloc(outputFrameSize * input.pages);

        let imgBuf = await image.removeAlpha().raw().toBuffer();

        let inputFrameSize = input.width * input.pageHeight * 3;

        for (let i = 0; i < input.pages; i++) {
            let yOffset = i * input.pageHeight;
            let yOffsetResult = i * targetHeight;
            let inputBufferOffset = i * inputFrameSize;
            let outputBufferOffset = i * outputFrameSize;
            process.stdout.write(`Converting frame ${i + 1}/${input.pages}\r`);
            let frame = await sharp(
                imgBuf.subarray(inputBufferOffset, inputBufferOffset + inputFrameSize),
                { raw: { width: input.width, height: input.pageHeight, channels: 3 } })
                .resize(targetWidth, targetHeight, { fit: 'contain' })
                .raw()
                .toBuffer();
            frame.copy(outputBuf, outputBufferOffset);
        }
        console.log(`\nDone.`);

        return outputBuf;
    }

    // save gif data in class variables and return frame delay
    private async parseGif(filePath: string): Promise<number> {
        console.log(`Loading gif ${filePath}`);

        try {
            let time = Date.now();
            let gif = sharp(filePath, { animated: true });
            let gifMetadata = await gif.metadata();

            this.gifFramesNum = gifMetadata.pages;
            this.gifBuf = Buffer.alloc(this.width * this.height * 3 * this.gifFramesNum);

            if (gifMetadata.hasAlpha) {
                gif = await gif.removeAlpha();
            }

            // resizes gif with stretching, because splitting frames manually is still a todo
            // gif = await gif.resize(this.width, this.height * this.gifFramesNum, {fit: 'fill'})
            // let gifResult = await gif.raw().toBuffer();

            let gifResult = await this.resizeGifFramesToBuffer(gif, this.width, this.height);
            
            if (gifResult.length != this.gifBuf.length) {
                throw new Error(`GIF conversion failed, buffer sizes do not match. Expected: ${this.gifBuf.length}, actual: ${gifResult.length}`);
            }
            
            // copy conversion result to local buffer
            gifResult.copy(this.gifBuf);
            
            console.log(`Took ${Date.now() - time} ms`);
            return gifMetadata.delay[0];
        }
        catch (e) {
            console.error(e);
            return -1;
        }
    }

    async showGif(filePath: string) {
        let frameDelay = await this.parseGif(filePath);
        if (frameDelay > 0) {
            console.log(`Drawing gif with ${1000 / frameDelay} FPS and ${this.gifFramesNum} frames`);
            this.gifFrameIdx = 0;
            this.showGifTick();
            this.gifInterval = setInterval(() => this.showGifTick(), frameDelay);
        }
    }
}