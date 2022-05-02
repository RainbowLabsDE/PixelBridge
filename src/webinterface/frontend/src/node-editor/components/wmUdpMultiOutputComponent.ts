import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/numControl";
import { TextControl } from "../controls/textControl";
import { RawPixelArrSocket, TextSocket } from "../sockets/sockets";

export class WmUdpMultiOutputComponent extends Rete.Component {
    constructor() {
        super("WindowMatrix UDP Multi Output");
    }

    async builder(node: Rete.Node) {

        const onChange = (i: number) => {
            let numAddressInputs = 0;
            node.controls.forEach((control, _) => {
                if (control.key.includes('macAddress')) {
                    numAddressInputs++;
                    const addrId = control.key.match(/macAddress(\d+)/)[1];
                    if (Number(addrId) >= i) {
                        node.removeControl(control);
                    }
                }
            });

            for (let n = numAddressInputs; n < i; n++) {
                node.addControl(new TextControl(this.editor, 'macAddress' + n));
            }
            node.update();
        }

        // const addrIn = new Rete.Input('addrIn', "Root Address", TextSocket);
        const pixelIn = new Rete.Input('rawPixIn', "RawPixels[]", RawPixelArrSocket);

        const rootAddrCtrl = new TextControl(this.editor, 'rootAddr');
        const countCtrl = new NumControl(this.editor, 'count', false, onChange, 0);

        node.addInput(pixelIn);
        node.addControl(rootAddrCtrl);
        node.addControl(countCtrl);

        // initialize component with correct amount of fields
        onChange(Number(countCtrl.getData('count')));

    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}