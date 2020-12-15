import * as sharp from "sharp"
import { ModLedConverter } from "./converters/ModLedConverter";
import { OPCSink } from "./sinks/OPCSink";
import { ArtnetSource } from "./sources/ArtnetSource";
import {DummySource} from "./sources/DummySource";
import { GifSource } from "./sources/GifSource";


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


let file = "tthl.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/catNail.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/bongo1.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/catPC.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/groot.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/lynx2.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/stickFight.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/rick.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/simpsons.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/Cyber2.png"
// let gifSource = new GifSource(frameWidth, frameHeight, (frame) => modLedConverter.sendFrame(frame));
// gifSource.showGif(file);

let artnetSource = new ArtnetSource(frameWidth, frameHeight, (frame) => modLedConverter.sendFrame(frame));


console.log("[PixelBridge] Started");