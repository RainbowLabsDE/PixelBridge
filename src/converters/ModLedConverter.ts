import { BaseSink } from "../sinks/BaseSink";

export class ModLedConverter {
    sinkFrames: Frame[] = [];
    constructor(protected panelNumX: number, protected panelNumY: number, protected panelWidth: number, protected panelHeight: number, protected sinks: BaseSink[]) {
        let bufSize = panelWidth * panelHeight * 3;
        sinks.forEach(() => {
            this.sinkFrames.push({width: panelWidth, height: panelHeight, buffer: Buffer.alloc(bufSize)});
        });
    }

    private convertFrame(frame: Frame) {
        for(let panelY = 0; panelY < this.panelNumY; panelY++) {
            for(let panelX = 0; panelX < this.panelNumX; panelX++) {
                let panelNum = panelY * this.panelNumX + panelX;
    
                for(let y = 0; y < this.panelHeight; y++) {
                    let frameXOffset = panelX * this.panelWidth;
                    let frameOffset = panelY * this.panelNumX * this.panelWidth * this.panelHeight + frameXOffset;
                    frameOffset += y * this.panelNumX * this.panelWidth;

                    let panelOffset = y * this.panelWidth;

                    // console.log({panelY: panelY, panelX: panelX, y: y, frameXOffset: frameXOffset, frameOffset: frameOffset, panelOffset: panelOffset});

                    frame.buffer.copy(this.sinkFrames[panelNum].buffer, panelOffset * 3, frameOffset * 3, (frameOffset + this.panelWidth) * 3);
                }
            }
        }

    }

    async sendFrame(frame: Frame) {
        this.convertFrame(frame);
        await Promise.all(this.sinks.map((sink, index) => sink.sendFrame(this.sinkFrames[index])));
    }
}