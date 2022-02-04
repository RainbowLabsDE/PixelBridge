import * as Rete from "rete";
import VueTextControl from "./textControl.vue";

interface TextControlProps {
    emitter: Rete.NodeEditor,
    ikey: string,
    readonly: boolean,
}

export class TextControl extends Rete.Control {
    component: any;
    props: TextControlProps;
    vueContext: any;

    constructor(emitter: Rete.NodeEditor | null, key: string, readonly = undefined) {
        super(key);
        this.component = VueTextControl;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val: any) {
        this.vueContext.value = val;
    }
}