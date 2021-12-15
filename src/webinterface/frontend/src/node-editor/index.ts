import Rete, { Component } from "rete";
import VueRenderPlugin from "rete-vue-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import { NumComponent } from "./components/numComponent";
import { AddComponent } from "./components/addComponent";

export default async function (container) {
  const components: Component[] = [new NumComponent(), new AddComponent()];

  const editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(VueRenderPlugin);
  editor.use(ContextMenuPlugin);
  editor.use(AreaPlugin);

  const engine = new Rete.Engine("demo@0.1.0");

  // components.map((c) => {
  //   editor.register(c);
  //   engine.register(c);
  // });
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

  editor.connect(n1.outputs.get("num"), add.inputs.get("num"));
  editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

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
