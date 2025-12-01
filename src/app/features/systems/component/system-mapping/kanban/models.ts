import { dia } from '@joint/plus';

export enum TaskState {
    Source,
    Target,
    System
}

export interface Task {
    id?: dia.Cell.ID;
    state: TaskState;
    name?: string;
    fieldId?:number;
    // description?: string;
}

export interface Column {
    state: TaskState;
    name?: string;
    color?: string;
}

export interface Dependency {
    id: dia.Cell.ID;
    source: dia.Cell.ID;
    target: dia.Cell.ID;
}
