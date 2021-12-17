import { ModLedConverter } from "./converters/ModLedConverter";
import { OPCSink } from "./sinks/OPCSink";
import { ArtnetSource } from "./sources/ArtnetSource";
import { DummySource } from "./sources/DummySource";
import { GifSource } from "./sources/GifSource";

import { config } from './config/config';
import { WebServer } from "./webinterface/server";
import { Command, Option } from 'commander';
import {FreezeFrameSource} from "./sources/FreezeFrameSource";
import {BaseSink} from "./sinks/BaseSink";

const program = new Command();

// npm start -- -x 16 -y 16

program
    .requiredOption('-x, --panelWidth <panelWidth>', 'Width of a single panel')
    .requiredOption('-y, --panelHeight <panelHeight>', 'Height of a single panel')
    //.addOption(new Option('-s, --source <source>', 'Input source').choices(["Gif", "Artnet", "FreezeFrame", "Dummy"]))
    //.option('-sf, --sourceFile <sourceFile>', 'Path to the file for the source')
    .option('-br, --brightness <brightness>', 'Brightness from 0 to 255', '255')
    .option('-pnx, --panelNumX <panelNumX>', 'Number of horizontal panels', '1')
    .option('-pny, --panelNumY <panelNumY>', 'Number of vertical panels', '1')
    //.option('-sp, --settingsPage', 'Launches a settings webpage')
    .parse();

const options = program.opts();

let totalPanelCount = options.panelNumX * options.panelNumY;
let frameWidth = options.panelNumX * options.panelWidth;
let frameHeight = options.panelNumY * options.panelHeight;

let opcSinks: BaseSink[] = [];

for (let i = 0; i < totalPanelCount; i++) {
    opcSinks.push(new OPCSink(options.panelWidth, options.panelHeight, '127.0.0.1', 7890 + i));
}

opcSinks.forEach(sink => sink.setBrightness(255));
let modLedConverter = new ModLedConverter(options.panelNumX, options.panelNumY, options.panelWidth, options.panelHeight, opcSinks);



let dummySource = new FreezeFrameSource(frameWidth, frameHeight, (frame) => {modLedConverter.sendFrame(frame)});
//let artnetSource = new ArtnetSource(frameWidth, frameHeight, (frame) => modLedConverter.sendFrame(frame));


let server = new WebServer;

