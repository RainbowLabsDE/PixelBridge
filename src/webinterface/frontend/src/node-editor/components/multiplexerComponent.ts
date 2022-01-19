import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { TextControl } from "../controls/textControl";
import { FrameSocket, TextSocket } from "../sockets/sockets";

export class MultiplexerComponent extends Rete.Component {
    constructor() {
        super("Multiplexer");
    }

    async builder(node: Rete.Node) {
        const framesIn = new Rete.Input('framesIn', "Frame Inputs", FrameSocket, true);
        const frameOut = new Rete.Output('frame', "Frame", FrameSocket);

        node.addInput(framesIn);
        node.addOutput(frameOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}