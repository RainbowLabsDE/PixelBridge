import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ResolutionControl } from "../controls/resolutionControl";
import { ResolutionSocket } from "../sockets/sockets";

export class ResolutionComponent extends Rete.Component {
    constructor() {
        super("Resolution");
    }

    async builder(node: Node) {
        const resOut = new Rete.Output('res', "Resolution", ResolutionSocket);
        node.addControl(new ResolutionControl(this.editor, 'resolution', 'Resolution')).addOutput(resOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['res'] = node.data.resolution;
    }
}
