import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Frame } from "../frame.interface";
import { Resolution } from "../resolution.interface";
import { ReteTask } from "../reteTask.interface";
import { BackendInstanceManager, InstanceState } from "../backendInstanceManager";
import { GifSource } from "../../sources/GifSource";

interface GifInputParams {
    resolution: Resolution;
    path: string;
}

// currently does only dummy stuff (my debug node for testing out Rete Tasks)
export class GifInputComponentWorker extends Rete.Component {
    
    constructor(protected instMgr: BackendInstanceManager) {
        super("GIF Input");
    }
    
    interval = {};

    tasks: { [id: number]: ReteTask } = {};
    
    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: {frame: 'option'},
        init: (task, node) => { // gets called on engine.process
            this.tasks[node.id] = task;
            task.run(null);                         // init node instance with parameters from inputs (has to be done via the worker)
        }
    };

    initBackend = async (node: NodeData, inputs: WorkerInputs) => {
        const nodeParams: GifInputParams = {
            resolution: (inputs['outRes']?.length ? inputs['outRes'][0] : node.data.resolution) as Resolution,
            path: node.data.path as string,
        };

        // check for undefined parameters
        if (nodeParams.path == undefined || nodeParams.resolution?.x == undefined || nodeParams.resolution?.y == undefined) {
            return;
        }

        const task = this.task[node.id];

        this.instMgr.createOrReconfigureInstance(node, nodeParams, () =>
            new GifSource(
                nodeParams.resolution.x,
                nodeParams.resolution.y,
                (f: Frame) => { this.tasks[node.id].run({frame: f}); },
                nodeParams.path )
        );
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