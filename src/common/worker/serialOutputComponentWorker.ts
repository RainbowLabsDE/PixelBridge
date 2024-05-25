import * as Rete from "rete";
import { NodeData, WorkerInputs } from "rete/types/core/data";
import { BackendInstanceManager } from "../backendInstanceManager";
import { ReteTask } from "../reteTask.interface";
import { OPCSink } from "../../sinks/OPCSink";
import { SerialSink } from "../../sinks/SerialSink";
import { FrameArr } from "../frameArr.interface";
import { Frame } from "../frame.interface";
import { WorkerPassthroughData } from "../workerPassthroughData.interface";

interface SerialOutParams {
    serialPort: string;
    baudrate: number;
    minDelay: number;
}

// currently simply concatenates incoming frame segments, not sure what else to do rn
export class SerialOutputComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager) {
        super("Serial Output");
    }

    tasks: { [id: number]: ReteTask } = {};

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: { },
        init: (task: ReteTask, node: NodeData) => { // gets called on engine.process
            this.tasks[node.id] = task;
            task.run(null);                         // init node instance with parameters from inputs (has to be done via the worker)
        }
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    initBackend = async (node: NodeData, inputs: WorkerInputs) => {
        // get node parameters
        const params: SerialOutParams = {
            serialPort: node.data.serialPort as string,
            baudrate: node.data.serialBaudrate as number,
            minDelay: node.data.minimumDelay as number
        };

        // check for undefined parameters
        if (params.serialPort == undefined || params.baudrate == undefined || params.minDelay == undefined) {
            return;
        }

        this.instMgr.createOrReconfigureInstance(node, params, () =>
            new SerialSink(0, 0, params.serialPort, params.baudrate, params.minDelay)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: WorkerPassthroughData) {
        const upstreamNodeId = node.inputs.rawPixIn.connections[0]?.node;   // inputs.<key> must match input key in builder definition (see above)
        if (data === null) {
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.instMgr.getInstance(node)?.instance && data[upstreamNodeId].frameArr?.frames) {
            const frameArr: FrameArr = data[upstreamNodeId].frameArr;

            // concatenate module frames
            const aggregatedBufSize = frameArr.frames.reduce((sum, frame) => (sum + frame.buffer.length), 0);
            let mergedFrame: Frame = {
                width: frameArr.width * frameArr.frames[0].width,
                height: frameArr.height * frameArr.frames[0].height,
                buffer: Buffer.alloc(aggregatedBufSize)
            }
            frameArr.frames.forEach((frame, i) => {
                let offset = frame.buffer.length * i;
                frame.buffer.copy(mergedFrame.buffer, offset);
            });

            // send out merged frame
            this.component.instMgr.getInstance(node).instance.sendFrame(mergedFrame);
        }

    }
}