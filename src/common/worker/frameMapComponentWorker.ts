import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ModuleMapFlip, ModuleMapOrientation, ModuleMappingConverter, ModuleMappingParams, ModuleMapStart, ModuleMapType } from "../../converters/ModuleMappingConverter";
import { SplitFrameToModulesConverter } from "../../converters/SplitFrameToModulesConverter";
import { ReteTask } from "../reteTask.interface";
import { createOrReconfigureInstance, InstanceState } from "../util";



interface FrameMapComponentState extends InstanceState {
    instance: SplitFrameToModulesConverter;
    params: ModuleMappingParams;
}

export class FrameMapComponentWorker extends Rete.Component {
    constructor() {
        super("Frame Mapping");
    }

    converters: { [id: number]: FrameMapComponentState } = {};
    tasks: { [id: number]: ReteTask } = {};

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: { frameArrOut: 'option' },
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

        const params: ModuleMappingParams = {
            mapType: node.data.mapTypeCtrl as ModuleMapType,
            mapOrientation: node.data.mapOrientCtrl as ModuleMapOrientation,
            mapFlip: node.data.mapFlipCtrl as ModuleMapFlip,
            mapStart: node.data.mapStartCtrl as ModuleMapStart
        };

        // check for undefined parameters
        if (params.mapType == undefined || params.mapOrientation == undefined || params.mapFlip == undefined || params.mapStart == undefined) {
            return;
        }

        createOrReconfigureInstance(node, this.converters, params, () =>
            new ModuleMappingConverter(params)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: any) {
        if (data === null) {
            this.closed = ['frameArrOut'];              // stop propagating event
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.converters[node.id]?.instance) {
            this.closed = [];                           // enable propagating event again
            data.fromId = node.id;
            data.frameArr = await this.component.converters[node.id].instance.convert(data.frameArr);
        }
        else {
            this.closed = ['frameArrOut'];              // stop propagating event
        }

    }
}