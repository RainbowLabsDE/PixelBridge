import * as Rete from "rete";
import { NodeData, WorkerInputs } from "rete/types/core/data";
import { SplitFrameToModulesConverter } from "../../converters/SplitFrameToModulesConverter";
import { BackendInstanceManager } from "../backendInstanceManager";
import { Resolution } from "../resolution.interface";
import { ReteTask } from "../reteTask.interface";
import { WorkerPassthroughData } from "../workerPassthroughData.interface";

interface SplitComponentParams {
    resolution: Resolution;
}

export class SplitComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager) {
        super("Split");
    }

    tasks: {[id: number]: ReteTask} = {};

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: {frameArr: 'option'},
        init: (task: ReteTask, node: NodeData) => { // gets called on engine.process
            this.tasks[node.id] = task;
            task.run(null);                         // init node instance with parameters from inputs (has to be done via the worker)
        }
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    initBackend = async (node: NodeData, inputs: WorkerInputs) => {
        // get node parameters
        const moduleRes = (inputs['res']?.length ? inputs['res'][0] : node.data.resolution) as Resolution;

        // check for undefined parameters
        if (moduleRes?.x == undefined || moduleRes?.y == undefined) {
            return;
        }

        const params: SplitComponentParams = {
            resolution: moduleRes
        };

        this.instMgr.createOrReconfigureInstance(node, params, () =>
            new SplitFrameToModulesConverter(params.resolution.x, params.resolution.y)
        );
    }
    
    async worker(node: NodeData, inputs: WorkerInputs, data: WorkerPassthroughData) {
        // TODO: do parameter getting and precalculation only once during init
        if (data === null) {
            this.closed = ['frameArr'];                 // stop propagating event
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.instMgr.getInstance(node)?.instance) {
            const upstreamNodeId = node.inputs.frames.connections[0]?.node;   // inputs.<key> must match input key in builder definition (see above)
            this.closed = [];                           // enable propagating event again
            data[node.id] = {frameArr: await this.component.instMgr.getInstance(node).instance.convert(data[upstreamNodeId].frame)}; 
        }
        else {
            this.closed = ['frameArr'];                 // stop propagating event
        }

    }
}