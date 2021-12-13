import {BaseSource} from "./BaseSource";

export class FreezeFrameSource extends BaseSource {
    framebuffer: Buffer;
    animPos = 0;

    constructor(width: number, height: number, newFrameCallback: (frame: Frame) => void) {
        super(width, height, newFrameCallback);
        this.framebuffer = Buffer.alloc(width * height * 3);

        setInterval(() => this.generateDummyFrame(), 1000 / 10);
    }

    generateDummyFrame() {
        let totalPixels = this.width * this.height;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let i = (y * this.width + x);
                let pos = i * 3;
                this.framebuffer[pos + 0] = 64;
                this.framebuffer[pos + 1] = 128;
                this.framebuffer[pos + 2] = 255;
            }
        }
        this.animPos++;
        if (this.animPos >= totalPixels) {
            this.animPos = 0;
        }
        this.newFrameCallback({width: this.width, height: this.height, buffer: this.framebuffer});
    }

    animCounter2 = 0;
}
