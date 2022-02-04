import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { NumSocket } from "../sockets/sockets";

export class NumComponent extends Rete.Component {
    constructor() { super("Number"); }

    async builder(node: Node) {
        const numOut = new Rete.Output('numOut', "Number", NumSocket);
        node.addControl(new NumControl(this.editor, 'num')).addOutput(numOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['numOut'] = node.data.num;
    }
}
