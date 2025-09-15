import { Component, OnInit } from '@angular/core';



interface FieldData {
  id: number;
  fieldName: string;
  dataType: string;
  length: number;
  sourceName: string;
  dqaCompleteness: string;
  dqaTimeliness: string;
  dqaAccuracy: string;
  criticality: string;
}


@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  selectedColumns!: any[];
  diagramCollapsed = false;

  
    cols: any[] = [
      { field: 'id', header: 'Field ID' },
      { field: 'fieldName', header: 'Field Name' },
      { field: 'dataType', header: 'Data Type' },
      { field: 'length', header: 'Length' },
      { field: 'sourceName', header: 'Source Name' },
      { field: 'dqaCompleteness', header: 'DQA - Completeness' },
      { field: 'dqaTimeliness', header: 'DQA - Timeliness' },
      { field: 'dqaAccuracy', header: 'DQA - Accuracy' },
      { field: 'criticality', header: 'Criticality' },
      { field: 'actions', header: 'Actions' }
    ];
  

  constructor() {}

   nodesCollapsed = false;

  toggleNodes(): void {
    this.nodesCollapsed = !this.nodesCollapsed;
    // If your JointJS paper needs a resize after layout changes,
    // call your diagram component's `onResize()` here (via ViewChild) after a tick.
    // Example:
    // setTimeout(() => this.diagramRef?.onResize?.(), 0);
  }

  ngOnInit(): void {
    // Any initialization logic

    this.selectedColumns = this.cols // By default all visible

  }

  toggleDiagram() {
    this.diagramCollapsed = !this.diagramCollapsed;
  }

  
  title = 'PrimeNG Table Example';

  fields: FieldData[] = [
    {
      id: 1,
      fieldName: 'Customer ID',
      dataType: 'Number',
      length: 10,
      sourceName: 'CRM',
      dqaCompleteness: 'High',
      dqaTimeliness: 'Medium',
      dqaAccuracy: 'High',
      criticality: 'Critical'
    },
    {
      id: 2,
      fieldName: 'Customer Name',
      dataType: 'String',
      length: 100,
      sourceName: 'CRM',
      dqaCompleteness: 'High',
      dqaTimeliness: 'High',
      dqaAccuracy: 'High',
      criticality: 'High'
    },
    {
      id: 3,
      fieldName: 'Transaction Date',
      dataType: 'Date',
      length: 8,
      sourceName: 'ERP',
      dqaCompleteness: 'Medium',
      dqaTimeliness: 'High',
      dqaAccuracy: 'Medium',
      criticality: 'Medium'
    }
  ];

  onGlobalFilter(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;
    dt.filterGlobal(input.value, 'contains');
  }
  
  onColumnFilter(event: Event, dt: any, field: string) {
    const input = event.target as HTMLInputElement;
    dt.filter(input.value, field, 'contains');
  }

  // Example action
  editRow(row: FieldData) {
    console.log('Edit:', row);
  }

  deleteRow(row: FieldData) {
    console.log('Delete:', row);
  }
}
