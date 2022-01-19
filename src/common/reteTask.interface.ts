import * as Rete from "rete";
import { WorkerInputs } from "rete/types/core/data";

export interface ReteTask {
    inputs: WorkerInputs;
    component: Rete.Component;
    worker: unknown;
    next: Array<{
        key: string;
        task: ReteTask;
    }>;
    outputData: any;
    closed: string[];

    getInputs(type: string): string[];
    reset(): void;
    run(data: any, needReset?: boolean, garbage?: any[], propagate?: boolean): any;    // returns outputData from called worker
    clone(root: boolean, oldTask: ReteTask, newTask: ReteTask): ReteTask;

}