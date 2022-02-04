import Rete, { Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { NumSocket } from "../sockets/sockets";

export class AddComponent extends Rete.Component {
    constructor(){ super("Add"); }

    async builder(node: Node) {
        const num1In = new Rete.Input('num',"Number", NumSocket);
        const num2In = new Rete.Input('num2', "Number2", NumSocket);
        const numOut = new Rete.Output('res', "Number", NumSocket);

        num1In.addControl(new NumControl(this.editor, 'num'))
        num2In.addControl(new NumControl(this.editor, 'num2'))

        node.addInput(num1In);
        node.addInput(num2In);
        node.addControl(new NumControl(this.editor, 'preview', true));
        node.addOutput(numOut);
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