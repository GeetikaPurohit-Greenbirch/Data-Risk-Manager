import { Component, AfterViewInit, Input } from '@angular/core';
import { dia, shapes, ui, util } from '@joint/plus';
import { columns, tasks as defaultTasks, dependencies as defaultDependencies } from './kanban/data';
import { Kanban } from './kanban/kanban';
import { Task as TaskShape, Header as HeaderShape, Dependency as DependencyShape, AnimatedElementView } from './kanban/shapes';
import { Dependency, Task, TaskState } from './kanban/models';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { catchError, forkJoin, of } from 'rxjs';


@Component({
    selector: 'app-system-mapping',
    templateUrl: './system-mapping.component.html',
    styleUrls: ['./system-mapping.component.scss']
})
export class SystemMappingComponent implements AfterViewInit {
    @Input() inboundFields: any[] = [];
    @Input() outboundFields: any[] = [];
    @Input() systemId!: number; // or number
    saveJson: any;

    constructor(private datafieldsService: DatafieldsService, private toastNotificationService: ToastnotificationService,) { }
    ngAfterViewInit(): void {
        this.initMapping();
    }

    initMapping() {
        const graph = new dia.Graph({}, { cellNamespace: shapes });

        const paper = new dia.Paper({
            el: document.getElementById('paper-container'),
            width: 1100,
            height: 800,
            model: graph,
            background: { color: '#F3F7F6' },
            moveThreshold: 10,
            clickThreshold: 10,
            async: true,
            autoFreeze: true,
            frozen: true,
            viewManagement: {
                disposeHidden: true,
            },
            sorting: dia.Paper.sorting.APPROX,
            cellViewNamespace: shapes,
            elementView: (element) => {
                if (TaskShape.isTask(element)) {
                    return AnimatedElementView as typeof dia.ElementView;
                } else {
                    return dia.ElementView;
                }
            },
            interactive: false,
            preventDefaultBlankAction: false,
            defaultConnector: {
                name: 'curve',
                args: {
                    distanceCoefficient: 0.2
                }
            },
            highlighting: {
                connecting: {
                    name: 'addClass',
                    options: {
                        className: 'highlighter-connection'
                    }
                }
            },
            labelsLayer: true,
            linkPinning: false,
            multiLinks: false,
            validateConnection: (sourceView, _, targetView) => {
                const source = sourceView.model;
                const target = targetView.model;
                if (source === target) return false;
                if (!TaskShape.isTask(source)) return false;
                if (!TaskShape.isTask(target)) return false;
                return true;
            },
            defaultConnectionPoint: { name: 'anchor' },
            defaultAnchor: function (elementView, _magnet, _ref, _opt) {
                const link = this.model as unknown as dia.Link;
                const element = elementView.model;
                const source = link.getSourceElement();
                const target = link.getTargetElement();
                if (!source || !target) return element.getBBox().rightMiddle();
                const sourceStack = source.get('stackIndex');
                const targetStack = target.get('stackIndex');
                const offset = 0;
                if (sourceStack === targetStack) {
                    return element.getBBox().rightMiddle();
                } else if (sourceStack > targetStack) {
                    if (source === element) {
                        return element.getBBox().leftMiddle().offset(0, offset);
                    }
                    return element.getBBox().rightMiddle().offset(0, -offset);
                } else {
                    if (source === element) {
                        return element.getBBox().rightMiddle().offset(0, -offset);
                    }
                    return element.getBBox().leftMiddle().offset(0, offset);
                }
            },
            defaultLink: () => {
                return new DependencyShape();
            }
        });

        let tasks: Task[] = [];
        let dependencies: Dependency[] = [];
        let showDependencyTool = true;

        forkJoin([
            this.datafieldsService.getMappings(this.systemId),
            // ★★★ Handle 404 safely here ★★★
            this.datafieldsService.getSystemMappingJSON(this.systemId).pipe(
                catchError(err => {
                    if (err.status === 404) {
                        console.warn("Mapping JSON not found → fallback");
                        return of(null);       // return empty
                    }
                    console.error("Mapping JSON error:", err);
                    return of(null);
                })
            )
        ])
            .subscribe(([fieldMappings, jsonData]) => {

                // === Prepare default task list ===
                const inboundTasks = mapToTasks(this.inboundFields, TaskState.Source);
                const outboundTasks = mapToTasks(this.outboundFields, TaskState.Target);

                const newtask = [...inboundTasks, ...outboundTasks];
                console.log("allTask", newtask);

                if (fieldMappings && fieldMappings.length > 0 && jsonData && jsonData.mapping_json) {
                    // Mapping JSON exists → load it
                    const mappingJSON = JSON.parse(jsonData.mapping_json);
                    console.log("existing task", mappingJSON.tasks);
                    console.log("existing dependency", mappingJSON.dependencies);
                    tasks = syncTasks(newtask, mappingJSON.tasks);
                    console.log("updated tasks", tasks);

                    fieldMappings.forEach(mapping => {
                        const pField = tasks?.find(f => f.fieldId === mapping.p_field_id && f.state == TaskState.Source);
                        const cField = tasks?.find(f => f.fieldId === mapping.c_field_id && f.state == TaskState.Target);
                        if (pField && cField) {
                            dependencies?.push({
                                id: util.uuid(),   // generate unique ID
                                source: pField.id!,
                                target: cField.id!
                            });
                        }
                    });
                    console.log("new dependency", dependencies);
                    dependencies = dependencies;
                    showDependencyTool = showDependencyTool
                } else {
                    // No JSON → fallback to calculated mappings
                    tasks = [...inboundTasks, ...outboundTasks];
                    dependencies = [];
                    showDependencyTool = showDependencyTool
                }
                const kanban = new Kanban({
                    paper,
                    topLeft: {
                        x: 20,
                        y: 50
                    },
                    tasks: tasks || defaultTasks,
                    columns,
                    dependencies: dependencies || defaultDependencies,
                    showDependencyTool
                });

                paper.unfreeze({
                    cellVisibility: (cell: dia.Cell) => {
                        return kanban.showDependencyTool ? true : cell.isElement();
                    }
                } as unknown as dia.Paper.UnfreezeOptions & {
                    cellVisibility: (cell: dia.Cell) => boolean;
                });
                
                const cmd = new dia.CommandManager({
                    graph,
                    stackLimit: 20,
                    cmdBeforeAdd: function (_cmdName, cell, _graph, options = {}) {
                        if (HeaderShape.isHeader(cell)) return false;
                        return !options.ignoreCommandManager;
                    }
                });

                cmd.on('stack', () => this.saveJson = saveMap());

                function saveMap() {
                    return JSON.stringify({
                        tasks: kanban.tasks,
                        dependencies: kanban.dependencies,
                        showDependencyTool: kanban.showDependencyTool
                    })
                }

                function syncTasks(newTasks: Task[], existingTasks: Task[]): Task[] {

                    // Create lookup map for efficiency
                    const newTaskMap = new Map(newTasks.map(t => [t.fieldId, t]));

                    // STEP 1: Keep only tasks that exist in newTasks
                    const filtered = existingTasks.filter(e => newTaskMap.has(e.fieldId));

                    // STEP 2: Add tasks that do not exist in existingTasks
                    const existingFieldIds = new Set(existingTasks.map(t => t.fieldId));

                    const missing = newTasks.filter(n => !existingFieldIds.has(n.fieldId));

                    // STEP 3: Return merged updated list
                    return [...filtered, ...missing];
                }

            });
    }

