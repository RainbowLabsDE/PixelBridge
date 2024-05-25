import Rete from "rete";

const NumSocket = new Rete.Socket('Number');
const FrameSocket = new Rete.Socket('Frame');
const FrameArraySocket = new Rete.Socket('FrameArr');
const RawPixelSocket = new Rete.Socket('RawPixels');
const RawPixelArrSocket = new Rete.Socket('RawPixelsArr');
const TextSocket = new Rete.Socket('Text');
const ResolutionSocket = new Rete.Socket('Resolution');


const AnyImageSocket = new Rete.Socket('AnyImage');
FrameSocket.combineWith(AnyImageSocket);
FrameArraySocket.combineWith(AnyImageSocket);
RawPixelArrSocket.combineWith(AnyImageSocket);

export { NumSocket, FrameSocket, FrameArraySocket, RawPixelSocket, RawPixelArrSocket, TextSocket, ResolutionSocket, AnyImageSocket };

