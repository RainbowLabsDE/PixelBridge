import * as Rete from "rete";
import { NodeData, WorkerInputs } from "rete/types/core/data";
import { BackendInstanceManager } from "../backendInstanceManager";
import { ReteTask } from "../reteTask.interface";
import { FrameArr } from "../frameArr.interface";
import { Frame } from "../frame.interface";
import { WebServer } from "../../webinterface/server";
import { Resolution } from "../resolution.interface";
import { PreviewSink } from "../../sinks/PreviewSink";

interface PreviewOutParams {
    resolution: Resolution;
}

// currently simply concatenates incoming frame segments, not sure what else to do rn
export class PreviewOutputComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager, protected webServer: WebServer) {
        super("Preview Output");
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
        const res = (inputs['res']?.length ? inputs['res'][0] : node.data.resolution) as Resolution;
        const params: PreviewOutParams = {
            resolution: res,
        };

        params.resolution ??= {x: null, y: null};
        params.resolution.x ??= 0;
        params.resolution.y ??= 0;

        this.instMgr.createOrReconfigureInstance(node, params, () =>
            new PreviewSink(params.resolution.x, params.resolution.y, node.id, this.webServer)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        if (data === null) {
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.instMgr.getInstance(node)?.instance && (data.frameArr?.frames || data.frame)) {
            let outFrame: Frame;
            if (data.frameArr) {
                const frameArr: FrameArr = data.frameArr;
    
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
                outFrame = mergedFrame;
            }
            else if(data.frame) {
                outFrame = data.frame;
            }

            // send out merged frame
            this.component.instMgr.getInstance(node).instance.sendFrame(outFrame);
        }

    }
}