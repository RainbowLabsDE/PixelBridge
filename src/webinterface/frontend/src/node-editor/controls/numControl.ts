import Rete, { NodeEditor } from "rete";
import VueNumControl from "./numControl.vue";

interface NumControlProps {
  emitter: NodeEditor,
  ikey: string,
  readonly: boolean,
}

export class NumControl extends Rete.Control {
  component: any;
  props: NumControlProps;
  vueContext: any;

  constructor(emitter: NodeEditor | null, key: string, readonly = undefined) {
    super(key);
    this.component = VueNumControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
