import Rete, { NodeEditor } from "rete";
import VueNumControl from "./numControl.vue";

interface NumControlProps {
    emitter: NodeEditor,
    ikey: string,
    onChange: (val: number) => void,
    readonly: boolean,
}

export class NumControl extends Rete.Control {
    component: any;
    props: NumControlProps;
    vueContext: any;

    constructor(emitter: NodeEditor | null, key: string, readonly?: boolean, onChange?: (val: number) => void) {
        super(key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, readonly, onChange };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}
