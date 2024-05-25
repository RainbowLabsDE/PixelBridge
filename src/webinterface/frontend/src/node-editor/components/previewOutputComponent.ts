import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { AnyImageSocket, ResolutionSocket } from "../sockets/sockets";
import { Resolution, ResolutionControl } from "../controls/resolutionControl";
import { CanvasControl } from "../controls/canvasControl";

interface PreviewFrameData {
    type: string;
    nodeId: number;
    frame: {
        width: number;
        height: number;
        buffer: {data: number[]}; // color order: RGB
    };
}

export class PreviewOutputComponent extends Rete.Component {
    private websocket: WebSocket;
    private registeredNodes: Rete.Node[] = [];
    private targetRes: Resolution;

    constructor() {
        super("Preview Output");
        this.initWS();
    }

    private initWS() {
        const url = `ws://${window.location.hostname}:8080`
        this.websocket = new WebSocket(url);

        this.websocket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data) as PreviewFrameData;
                this.drawFrameDataToCanvas(msg);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }

        this.websocket.onclose = () => {
            console.warn("WebSocket connection closed. Attempting to reconnect...");
            setTimeout(() => {
                this.initWS();
            }, 1000);
        };

        this.websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.websocket.close();
        };
    }

    // Function to convert the RGB buffer to RGBA
    private convertToRGBA(buffer: number[]): Uint8ClampedArray {
        const length = buffer.length;
        const rgbaArray = new Uint8ClampedArray((length / 3) * 4);
        for (let i = 0, j = 0; i < length; i += 3, j += 4) {
            rgbaArray[j] = buffer[i];           // R
            rgbaArray[j + 1] = buffer[i + 1];   // G
            rgbaArray[j + 2] = buffer[i + 2];   // B
            rgbaArray[j + 3] = 255;             // A
        }
        return rgbaArray;
    }

    private drawFrameDataToCanvas(data: PreviewFrameData) {
        if (data.type === "preview") {
            this.registeredNodes.forEach(node => {
                if (node.id === data.nodeId) {
                    const canvas: HTMLCanvasElement = (node.controls.get('canvas') as any).props.canvasElement;
                    // draw frame
                    // console.log(node, this.targetRes);

                    let pixelData = this.convertToRGBA(data.frame.buffer.data);
                    let res: Resolution = {x: data.frame.width, y: data.frame.height};  // default to resolution of incoming frame data

                    if (this.targetRes?.x && this.targetRes?.y) {               // if both x+y values of optional resolution are set, use them
                        res = this.targetRes;
                    }
                    else if (this.targetRes?.x === 0 && this.targetRes?.y) {    // if X is 0/blank, automatically calculate X
                        res.y = this.targetRes.y;
                        res.x = Math.ceil(pixelData.length / 4 / this.targetRes.y);
                    }
                    else if (this.targetRes?.x && this.targetRes?.y === 0) {    // if Y is 0/blank, automatically calculate Y
                        res.x = this.targetRes.x;
                        res.y = Math.ceil(pixelData.length / 4 / this.targetRes.x);
                    }
                    // TODO: don't calculate the resolution stuff above every frame, but only when targetRes changes?

                    if (canvas.width != res.x || canvas.height != res.y) {      // if canvas resolution changed, update
                        canvas.width = res.x;
                        canvas.height = res.y;
                        this.editor.view.updateConnections({node});
                    }

                    if (pixelData.length < res.x * res.y * 4) {         // append transparent pixels
                        const filler = new Array<number>(res.x * res.y * 4 - pixelData.length).fill(0);
                        pixelData = new Uint8ClampedArray([...pixelData, ...filler]);
                    }
                    else if (pixelData.length > res.x * res.y * 4) {    // truncate
                        pixelData = pixelData.slice(0, res.x * res.y * 4);
                    }
                    
                    const img = new ImageData(pixelData, res.x, res.y);
                    const ctx = canvas.getContext('2d');
                    ctx.putImageData(img, 0, 0);
                }
            });
        }
    }

    private registerNode(node: Rete.Node) {
        this.registeredNodes.push(node);
    }

    async builder(node: Rete.Node) {

        const imageIn = new Rete.Input('anyImage', "Any Image Data", AnyImageSocket);
        const resIn = new Rete.Input('res', "Optional Resolution", ResolutionSocket);

        resIn.addControl(new ResolutionControl(this.editor, 'resolution', resIn.name));

        const canvasCtrl = new CanvasControl(this.editor, 'canvas');
        node.addControl(canvasCtrl);
        node.addInput(resIn);
        node.addInput(imageIn);

        this.registerNode(node);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        const res = inputs['res'].length ? (inputs['res'][0] as Resolution) : (node.data.resolution as Resolution);
        if (res) {
            this.targetRes = res;
        }
    }
}