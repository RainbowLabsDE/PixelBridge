import {BaseSource} from "./BaseSource";

export class DummySource extends BaseSource {
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
                
                
                let val = (i / totalPixels) * 768;
                val = ((val - this.animPos) % 768 + 768) % 768;
                let r = val < 256 ? val : 0;
                let g = val >= 256 && val < 512 ? val - 256 : 0;
                let b = val >= 512 ? val - 512 : 0;

                let pos = i * 3;
                this.framebuffer[pos + 0] = r;
                this.framebuffer[pos + 1] = g;
                this.framebuffer[pos + 2] = b;
                
                
                
            }
        }
        this.animPos++;
        if(this.animPos >= totalPixels) {
            this.animPos = 0;
        }
        this.newFrameCallback({width: this.width, height: this.height, buffer: this.framebuffer});
    }
    
    animCounter2 = 0;
    generateDummyFrame2() {
        let totalPixels = this.width * this.height;
        
        this.framebuffer.fill(0);
        this.framebuffer[this.animCounter2 * 3 + 0] = 255;
        this.framebuffer[this.animCounter2 * 3 + 1] = 255;
        this.framebuffer[this.animCounter2 * 3 + 2] = 255;
        
        this.newFrameCallback({width: this.width, height: this.height, buffer: this.framebuffer});
        
        this.animCounter2++;
        if(this.animCounter2 > totalPixels) {
            this.animCounter2 = 0;
        }
    }
}