    saveMappings() {
        if (this.saveJson) {
            console.log(this.saveJson);
            const data = JSON.parse(this.saveJson);
            const systemId = this.systemId;
            const formattedLinks: any[] = [];
            if (data.dependencies) {
                data.dependencies.forEach((dep: any) => {

                    // Find source and target tasks by UUID
                    const fromTask = data.tasks.find((t: any) => t.id === dep.source);
                    const toTask = data.tasks.find((t: any) => t.id === dep.target);

                    if (!fromTask || !toTask) return;

                    // Extract fieldId and fieldName from task.name string
                    const extract = (taskName: string) => {
                        const fieldIdMatch = taskName.match(/Field Id:\s*(\d+)/);
                        const fieldId = fieldIdMatch ? Number(fieldIdMatch[1]) : null;
                        return { fieldId };
                    };

                    const fromField = extract(fromTask.name);
                    const toField = extract(toTask.name);

                    if (!fromField.fieldId || !toField.fieldId) return;

                    formattedLinks.push({
                        p_field_id: fromField.fieldId,
                        p_field_uuid: fromTask.id,
                        c_field_id: toField.fieldId,
                        c_field_uuid: toTask.id,
                        system_id: systemId,
                        outbound_position: null
                    });
                });

                //console.log("Final Mappings Payload:", formattedLinks);

                const fieldMappingPayload = {
                    system_id: systemId,
                    mapping_model_list: formattedLinks
                };

                const jsonPayload = {
                    system_id: systemId,
                    mapping_json: this.saveJson
                };

                forkJoin([
                    this.datafieldsService.saveFieldMapping(fieldMappingPayload),
                    this.datafieldsService.saveSystemMappingJSON(jsonPayload)
                ]).subscribe({
                    next: () => this.toastNotificationService.success("System mappings saved successfully!"),
                    error: () => this.toastNotificationService.error("Failed to save mappings.")
                });
            }
        }
    }

    deleteMappings() {
        const confirmed = confirm('Do you really want to delete all mappings?');
        if (!confirmed) return; // User canceled

        this.datafieldsService.deleteAllSystemMapping(this.systemId).subscribe({
            next: (res: string) => {
                this.initMapping();
                this.toastNotificationService.success(res);
            },
            error: (err) => {
                console.error('Error deleting mappings:', err);
                this.toastNotificationService.error('Failed to delete system mappings.');
            }
        });
    }

}
export function mapToTasks(data: any[], state: TaskState): Task[] {
    return data.map(item => {
        const name =
            `Interface: ${item.interface}\n` +
            `Field Id: ${item.fieldId}\n` +
            `Field Name: ${item.fieldName}`;
        const id = generateUUID();
        return {
            id: id as dia.Cell.ID,
            state: state,
            name,
            fieldId: item.fieldId
            // description: item.dataType
        } as Task;
    });
}
function generateUUID() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
        Math.floor(Math.random() * 16).toString(16)
    );
}
