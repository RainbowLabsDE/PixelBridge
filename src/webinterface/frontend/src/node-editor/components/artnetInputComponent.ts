import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { ResolutionControl } from "../controls/resolutionControl";
import { FrameSocket, NumSocket, ResolutionSocket } from "../sockets/sockets";

export class ArtnetInputComponent extends Rete.Component {
    constructor() {
        super("ArtNet Input");
    }

    async builder(node: Rete.Node) {
        const resIn = new Rete.Input('outRes', "Output Resolution", ResolutionSocket);
        const portIn = new Rete.Input('port', "Port", NumSocket);
        const universeIn = new Rete.Input('universe', "Start Universe", NumSocket);
        const frameOut = new Rete.Output('frame', "Frame", FrameSocket);

        resIn.addControl(new ResolutionControl(this.editor, 'resolution', resIn.name));
        portIn.addControl(new NumControl(this.editor, 'port'));
        universeIn.addControl(new NumControl(this.editor, 'startUniverse'));
        
        node.addInput(resIn);
        node.addInput(portIn);
        node.addInput(universeIn);
        node.addOutput(frameOut);

        if (portIn.control.getData('port') === undefined) {
            portIn.control.putData('port', 6454);
        }
        if (universeIn.control.getData('startUniverse') === undefined) {
            universeIn.control.putData('startUniverse', 1);

        }
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}