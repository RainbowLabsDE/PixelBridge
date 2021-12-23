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

  const n1 = await components[0].createNode({ num: 22 });
  const n2 = await components[0].createNode({ num: 33 });
  const add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get("numOut"), add.inputs.get("num"));
  editor.connect(n2.outputs.get("numOut"), add.inputs.get("num2"));

  editor.on(["process", "nodecreated", "noderemoved", "connectioncreated", "connectionremoved"],
    async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");
}
