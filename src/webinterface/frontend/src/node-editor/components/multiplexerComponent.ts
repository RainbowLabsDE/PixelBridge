import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { TextControl } from "../controls/textControl";
import { EventSocket, FrameSocket, TextSocket } from "../sockets/sockets";

export class MultiplexerComponent extends Rete.Component {
    constructor() {
        super("Multiplexer");
    }

    async builder(node: Rete.Node) {
        const eventIn = new Rete.Input('eventIn', "Event", EventSocket, true);
        const framesIn = new Rete.Input('framesIn', "Frame Inputs", FrameSocket, true);
        const eventOut = new Rete.Output('event', "Event", EventSocket);
        const frameOut = new Rete.Output('frame', "Frame", FrameSocket);

        node.addInput(eventIn);
        node.addInput(framesIn);
        node.addOutput(eventOut);
        node.addOutput(frameOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}