import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { NumSocket } from "../sockets/sockets";

export class NumComponent extends Rete.Component {
    constructor(){ super("Number"); }

    async builder(node: Node) {
        const out1 = new Rete.Output('numOut', "Number", NumSocket);
        node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['num'] = node.data.num;
    }
}
