import * as Rete from "rete";
import VueSelectionControl from "./selectionControl.vue";

interface SelectionControlProps {
    emitter: Rete.NodeEditor,
    ikey: string,
    title: string,
    selectOptions: SelectionOption[],
    readonly: boolean,
}

interface SelectionOption {
    value: string,
    name: string
}

export class SelectionControl extends Rete.Control {
    component: any;
    props: SelectionControlProps;
    vueContext: any;

    constructor(emitter: Rete.NodeEditor | null, key: string, title: string = key, options: SelectionOption[], readonly = undefined) {
        super(key);
        this.component = VueSelectionControl;
        this.props = { emitter, ikey: key, title, selectOptions: options, readonly };
    }

    setValue(val: any) {
        this.vueContext.value = val;
    }
}