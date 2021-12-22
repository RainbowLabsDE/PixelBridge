import Rete from "rete";

const NumSocket = new Rete.Socket('Number');
const FrameSocket = new Rete.Socket('Frame');
const FrameArraySocket = new Rete.Socket('Frame[]');
const TextSocket = new Rete.Socket('Text');
const ResolutionSocket = new Rete.Socket('Resolution');
export { NumSocket, FrameSocket, FrameArraySocket, TextSocket, ResolutionSocket };

