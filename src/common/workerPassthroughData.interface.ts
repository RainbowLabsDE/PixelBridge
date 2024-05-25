// This interface describes the data object that gets passed through the node workers.
// It's a hacky way to pass data "forward" through Rete nodes. (Normally nodes retreive data from their inputs "backwards")

import { Frame } from "./frame.interface"
import { FrameArr } from "./frameArr.interface"

export interface WorkerPassthroughData {
    [originNodeId: number]: {
        frame?: Frame,
        frameArr?: FrameArr
    },
    // frame?: Frame;          // deprecated
    // frameArr?: FrameArr;    // deprecated
    // fromId?: number;        // deprecated
}