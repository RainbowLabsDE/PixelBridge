import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class GifInputComponentWorker extends Rete.Component {
    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)

    constructor() {
        super("GIF Input");
    }

    interval = {};

    task = {
        outputs: {frame: 'option'},
        init: (task, node) => { // gets called on engine.process
            console.log('Task init', task, node, task.inputs.outRes);
            task.run(null);
            if (this.interval[node.id]) {
                clearInterval(this.interval[node.id]);
            }
            this.interval[node.id] = setInterval(() => {task.run({timestamp: Date.now()});}, 1000);
        }
    };
    closed: any;

    initBackend = async (node: NodeData, inputs: WorkerInputs) => {
        console.log(node.id, inputs);
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    // this is now a task worker
    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        console.log("GifWorker", inputs, data);

        if(data === null) {  // init
            this.closed = ['event'];                    // stop propagating event
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else {
            this.closed = [];
            data.fromId = node.id;
        }
    }
}