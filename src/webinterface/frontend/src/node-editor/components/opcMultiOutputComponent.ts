import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { TextControl } from "../controls/textControl";
import { FrameArraySocket } from "../sockets/sockets";

export class OPCMultiOutputComponent extends Rete.Component {
    constructor() {
        super("OPC Multi Output");
    }

    async builder(node: Rete.Node) {
        
        const onChange = (i: number) => {
            console.log(i);
            node.controls.forEach((control, _) => {
                if (control.key.includes('address')) {
                    node.removeControl(control);
                }
            });

            for (let n = 0; n < i; n++) {
                // node.addInput(new Rete.)
                node.addControl(new TextControl(this.editor, 'address' + n));
            }
            console.log(node);
            node.update();
        }
        
        // const in0 = new Rete.Input('outRes', "Output Resolution", ResolutionSocket);
        // const in1 = new Rete.Input('port', "Port", NumSocket);
        const frameIn = new Rete.Input('frame', "Frame[]", FrameArraySocket);

        // in0.addControl(new ResolutionControl(this.editor, 'resolution', in0.name));
        // in1.addControl(new NumControl(this.editor, 'port'));
        
        node.addInput(frameIn);
        node.addControl(new NumControl(this.editor, 'count', false, onChange));
        console.log(node);

        onChange(node.getConnections.length);

    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}