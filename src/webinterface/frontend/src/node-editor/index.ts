import Rete, { Component } from "rete";
import VueRenderPlugin from "rete-vue-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import Keyboardlugin from 'rete-keyboard-plugin';
import MinimapPlugin from "rete-minimap-plugin";
// import CodePlugin from 'rete-code-plugin';
import HistoryPlugin from 'rete-history-plugin';
import CommentPlugin from 'rete-comment-plugin';
import TaskPlugin from 'rete-task-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import { NumComponent } from "./components/numComponent";
import { AddComponent } from "./components/addComponent";
import { ArtnetInputComponent } from "./components/artnetInputComponent";
import { GifInputComponent } from "./components/gifInputComponent";
import { MultiplexerComponent } from "./components/multiplexerComponent";
import { ResolutionComponent } from "./components/resolutionComponent";
import { OPCMultiOutputComponent } from "./components/opcMultiOutputComponent";
import { SplitComponent } from "./components/splitComponent";
import { PixelMapComponent } from "./components/pixelMapComponent";
import { FrameMapComponent } from "./components/frameMapComponent";
import Vue from "vue";
import { Tpm2NetInputComponent } from "./components/tpm2NetInputComponent";
import { OpcInputComponent } from "./components/opcInputComponent";
import { SerialOutputComponent } from "./components/serialOutputComponent";
import { FrameLimiterComponent } from "./components/frameLimiterComponent";
import { WmUdpMultiOutputComponent } from "./components/wmUdpMultiOutputComponent";
import { GammaComponent } from "./components/gammaComponent";
import { PreviewOutputComponent } from "./components/previewOutputComponent";

// in dev mode, UI is hosted on different port, could probably be solved more elegant
const apiUrl = Vue.config.devtools ? `http://${window.location.hostname}:8080/api/nodeEditor` : '/api/nodeEditor';

const getEditorState = async (): Promise<any> => {
    try {
        const response = await fetch(`${apiUrl}/editor`);
        const resJson = await response.json();
        console.log(resJson);
        return resJson;
    }
    catch (e) {
        return {};
    }
}

const postEditorState = async (editorJson: string): Promise<any> => {
    const response = await fetch(`${apiUrl}/editor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: editorJson
    });
    return response;
}

let saveTimeout: number;

const saveEditorState = async (editorJson: string): Promise<any> => {
    // wait 500ms before saving any changes as to not spam the backend
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(postEditorState, 500, editorJson);
}

const getHostname = async (): Promise<any> => {
    try {
        const response = await fetch(`${apiUrl}/hostname`);
        const resJson = await response.json();
        // console.log(resJson);
        if (resJson.hostname && !document.title.startsWith('[')) {
            document.title = `[${resJson.hostname}] ${document.title}`;
        }
        return resJson.hostname;
    }
    catch (e) {
        return {};
    }
}

declare const window: any;

export default async function (container: HTMLElement) {
    const components: Component[] = [
        // Variables
        new NumComponent(),
        new AddComponent(),
        new ResolutionComponent(),
        // Inputs
        new ArtnetInputComponent(),
        new GifInputComponent(),
        new OpcInputComponent(),
        new Tpm2NetInputComponent(),
        new MultiplexerComponent(),
        // Modifiers
        new FrameLimiterComponent(),
        new GammaComponent(),
        // Mapping
        new FrameMapComponent(),
        new PixelMapComponent(),
        new SplitComponent(),
        // Outputs
        new OPCMultiOutputComponent(),
        new SerialOutputComponent(),
        new WmUdpMultiOutputComponent(),
        new PreviewOutputComponent(),
    ];

    const editor = new Rete.NodeEditor("pixelbridge@1.0.0", container);
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);
    editor.use(ContextMenuPlugin);
    editor.use(Keyboardlugin);
    editor.use(AreaPlugin);
    editor.use(MinimapPlugin);
    editor.use(HistoryPlugin, { keyboard: true });
    editor.use(CommentPlugin, { margin: 20 });
    editor.use(AutoArrangePlugin, { margin: { x: 50, y: 50 }, depth: 0 });
    // editor.use(TaskPlugin);

    const engine = new Rete.Engine("pixelbridge@1.0.0");

    components.forEach(c => {
        editor.register(c);
        engine.register(c);
    })

    const editorState = await getEditorState();
    if (Object.keys(editorState).length) {
        editor.fromJSON(editorState);
    }

    editor.on(["process", "nodecreated", "noderemoved", "connectioncreated", "connectionremoved"], async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
    });
    editor.on(["process", "nodecreated", "noderemoved", "connectioncreated", "connectionremoved", "nodetranslated"], async () => {
        await saveEditorState(JSON.stringify(editor.toJSON()));
    });
    editor.on(["connectioncreated", "connectionremoved"], async (connection) => {
        if (connection.input.node) {
            setTimeout(() => editor.view.updateConnections({node: connection.input.node}), 1);
        }
    });

    editor.view.resize();
    editor.trigger("process");
    setTimeout(() => AreaPlugin.zoomAt(editor, editor.nodes), 1);

    // hacky hacky
    window.editor = editor;
    window.editor.areaPlugin = AreaPlugin;
    // window.editor.apiUrl = apiUrl;
    await getHostname();
}
