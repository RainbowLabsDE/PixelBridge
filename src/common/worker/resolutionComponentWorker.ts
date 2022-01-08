import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class ResolutionComponentWorker extends Rete.Component {
    constructor() {
        super("Resolution");
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['res'] = node.data.resolution;
    }
}