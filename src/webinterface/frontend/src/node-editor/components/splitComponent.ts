import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ResolutionControl } from "../controls/resolutionControl";
import { FrameArraySocket, FrameSocket, ResolutionSocket } from "../sockets/sockets";

export class SplitComponent extends Rete.Component {
    constructor() {
        super("Split");
    }

    async builder(node: Rete.Node) {
        const framesIn = new Rete.Input('frames', "Frame Input", FrameSocket);
        const frameArrOut = new Rete.Output('frameArr', "Frame[]", FrameArraySocket);
        const resIn = new Rete.Input('res', "Single Module Resolution", ResolutionSocket);

        resIn.addControl(new ResolutionControl(this.editor, 'resCtrl', resIn.name));

        node.addInput(resIn);
        node.addInput(framesIn);
        node.addOutput(frameArrOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}