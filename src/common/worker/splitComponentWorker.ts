import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Frame } from "../frame.interface";
import { FrameArr } from "../frameArr.interface";

export class SplitComponentWorker extends Rete.Component {
    constructor() {
        super("Split");
    }

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: {frameArr: 'option'}
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        // TODO: do parameter getting and precalculation only once during init
        // TODO: check why resolution doesn't update anymore when chaning the flow without restarting

        // get node parameters
        const moduleRes = (inputs['res']?.length ? inputs['res'][0] : node.data.resolution) as Resolution;
        // console.log(inputs, moduleRes);

        // check for undefined parameters
        if (moduleRes?.x == undefined || moduleRes?.y == undefined) {
            this.closed = ['frameArr']; // stop propagating event
        }
        else {
            const frame = data.frame as Frame;
            let frameArr: FrameArr = {
                width: Math.ceil(frame.width / moduleRes.x),
                height: Math.ceil(frame.height / moduleRes.y),
                frames: []
            }
            // initialize frame array
            frameArr.frames = Array.from({length: frameArr.width * frameArr.height}, (): Frame => {
                return {
                    width: moduleRes.x,
                    height: moduleRes.y,
                    buffer: Buffer.alloc(moduleRes.x * moduleRes.y * 3)
                }
            });

            // traverse through modules column-wise, starting top left and copy buffers to the respective module frames to split a single frame into modules
            for (let xFrame = 0; xFrame < frameArr.width; xFrame++) {   // iterate through modules in x direction
                for (let y = 0; y < frame.height; y++) {                // iterate through individual lines in y direction
                    let moduleId = xFrame + Math.floor(y / moduleRes.y) * frameArr.width;   // calculate module id
                    let sourceOffset = ((xFrame * moduleRes.x) + (y * frame.width)) * 3;
                    let targetOffset = Math.floor(y % moduleRes.y) * moduleRes.x * 3;
                    let length = moduleRes.x * 3;
                    frame.buffer.copy(frameArr.frames[moduleId].buffer, targetOffset, sourceOffset, sourceOffset + length);
                }
            }

            data.fromId = node.id;
            data.frameArr = frameArr;
            // console.log(frameArr);
        }


    }
}