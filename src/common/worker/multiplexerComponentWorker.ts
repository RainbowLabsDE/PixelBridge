import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class MultiplexerComponentWorker extends Rete.Component {
    constructor() {
        super("Multiplexer");
    }

    task = {
        outputs: {frame: 'option'}
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    async worker(node: NodeData, inputs: any, data: any) {
        console.log("Multiplex", inputs, data);
        data.fromId = node.id;
    }
}