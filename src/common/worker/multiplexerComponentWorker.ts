import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { WorkerPassthroughData } from "../workerPassthroughData.interface";

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

    async worker(node: NodeData, inputs: any, data: WorkerPassthroughData) {
        // currently does nothing with the data passed through it
        const upstreamNodeId = node.inputs.framesIn.connections[0]?.node;   // inputs.<key> must match input key in builder definition (see above)
        data[node.id] = data[upstreamNodeId];
    }
}