import { ModLedConverter } from "./converters/ModLedConverter";
import { OPCSink } from "./sinks/OPCSink";
import { ArtnetSource } from "./sources/ArtnetSource";
import { DummySource } from "./sources/DummySource";
import { GifSource } from "./sources/GifSource";

import { config } from './config/config';
import { WebServer } from "./webinterface/server";
import { Command } from 'commander';

const program = new Command();

// npm start -- -x 16 -y 16

program
    .option('-sp, --settingsPage', 'Launches a settings webpage')
    .requiredOption('-x, --panelWidth <panelWidth>', 'Width of a single panel')
    .requiredOption('-y, --panelHeight <panelHeight>', 'Height of a single panel')
    .option('-pxc, --panelWidthCount <panelWidthCount>', 'Number of horizontal panels', '1')
    .option('-pyc, --panelHeightCount <panelHeightCount>', 'Number of vertical panels', '1')
    .parse();

const options = program.opts();

let totalPanelCount = options.panelWidthCount * options.panelHeightCount;
let frameWidth = options.panelWidthCount * options.panelWidth;
let frameHeight = options.panelHeightCount * options.panelHeight;

let opcSinks: OPCSink[] = [];

for (let i = 0; i < totalPanelCount; i++) {
    opcSinks.push(new OPCSink(options.panelWidth, options.panelHeight, '127.0.0.1', 7890 + i));
}

let modLedConverter = new ModLedConverter(options.panelWidthCount, options.panelHeightCount, options.panelWidth, options.panelHeight, opcSinks);
// let dummySource = new DummySource(frameWidth, frameHeight, (frame) => {modLedConverter.sendFrame(frame)});


let file = "rgb.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/catNail.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/bongo1.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/catPC.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/groot.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/lynx2.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/stickFight.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/rick.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/simpsons.gif"
// let file = "C:/Users/Leandro/Nextcloud/Sync/Projekte/_littleBits/pixelFlut/gifFlut/Cyber2.png"
let gifSource = new GifSource(frameWidth, frameHeight, (frame) => modLedConverter.sendFrame(frame));
gifSource.showGif(file);

//let artnetSource = new ArtnetSource(frameWidth, frameHeight, (frame) => modLedConverter.sendFrame(frame));

let server = new WebServer;

console.log("[PixelBridge] Started");
// console.log(config.test);
