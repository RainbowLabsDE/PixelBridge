import Rete, { NodeEditor } from "rete";
import VueNumControl from "./numControl.vue";

interface NumControlProps {
    emitter: NodeEditor,
    ikey: string,
    onChange: (val: number) => void,
    readonly: boolean,
    min: number,
    max: number,
    step: number
}

export class NumControl extends Rete.Control {
    component: any;
    props: NumControlProps;
    vueContext: any;

    constructor(emitter: NodeEditor | null, key: string, readonly?: boolean, onChange?: (val: number) => void, min?: number, max?: number, step?: number) {
        super(key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, readonly, onChange, min, max, step };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}
