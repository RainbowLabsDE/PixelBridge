import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class SplitComponentWorker extends Rete.Component {
    constructor() {
        super("Split");
    }

    task = {
        outputs: {frameArr: 'option'}
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        data.split = 'eh';
        console.log("SplitWorker", inputs, data);
        data.fromId = node.id;
    }
}