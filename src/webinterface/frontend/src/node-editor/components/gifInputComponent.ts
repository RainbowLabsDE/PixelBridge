import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ResolutionControl } from "../controls/resolutionControl";
import { TextControl } from "../controls/textControl";
import { EventSocket, FrameSocket, ResolutionSocket, TextSocket } from "../sockets/sockets";

export class GifInputComponent extends Rete.Component {
    constructor() {
        super("GIF Input");
    }

    async builder(node: Rete.Node) {
        const resIn = new Rete.Input('outRes', "Output Resolution", ResolutionSocket);
        const pathIn = new Rete.Input('path', "Path", TextSocket);
        const eventOut = new Rete.Output('event', "Event", EventSocket);
        const frameOut = new Rete.Output('frame', "Frame", FrameSocket);

        resIn.addControl(new ResolutionControl(this.editor, 'resolution', resIn.name));
        pathIn.addControl(new TextControl(this.editor, 'path'));

        node.addInput(resIn);
        node.addInput(pathIn);
        node.addOutput(eventOut);
        node.addOutput(frameOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}