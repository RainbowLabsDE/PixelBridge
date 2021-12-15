import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { FrameSocket } from "../sockets/sockets";

export class ArtnetComponent extends Rete.Component {
    constructor() {
        super("ArtNet");
    }

    async builder(node: Rete.Node) {
        const out1 = new Rete.Output('frame', "Frame", FrameSocket);
        node.addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}