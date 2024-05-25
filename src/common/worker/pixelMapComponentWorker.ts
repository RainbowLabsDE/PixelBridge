import * as Rete from "rete";
import { NodeData, WorkerInputs } from "rete/types/core/data";
import { MapOrientation, MappingParams, MapStart, MapType } from "../MappingGenerator";
import { BackendInstanceManager } from "../backendInstanceManager";
import { ReteTask } from "../reteTask.interface";
import { PixelMappingConverter } from "../../converters/PixelMappingConverter";
import { WorkerPassthroughData } from "../workerPassthroughData.interface";


export class PixelMapComponentWorker extends Rete.Component {
    constructor(protected instMgr: BackendInstanceManager) {
        super("Pixel Mapping");
    }

    tasks: { [id: number]: ReteTask } = {};

    [x: string]: any;   // make Typescript happy (allow arbitrary member variables, as there is no definition file for Rete Tasks)
    task = {
        outputs: { pixelArrOut: 'option' },
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

        const params: MappingParams = {
            mapType: node.data.mapTypeCtrl as MapType,
            mapOrientation: node.data.mapOrientCtrl as MapOrientation,
            mapStart: node.data.mapStartCtrl as MapStart
        };

        // check for undefined parameters
        if (params.mapType == undefined || params.mapOrientation == undefined || params.mapStart == undefined) {
            return;
        }

        this.instMgr.createOrReconfigureInstance(node, params, () =>
            new PixelMappingConverter(params)
        );
    }

    async worker(node: NodeData, inputs: WorkerInputs, data: WorkerPassthroughData) {
        if (data === null) {
            this.closed = ['pixelArrOut'];              // stop propagating event
            this.component.initBackend(node, inputs);   // worker is run outside of current class context, so we need to acess initBackend via .component
        }
        else if (this.component.instMgr.getInstance(node)?.instance) {
            this.closed = [];                           // enable propagating event again
            const upstreamNodeId = node.inputs.frameArrIn.connections[0]?.node;   // inputs.<key> must match input key in builder definition (see above)
            data[node.id] = {frameArr: await this.component.instMgr.getInstance(node).instance.convert(data[upstreamNodeId].frameArr)};
        }
        else {
            this.closed = ['pixelArrOut'];              // stop propagating event
        }

    }
}