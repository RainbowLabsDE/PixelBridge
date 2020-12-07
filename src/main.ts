import * as sharp from "sharp"
import { ModLedConverter } from "./converters/ModLedConverter";
import { OPCSink } from "./sinks/OPCSink";
import {DummySource} from "./sources/DummySource";


let panelsX = 6;
let panelsY = 4;
let frameWidth = panelsX * 16;
let frameHeight = panelsY * 16;

let opcSinks: OPCSink[] = [];

for(let i = 0; i < panelsX * panelsY; i++) {
    // opcSinks.push(new OPCSink(16, 16, '192.168.13.63', 7890+i));
    opcSinks.push(new OPCSink(16, 16, '127.0.0.1', 7890+i));
}

let modLedConverter = new ModLedConverter(panelsX, panelsY, 16, 16, opcSinks);
// let dummySource = new DummySource(frameWidth, frameHeight, (frame) => {modLedConverter.sendFrame(frame)});

// sharp("hacker.jpg")
//     .resize({width: frameWidth, height: frameHeight})
//     .raw()
//     .toBuffer()
//     .then((buffer) => modLedConverter.sendFrame({width: frameWidth, height: frameHeight, buffer: buffer}));



// hackedy hack hack
let gifBuf: Buffer;
let gifFrames: number;
let gifFrameIdx: number = 0;

let drawGifFunc = () => {
    let frameSize = frameWidth * frameHeight * 3;
    let offset = gifFrameIdx * frameSize;
    let buf = gifBuf.subarray(offset, offset + frameSize)
    // console.log(offset, offset + frameSize);
    let frame: Frame = {width: frameWidth, height: frameHeight, buffer: buf};
    modLedConverter.sendFrame(frame);

    gifFrameIdx++;
    if(gifFrameIdx >= gifFrames) {
        gifFrameIdx = 0;
    }
}

let drawGif = (buf: Buffer, numPages: number, delay: number) => {
    gifBuf= buf;
    gifFrames = numPages;
    console.log(`Drawing gif with ${1000/delay} FPS and ${numPages} frames`);
    drawGifFunc();
    setInterval(() => drawGifFunc(), delay);
}


let file = "tthl.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/bongo1.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/catPC.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/groot.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/lynx2.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/stickFight.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/rick.gif"
let options: sharp.SharpOptions = { animated: true};
sharp(file, options)
    .metadata()
    .then(({pages, delay}) => sharp(file, options)
        .removeAlpha()
        .resize(frameWidth, frameHeight * pages, {fit: 'fill'})
        .raw()
        .toBuffer()
        .then((buf) => drawGif(buf, pages, delay[0]))
        // .png()
        // .toFile("test.png")
        // .toBuffer({resolveWithObject: true})
        // .then(console.log)
    );

console.log("started");