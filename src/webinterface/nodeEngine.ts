import "regenerator-runtime";
import * as Rete from "rete";
import TaskPlugin from 'rete-task-plugin';
import { Data } from 'rete/types/core/data';
import { config } from "../config/config";
import { ArtnetInputComponentWorker } from "../common/worker/artnetInputComponentWorker";
import { NumComponentWorker } from "../common/worker/numComponentWorker";
import { ResolutionComponentWorker } from "../common/worker/resolutionComponentWorker";
import { SplitComponentWorker } from "../common/worker/splitComponentWorker";
import { GifInputComponentWorker } from "../common/worker/gifInputComponentWorker";
import { MultiplexerComponentWorker } from "../common/worker/multiplexerComponentWorker";
import { FrameMapComponentWorker } from "../common/worker/frameMapComponentWorker";
import { BackendInstanceManager } from "../common/backendInstanceManager";
import { PixelMapComponentWorker } from "../common/worker/pixelMapComponentWorker";
import { OPCMultiOutputComponentWorker } from "../common/worker/opcMultiOutputComponentWorker";
import { Tpm2NetInputComponentWorker } from "../common/worker/tpm2NetInputComponentWorker";
import { SerialOutputComponentWorker } from "../common/worker/serialOutputComponentWorker";
import { FrameLimiterComponentWorker } from "../common/worker/frameLimiterComponentWorker";
import { WmUDPMultiOutputComponentWorker } from "../common/worker/wmUdpMultiOutputComponentWorker";


export class NodeEngine {
    engine: Rete.Engine;
    instMgr = new BackendInstanceManager();

    constructor() {
        const components: Rete.Component[] = [
            new ArtnetInputComponentWorker(this.instMgr),
            new SplitComponentWorker(this.instMgr),
            new ResolutionComponentWorker(),
            new NumComponentWorker(),
            new GifInputComponentWorker(),
            new MultiplexerComponentWorker(),
            new FrameMapComponentWorker(this.instMgr),
            new PixelMapComponentWorker(this.instMgr),
            new OPCMultiOutputComponentWorker(this.instMgr),
            new Tpm2NetInputComponentWorker(this.instMgr),
            new SerialOutputComponentWorker(this.instMgr),
            new FrameLimiterComponentWorker(this.instMgr),
            new WmUDPMultiOutputComponentWorker(this.instMgr),
        ];
        this.engine = new Rete.Engine('pixelbridge@1.0.0');
        this.engine.use(TaskPlugin);
        components.forEach(c => this.engine.register(c));
        if (config?.nodeEditor?.editorState) {
            this.process(config.nodeEditor.editorState);
        }
    }


    process = async (data: Data) => {
        await this.engine.abort();

        // check for removed nodes and remove them from instance manager
        // TODO: detect if completely new config got loaded and remove all instances in this case
        const curNodes = this.engine.data?.nodes;
        if (curNodes) {
            const newNodes = data.nodes;
            const removedNodes = Object.keys(curNodes).filter(nodeId => !Object.keys(newNodes).includes(nodeId));
            this.instMgr.handleRemovedNodes(removedNodes);
        }

        return this.engine.process(data);
    }

}