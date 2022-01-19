import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class MultiplexerComponentWorker extends Rete.Component {
    constructor() {
        super("Multiplexer");
    }

    task = {
        outputs: {event: 'option', frame: 'output'}
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    async worker(node: NodeData, inputs: any, data: any) {
        console.log("Multiplex", inputs, data);
        // @ts-ignore:next-line
        this.next.forEach(t => t.task.reset()); // hacky workaround so rete doesn't optimize away the "unchanging" output of next node, as there is no way to reset the current worker from within itself?
        return {frame: inputs.framesIn[0] / 10};
    }
}