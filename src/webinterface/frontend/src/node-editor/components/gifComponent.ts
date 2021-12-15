import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { TextControl } from "../controls/textControl";
import { FrameSocket, TextSocket } from "../sockets/sockets";

export class GifComponent extends Rete.Component {
    constructor() {
        super("GIF");
    }

    async builder(node: Rete.Node) {
        const in1 = new Rete.Input('path', "Path", TextSocket);
        const out1 = new Rete.Output('frame', "Frame", FrameSocket);

        in1.addControl(new TextControl(this.editor, 'path'));

        node.addInput(in1)
            .addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}