import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { FrameSocket, NumSocket } from "../sockets/sockets";

export class FrameLimiterComponent extends Rete.Component {
    constructor() {
        super("Frame Limiter");
    }

    async builder(node: Rete.Node) {
        const fps = new Rete.Input('fps', "FPS", NumSocket);
        const framesIn = new Rete.Input('frameIn', "Frame Input", FrameSocket);
        const frameOut = new Rete.Output('frame', "Frame", FrameSocket);

        fps.addControl(new NumControl(this.editor, 'fps', undefined, undefined, 0, undefined, 0.01));

        node.addInput(fps);
        node.addInput(framesIn);
        node.addOutput(frameOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}