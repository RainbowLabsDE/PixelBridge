import * as Rete from "rete";

import { NodeData, WorkerInputs } from "rete/types/core/data";
import { ArtnetSource } from "../../sources/ArtnetSource";
import { Tpm2NetSource } from "../../sources/Tpm2NetSource";
import { BackendInstanceManager, InstanceState } from "../backendInstanceManager";
import { Frame } from "../frame.interface";
import { Resolution } from "../resolution.interface";
import { ReteTask } from "../reteTask.interface";

interface Tpm2NetInputParams {
    port: number;
    resolution: Resolution;
}

export class Tpm2NetInputComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager) {
        super("TPM2.net Input");
    }

    tasks: {[id: number]: ReteTask} = {};

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: {frame: 'option'},
        init: (task: ReteTask, node: NodeData) => { // gets called on engine.process
            this.tasks[node.id] = task;
            task.run(null);                         // init node instance with parameters from inputs (has to be done via the worker)
        }
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    initBackend = async (node: NodeData, inputs: WorkerInputs) => {
        const nodeParams: Tpm2NetInputParams = {
            port: (inputs['port']?.length ? inputs['port'][0] : node.data.port) as number,
            resolution: (inputs['outRes']?.length ? inputs['outRes'][0] : node.data.resolution) as Resolution
        };

    
        // check for undefined parameters
        if (nodeParams.port == undefined || nodeParams.resolution?.x == undefined || nodeParams.resolution?.y == undefined) {
            return;
        }

        this.instMgr.createOrReconfigureInstance(node, nodeParams, () => 
            new Tpm2NetSource(
                nodeParams.resolution.x, 
                nodeParams.resolution.y, 
                (f: Frame) => { this.tasks[node.id].run({frame: f}); }, 
                nodeParams.port)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        if (data === null) {
            this.closed = ['frame'];                    // stop propagating event
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        } 
        else {
            this.closed = [];   // enable propagating event again
            data.fromId = node.id;
            // don't have to do more, frame data is already contained in data (called from Source frame callback)
        }
    }
}