import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { TextControl } from "../controls/textControl";
import { RawPixelArrSocket } from "../sockets/sockets";

export class OPCMultiOutputComponent extends Rete.Component {
    constructor() {
        super("OPC Multi Output");
    }

    async builder(node: Rete.Node) {

        const onChange = (i: number) => {
            let numAddressInputs = 0;
            node.controls.forEach((control, _) => {
                if (control.key.includes('address')) {
                    numAddressInputs++;
                    const addrId = control.key.match(/address(\d+)/)[1];
                    if (Number(addrId) >= i) {
                        node.removeControl(control);
                    }
                }
            });

            for (let n = numAddressInputs; n < i; n++) {
                node.addControl(new TextControl(this.editor, 'address' + n));
            }
            node.update();
        }

        const pixelIn = new Rete.Input('rawPixIn', "RawPixels[]", RawPixelArrSocket);

        node.addInput(pixelIn);
        node.addControl(new NumControl(this.editor, 'count', false, onChange));

        onChange(0);

    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}