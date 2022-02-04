import * as Rete from "rete";
import { NodeData, WorkerInputs } from "rete/types/core/data";
import { FrameLimiterConverter } from "../../converters/FrameLimiterConverter";
import { BackendInstanceManager } from "../backendInstanceManager";
import { ReteTask } from "../reteTask.interface";

interface FrameLimiterComponentParams {
    fps: number;
}

export class FrameLimiterComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager) {
        super("Frame Limiter");
    }

    tasks: { [id: number]: ReteTask } = {};

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: { frame: 'option' },
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
        const fps = (inputs['fps']?.length ? inputs['fps'][0] : node.data.fps) as number;

        // check for undefined parameters
        if (fps == undefined) {
            return;
        }

        const params: FrameLimiterComponentParams = {
            fps: fps
        };

        this.instMgr.createOrReconfigureInstance(node, params, () =>
            new FrameLimiterConverter(fps)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        // TODO: do parameter getting and precalculation only once during init
        if (data === null) {
            this.closed = ['frame'];                 // stop propagating event
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.instMgr.getInstance(node)?.instance) {
            let frame = await this.component.instMgr.getInstance(node).instance.convert(data.frame);
            if (frame !== null) {
                this.closed = [];                       // enable propagating event again
                data.fromId = node.id;
            }
            else {
                this.closed = ['frame'];             // stop propagating event
            }

        }
        else {
            this.closed = ['frame'];                 // stop propagating event
        }

    }
}