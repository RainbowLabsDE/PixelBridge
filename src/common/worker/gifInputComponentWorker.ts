import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Frame } from "../frame.interface";

// currently does only dummy stuff (my debug node for testing out Rete Tasks)
export class GifInputComponentWorker extends Rete.Component {
    
    constructor() {
        super("GIF Input");
    }
    
    interval = {};
    
    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: {frame: 'option'},
        init: (task, node) => { // gets called on engine.process
            // console.log('Task init', /*task, */node.id);
            task.run(null);
            if (this.interval[node.id]) {
                clearInterval(this.interval[node.id]);
            }
            const frm: Frame = {
                width: 16,
                height: 16,
                buffer: Buffer.alloc(16 * 16 * 3)
            }
            for (let i = 0; i < frm.buffer.length; i++) {
                frm.buffer[i] = Math.floor(i/3) % 256;
            }
            this.interval[node.id] = setInterval(() => {
                task.run({
                    frame: frm
                });
            }, 10000);
        }
    };

    initBackend = async (node: NodeData, inputs: WorkerInputs) => {
        console.log(node.id, inputs);
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    // this is now a task worker
    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        
        if(data === null) {  // init
            this.closed = ['frame'];                    // stop propagating event
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else {
            this.closed = [];
            data.fromId = node.id;
        }
        // console.log("GifWorker", inputs, data);
    }
}