import * as Rete from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { FrameArraySocket, FrameSocket, RawPixelArrSocket, ResolutionSocket } from "../sockets/sockets";
import { ResolutionControl } from "../controls/resolutionControl";
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
                    console.log(node.data.resolution.x);
                    canvas.width = data.frame.width;
                    canvas.height = data.frame.height;
                    const ctx = canvas.getContext('2d');
                    const img = new ImageData(this.convertToRGBA(data.frame.buffer.data), data.frame.width, data.frame.height);
                    
                    ctx.putImageData(img, 0, 0);
                }
            });
        }
    }

    private registerNode(node: Rete.Node) {
        this.registeredNodes.push(node);
    }

    async builder(node: Rete.Node) {
        const AnyImageSocket = new Rete.Socket('AnyImage');
        FrameSocket.combineWith(AnyImageSocket);
        FrameArraySocket.combineWith(AnyImageSocket);
        RawPixelArrSocket.combineWith(AnyImageSocket);

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
        // do nothing for now
    }
}