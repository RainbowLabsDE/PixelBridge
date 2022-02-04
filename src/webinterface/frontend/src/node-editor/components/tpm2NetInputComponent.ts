import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { ResolutionControl } from "../controls/resolutionControl";
import { FrameSocket, NumSocket, ResolutionSocket } from "../sockets/sockets";

export class Tpm2NetInputComponent extends Rete.Component {
    constructor() {
        super("TPM2.net Input");
    }

    async builder(node: Rete.Node) {
        const resIn = new Rete.Input('outRes', "Output Resolution", ResolutionSocket);
        const portIn = new Rete.Input('port', "Port", NumSocket);
        const frameOut = new Rete.Output('frame', "Frame", FrameSocket);

        resIn.addControl(new ResolutionControl(this.editor, 'resolution', resIn.name));
        portIn.addControl(new NumControl(this.editor, 'port'));
        
        node.addInput(resIn);
        node.addInput(portIn);
        node.addOutput(frameOut);

        portIn.control.putData('port', 65506);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}