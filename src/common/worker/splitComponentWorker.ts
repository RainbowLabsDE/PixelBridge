import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class SplitComponentWorker extends Rete.Component {
    constructor() {
        super("Split");
    }

    task = {
        outputs: {event: 'option', frameArr: 'output'}
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        console.log("SplitWorker", inputs, data);
        return {frameArr: 'whatever'};
    }
}