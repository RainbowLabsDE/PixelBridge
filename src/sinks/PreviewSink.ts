import { BaseSink } from "./BaseSink"

import * as dgram from "dgram";
import { Frame } from "../common/frame.interface";
import { WebServer } from "../webinterface/server";
import { PreviewFrameData } from "../common/previewFrameData.interface";

export class PreviewSink extends BaseSink {
    protected udp: dgram.Socket;
    open: boolean;

    constructor(width: number, height: number, protected nodeId: number, protected webServer: WebServer) {
        super(width, height);
    }
    
    async sendFrame(frame: Frame): Promise<void> {
        let payload: PreviewFrameData = {type: 'preview', nodeId: this.nodeId, frame: frame};
        await this.webServer.sendWSMessage(JSON.stringify(payload));
    }
    
}