import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SelectionControl, SelectionOption } from "../controls/selectionControl";
import { FrameArraySocket } from "../sockets/sockets";

export class FrameMapComponent extends Rete.Component {
    constructor() {
        super("Frame Mapping");
    }

    async builder(node: Rete.Node) {
        const frameIn = new Rete.Input('frameArrIn', "Frame[] Input", FrameArraySocket);
        const frameOut = new Rete.Output('frameArrOut', "Frame[]", FrameArraySocket);
        
        const mapTypeOptions: SelectionOption[] = [
            { value: 'line', name: 'Line by Line' },
            { value: 'snake', name: 'Snake' },
        ];
        const ctrlMapType = new SelectionControl(this.editor, 'mapTypeCtrl', "Mapping Type", mapTypeOptions);

        const mapOrientOptions: SelectionOption[] = [
            { value: 'horz', name: 'Horizontal' },
            { value: 'vert', name: 'Vertical' }
        ];
        const ctrlMapOrient = new SelectionControl(this.editor, 'mapOrientCtrl', "Mapping Orientation", mapOrientOptions);

        const mapFlipOptions: SelectionOption[] = [
            { value: 'none', name: 'No flipping' },
            { value: 'even', name: 'Even Lines Flipped (Not implemented yet)' },
            { value: 'odd', name: 'Odd Lines Flipped (Not implemented yet)' },
        ];
        const ctrlMapFlip = new SelectionControl(this.editor, 'mapFlipCtrl', "Mapping Flip", mapFlipOptions);

        const mapStartOptions: SelectionOption[] = [
            { value: 'tl', name: 'Top Left' },
            { value: 'tr', name: 'Top Right' },
            { value: 'bl', name: 'Bottom Left' },
            { value: 'br', name: 'Bottom Right' }
        ];
        const ctrlMapStart = new SelectionControl(this.editor, 'mapStartCtrl', "Mapping Start", mapStartOptions);

        node.addControl(ctrlMapType);
        node.addControl(ctrlMapOrient);
        node.addControl(ctrlMapFlip);
        node.addControl(ctrlMapStart);
        node.addInput(frameIn);
        node.addOutput(frameOut);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // do nothing for now
    }
}