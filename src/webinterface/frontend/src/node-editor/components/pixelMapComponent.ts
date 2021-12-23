import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SelectionControl, SelectionOption } from "../controls/selectionControl";
import { FrameArraySocket, RawPixelArrSocket } from "../sockets/sockets";

export class PixelMapComponent extends Rete.Component {
    constructor() {
        super("Pixel Mapping");
    }

    async builder(node: Rete.Node) {
        const frameIn = new Rete.Input('frameArrIn', "Frame[] Input", FrameArraySocket);
        const pixelOut = new Rete.Output('pixelArrOut', "RawPixels[]", RawPixelArrSocket);
        const mapTypeOptions: SelectionOption[] = [
            { value: 'line', name: 'Line by Line' },
            { value: 'snake', name: 'Snake' }
        ];
        const ctrlMapType = new SelectionControl(this.editor, 'mapTypeCtrl', "Mapping Type", mapTypeOptions);

        const mapOrientOptions: SelectionOption[] = [
            { value: 'horz', name: 'Horizontal' },
            { value: 'vert', name: 'Vertical' }
        ];
        const ctrlMapOrient = new SelectionControl(this.editor, 'mapOrientCtrl', "Mapping Orientation", mapOrientOptions);

        const mapStartOptions: SelectionOption[] = [
            { value: 'tl', name: 'Top Left' },
            { value: 'tr', name: 'Top Right' },
            { value: 'bl', name: 'Bottom Left' },
            { value: 'br', name: 'Bottom Right' }
        ];
        const ctrlMapStart = new SelectionControl(this.editor, 'mapStartCtrl', "Mapping Start", mapStartOptions);

        node.addControl(ctrlMapType);
        node.addControl(ctrlMapOrient);
        node.addControl(ctrlMapStart);
        node.addInput(frameIn);
        node.addOutput(pixelOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}