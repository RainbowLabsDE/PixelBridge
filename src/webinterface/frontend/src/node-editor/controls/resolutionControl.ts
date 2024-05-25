import Rete, { NodeEditor } from "rete";
import VueResolutionControl from "./resolutionControl.vue";

export interface Resolution {
    x: number;
    y: number;
}

interface ResolutionControlProps {
    emitter: NodeEditor,
    ikey: string,
    title: string
    readonly: boolean,
}

export class ResolutionControl extends Rete.Control {
    component: any;
    props: ResolutionControlProps;
    vueContext: any;
    value: Resolution;

    constructor(emitter: NodeEditor | null, key: string, title: string = key, readonly = undefined) {
        super(key);
        this.component = VueResolutionControl;
        this.props = { emitter, ikey: key, title, readonly };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}
