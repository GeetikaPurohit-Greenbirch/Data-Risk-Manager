import { Column, Task, TaskState, Dependency } from './models';

export const tasks: Task[] = [{
    id: 'task-1',
    name: 'Currency Pair',
    state: TaskState.InBound,
    
}, {
    id: 'task-2',
    name: 'Tenor',
    state: TaskState.InBound,
    
}, {
    id: 'task-3',
    name: 'Tier',
    state: TaskState.InBound,
    
}, {
    id: 'task-4',
    name: 'Bid Price',
    state: TaskState.InBound,
   
}, {
    id: 'task-5',
    name: 'Bid Size',
    state: TaskState.InBound,
   
}, {
    id: 'task-6',
    name: 'Ask Price',
    state: TaskState.InBound,
    
}, {
    id: 'task-7',
    name: 'Ask Size',
    state: TaskState.InBound,
    
}, {
    id: 'task-8',
    name: 'Firm Name',
    state: TaskState.OutBound,
   
},{
    id: 'task-9',
    name: 'Size',
    state: TaskState.OutBound,
   
},{
    id: 'task-10',
    name: 'Price',
    state: TaskState.OutBound,
   
}];

export const dependencies: Dependency[] = [{
    id: 'dep-1',
    source: 'task-7',
    target: 'task-9'
}, {
    id: 'dep-2',
    source: 'task-6',
    target: 'task-10'
}];

export const columns: Column[] = [{
    name: 'Input data fields',
    state: TaskState.InBound,
    color: '#4666E5'
}, {
    name: 'Output data fields',
    state: TaskState.OutBound,
    color: '#F9A03F'
 },
 {
    name: 'Unused data fields',
    state: TaskState.UnUsedField,
    color: '#09BC8A'
}
];


