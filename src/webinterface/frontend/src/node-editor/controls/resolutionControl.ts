import Rete, { NodeEditor } from "rete";
import VueResolutionControl from "./resolutionControl.vue";

class Resolution {
  x: number;
  y: number;
}

interface ResolutionControlProps {
  emitter: NodeEditor,
  ikey: string,
  readonly: boolean,
  title: string
}

export class ResolutionControl extends Rete.Control {
  component: any;
  props: ResolutionControlProps;
  vueContext: any;
  value: Resolution;

  constructor(emitter: NodeEditor | null, key: string, readonly = undefined, title: string = key) {
    super(key);
    this.component = VueResolutionControl;
    this.props = { emitter, ikey: key, readonly, title };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
