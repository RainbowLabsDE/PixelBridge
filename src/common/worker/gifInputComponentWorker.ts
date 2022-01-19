import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

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
            this.interval[node.id] = setInterval(() => {task.run({timestamp: Date.now()});}, 1000);
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
        console.log("GifWorker", inputs, data);
    }
}