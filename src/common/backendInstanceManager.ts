import { NodeData } from "rete/types/core/data";

export interface InstanceState {
    instance: any;
    params: any;
}

export class BackendInstanceManager {
    instances: { [id: number]: InstanceState } = {};
    
    constructor() {}

    async createOrReconfigureInstance(node: NodeData, newParams: any, createNewInstance: () => any) {
        // check if instance already exists for given node ID
        if (node.id in this.instances) {
            const instanceState = this.instances[node.id];
            // check if parameters have changed
            if (JSON.stringify(newParams) !== JSON.stringify(instanceState.params)) {
                // recreate instance with new parameters
                if (instanceState.instance.close) {
                    await instanceState.instance.close();
                }
                delete instanceState.instance;
                instanceState.params = newParams;
                instanceState.instance = createNewInstance();
            }
        }
        else {
            const newInstanceState: InstanceState = {
                params: newParams,
                instance: createNewInstance()
            }
            this.instances[node.id] = newInstanceState;
        }
    }

    getInstance (node: NodeData) {
        return this.instances[node.id];
    }

    async handleRemovedNodes(removedNodes: NodeData[]) {
        removedNodes.forEach(async (node) => {
            if (node.id in this.instances) {
                // call closing function if it exists
                if (this.instances[node.id].instance?.close) {
                    await this.instances[node.id].instance.close();
                }
                delete this.instances[node.id];
            }
        });
    }
}