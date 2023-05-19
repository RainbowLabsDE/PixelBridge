import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { FrameSocket, NumSocket } from "../sockets/sockets";

export class GammaComponent extends Rete.Component {
    constructor() {
        super("Gamma Correction");
    }

    async builder(node: Rete.Node) {
        const gamma = new Rete.Input('gamma', "Gamma", NumSocket);
        const framesIn = new Rete.Input('frameIn', "Frame Input", FrameSocket);
        const frameOut = new Rete.Output('frame', "Frame", FrameSocket);

        gamma.addControl(new NumControl(this.editor, 'gamma', undefined, undefined, 0, undefined, 0.1));

        node.addInput(gamma);
        node.addInput(framesIn);
        node.addOutput(frameOut);

        if (gamma.control.getData('gamma') === undefined) {
            gamma.control.putData('gamma', 2.2);
        }
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}