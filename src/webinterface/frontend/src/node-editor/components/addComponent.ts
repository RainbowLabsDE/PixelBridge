import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { NumSocket } from "../sockets/sockets";

export class AddComponent extends Rete.Component {
    constructor(){ super("Add"); }

    async builder(node: Node) {
        const inp1 = new Rete.Input('num',"Number", NumSocket);
        const inp2 = new Rete.Input('num2', "Number2", NumSocket);
        const out = new Rete.Output('res', "Number", NumSocket);

        inp1.addControl(new NumControl(this.editor, 'num'))
        inp2.addControl(new NumControl(this.editor, 'num2'))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl(this.editor, 'preview', true))
            .addOutput(out);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        const n1 = (inputs['num'].length?inputs['num'][0]:node.data.num1) as number;
        const n2 = (inputs['num2'].length?inputs['num2'][0]:node.data.num2) as number;
        const sum = n1 + n2;
        
        const ctrl = this.editor.nodes.find(n => n.id == node.id).controls.get('preview') as NumControl;
        ctrl.setValue(sum);
        outputs['res'] = sum;
    }
}