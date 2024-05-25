import * as Rete from "rete";
import { WorkerInputs } from "rete/types/core/data";
import { WorkerPassthroughData } from "./workerPassthroughData.interface";

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
    run(data: WorkerPassthroughData, needReset?: boolean, garbage?: any[], propagate?: boolean): any;    // returns outputData from called worker
    clone(root: boolean, oldTask: ReteTask, newTask: ReteTask): ReteTask;

}