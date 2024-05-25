import * as Rete from "rete";
import { NodeData, WorkerInputs } from "rete/types/core/data";
import { BackendInstanceManager } from "../backendInstanceManager";
import { ReteTask } from "../reteTask.interface";
import { OPCMultiSink } from "../../sinks/OPCMultiSink";
import { WorkerPassthroughData } from "../workerPassthroughData.interface";

interface OpcMultiOutParams {
    numAddresses: number;
    addresses: string[];
}

export class OPCMultiOutputComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager) {
        super("OPC Multi Output");
    }

    tasks: { [id: number]: ReteTask } = {};

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: { },
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

        const params: OpcMultiOutParams = {
            numAddresses: node.data.count as number,
            addresses: []
        };
        Object.keys(node.data).forEach((key) => {
            const addrMatch = key.match(/address(\d+)/);
            if (addrMatch) {
                const addrId = addrMatch[1];
                params.addresses[addrId] = node.data[key];
            }
        });

        // check for undefined parameters
        if (params.numAddresses == undefined) {
            return;
        }

        this.instMgr.createOrReconfigureInstance(node, params, () =>
            new OPCMultiSink(params.addresses)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: WorkerPassthroughData) {
        const upstreamNodeId = node.inputs.rawPixIn.connections[0]?.node;   // inputs.<key> must match input key in builder definition (see above)
        if (data === null) {
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.instMgr.getInstance(node)?.instance && data[upstreamNodeId].frameArr?.frames) {
            this.component.instMgr.getInstance(node).instance.sendFrames(data[upstreamNodeId].frameArr.frames);
        }

    }
}