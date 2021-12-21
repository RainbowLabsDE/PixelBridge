import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ResolutionControl } from "../controls/resolutionControl";
import { ResolutionSocket } from "../sockets/sockets";

export class ResolutionComponent extends Rete.Component {
    constructor() {
        super("Resolution");
    }

    async builder(node: Node) {
        const out1 = new Rete.Output('res', "Resolution", ResolutionSocket);
        node.addControl(new ResolutionControl(this.editor, 'resolution')).addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}
