import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class NumComponentWorker extends Rete.Component {
    constructor() { super("Number"); }

    async builder(node: Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['numOut'] = node.data.num;
    }
}
