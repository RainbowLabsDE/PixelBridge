import Rete, { Component } from "rete";
import VueRenderPlugin from "rete-vue-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import MinimapPlugin from "rete-minimap-plugin";
// import CodePlugin from 'rete-code-plugin';
import HistoryPlugin from 'rete-history-plugin';
import CommentPlugin from 'rete-comment-plugin';
import { NumComponent } from "./components/numComponent";
import { AddComponent } from "./components/addComponent";
import { ArtnetComponent } from "./components/artnetComponent";
import { GifComponent } from "./components/gifComponent";
import { MultiplexerComponent } from "./components/multiplexerComponent";
import { ResolutionComponent } from "./components/resolutionComponent";
import { OPCMultiOutputComponent } from "./components/opcMultiOutputComponent";
import { SplitComponent } from "./components/splitComponent";
import { PixelMapComponent } from "./components/pixelMapComponent";
import { FrameMapComponent } from "./components/frameMapComponent";

const apiUrl = 'http://localhost:8080/api/nodeEditor'; // quick hack for now. TODO: edit once frontend+backend package.json are merged

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
  return await response.json();
}

let saveTimeout: number;

const saveEditorState = async (editorJson: string): Promise<any> => {
  // wait 500ms before saving any changes as to not spam the backend
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(postEditorState, 500, editorJson);
}

export default async function (container: HTMLElement) {
  const components: Component[] = [
    new NumComponent(),
    new AddComponent(),
    new ResolutionComponent(),
    new ArtnetComponent(),
    new GifComponent(),
    new MultiplexerComponent(),
    new FrameMapComponent(),
    new PixelMapComponent(),
    new SplitComponent(),
    new OPCMultiOutputComponent(),
  ];

  const editor = new Rete.NodeEditor("pixelbridge@1.0.0", container);
  editor.use(ConnectionPlugin);
  editor.use(VueRenderPlugin);
  editor.use(ContextMenuPlugin);
  editor.use(AreaPlugin);
  editor.use(MinimapPlugin);
  editor.use(HistoryPlugin, { keyboard: true });
  editor.use(CommentPlugin, { margin: 20 });

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
    await saveEditorState(JSON.stringify(editor.toJSON()));
  });

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");
}
