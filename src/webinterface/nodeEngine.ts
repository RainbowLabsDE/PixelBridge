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


export class NodeEngine {
    engine: Rete.Engine;

    constructor() {
        const components: Rete.Component[] = [
            new ArtnetInputComponentWorker(),
            new SplitComponentWorker(),
            new ResolutionComponentWorker(),
            new NumComponentWorker(),
            new GifInputComponentWorker(),
            new MultiplexerComponentWorker()            
        ];
        this.engine = new Rete.Engine('pixelbridge@1.0.0');
        this.engine.use(TaskPlugin);
        components.forEach(c => this.engine.register(c));
        if (config?.nodeEditor?.editorState) {
            this.process(config.nodeEditor.editorState);
        }
    }


    process = async (data: Data) => {
        this.engine.abort();
        this.engine.process(data);
    }

}