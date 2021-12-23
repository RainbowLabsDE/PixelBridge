import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ResolutionControl } from "../controls/resolutionControl";
import { FrameArraySocket, FrameSocket, ResolutionSocket } from "../sockets/sockets";

export class SplitComponent extends Rete.Component {
    constructor() {
        super("Split");
    }

    async builder(node: Rete.Node) {
        const in1 = new Rete.Input('frames', "Frame Input", FrameSocket);
        const out1 = new Rete.Output('frameArr', "Frame[]", FrameArraySocket);
        const inRes = new Rete.Input('res', "Single Module Resolution", ResolutionSocket);

        inRes.addControl(new ResolutionControl(this.editor, 'resCtrl', inRes.name));
        
        node.addInput(inRes);
        node.addInput(in1);
        node.addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}