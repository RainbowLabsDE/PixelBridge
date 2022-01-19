import { NodeData } from "rete/types/core/data";

export interface InstanceState {
    instance: any;
    params: any;
}

export async function createOrReconfigureInstance (node: NodeData, instances: {[id: number]: InstanceState}, newParams: any, createNewInstance: () => any) {
    // check if instance already exists for given node ID
    if (node.id in instances) {
        const instanceState = instances[node.id];
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
        instances[node.id] = newInstanceState;
    }
}

    