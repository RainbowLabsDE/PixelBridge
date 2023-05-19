import * as Rete from "rete";
import { NodeData, WorkerInputs } from "rete/types/core/data";
import { BackendInstanceManager } from "../backendInstanceManager";
import { ReteTask } from "../reteTask.interface";
import { WmUdpMultiSink } from "../../sinks/WmUdpMultiSink";

interface WMUDPMultiOutParams {
    address: string;
    numMacAddrs: number;
    macAddrs: string[];
}

export class WmUDPMultiOutputComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager) {
        super("WindowMatrix UDP Multi Output");
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

        const params: WMUDPMultiOutParams = {
            address: node.data.rootAddr as string,
            numMacAddrs: node.data.count as number,
            macAddrs: []
        };
        Object.keys(node.data).forEach((key) => {
            const addrMatch = key.match(/macAddress(\d+)/);
            if (addrMatch) {
                const addrId = addrMatch[1];
                params.macAddrs[addrId] = node.data[key];
            }
        });

        // check for undefined parameters
        if (params.numMacAddrs == undefined) {
            return;
        }

        this.instMgr.createOrReconfigureInstance(node, params, () =>
            new WmUdpMultiSink(params.address, params.macAddrs)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        if (data === null) {
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.instMgr.getInstance(node)?.instance && data.frameArr?.frames) {
            this.component.instMgr.getInstance(node).instance.sendFrames(data.frameArr.frames);
        }

    }
}