import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ArtnetSource } from "../../sources/ArtnetSource";

interface ArtnetInputParams {
    port: number;
    startUniverse: number;
    resolution: Resolution;
}

interface ArtnetInputState {
    artnetSourceInstance: ArtnetSource;
    params: ArtnetInputParams;
}

export class ArtnetInputComponentWorker extends Rete.Component {
    constructor() {
        super("ArtNet Input");
    }

    artnetSources: {[id: number]: ArtnetInputState} = {};

    task = {
        outputs: {}
    }

    async builder(node: Rete.Node) {
        // see node builder definition in webinterface/frontend/src/node-editor/components
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        // console.log("ArtnetInputWorker", node, inputs);

        const nodeParams: ArtnetInputParams = {
            port: (inputs['port'].length ? inputs['port'][0] : node.data.port) as number,
            startUniverse: (inputs['universe'].length ? inputs['universe'][0] : node.data.startUniverse) as number,
            resolution: (inputs['outRes'].length ? inputs['outRes'][0] : node.data.resolution) as Resolution
        };

        // check for undefined parameters
        if (nodeParams.port == undefined || nodeParams.startUniverse == undefined || nodeParams.resolution?.x == undefined || nodeParams.resolution?.y == undefined) {
            return;
        }

        // check if artnetSource already exists for given node ID
        if (node.id in this.artnetSources) {
            const artnetSourceState = this.artnetSources[node.id];  // should be using reference
            // check if parameters have changed
            if (!(JSON.stringify(nodeParams) === JSON.stringify(artnetSourceState.params))) {
                // recreate ArtnetSource with new parameters
                await artnetSourceState.artnetSourceInstance.close();
                delete artnetSourceState.artnetSourceInstance;  // not sure if needed
                artnetSourceState.params = nodeParams;
                artnetSourceState.artnetSourceInstance = new ArtnetSource(nodeParams.resolution.x, nodeParams.resolution.y, (f: Frame) => {}, nodeParams.port, nodeParams.startUniverse);
            }
        }
        else {
            const newArtnetInput: ArtnetInputState = {
                params: nodeParams,
                artnetSourceInstance: new ArtnetSource(nodeParams.resolution.x, nodeParams.resolution.y, (f: Frame) => {}, nodeParams.port, nodeParams.startUniverse)
            }
            this.artnetSources[node.id] = newArtnetInput;
        }

        // TODO: remove created artnet source when node gets deleted
    }
}