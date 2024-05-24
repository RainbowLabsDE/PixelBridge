import * as Rete from "rete";
import VueCanvasControl from "./canvasControl.vue";

interface CanvasControlProps {
    emitter: Rete.NodeEditor,
    ikey: string,
    readonly: boolean,
    initFunc(HTMLElement): void,
    canvasElement?: HTMLCanvasElement
}

export class CanvasControl extends Rete.Control {
    component: any;
    props: CanvasControlProps;
    vueContext: any;
    

    constructor(emitter: Rete.NodeEditor | null, key: string, readonly = undefined) {
        super(key);
        this.component = VueCanvasControl;
        this.props = { emitter, ikey: key, readonly, initFunc: this.init.bind(this) };  // need bind() here, fuck JS
    }

    setValue(val: any) {
        this.vueContext.value = val;
    }

    init(canvas: HTMLCanvasElement) {
        this.props.canvasElement = canvas;
        const ctx = this.props.canvasElement.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}