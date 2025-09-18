import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';



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
  useCaseId!: number;
  lineageId!: number;
  fields : any;

  
    cols: any[] = [
      { field: 'fieldId', header: 'Field ID' },
      { field: 'fieldName', header: 'Field Name' },
      { field: 'dataType', header: 'Data Type' },
      { field: 'fieldLength', header: 'Length' },
      { field: 'sourceName', header: 'Source Name' },
      // { field: 'completenessRisk', header: 'DQA - Completeness' },
      { field: 'completenessRiskComment', header: 'Completeness Commentary' },
      // { field: 'timelinessRisk', header: 'DQA - Timeliness' },
      { field: 'timelinessRiskComment', header: 'Timeliness Commentary' },
      // { field: 'accuracyRisk', header: 'DQA - Accuracy' },
      { field: 'accuracyRiskComment', header: 'Accuracy Commentary' },
      { field: 'criticality', header: 'Criticality' },
      { field: 'actions', header: 'Actions' }
    ];
  

  constructor(private datafieldsService: DatafieldsService,private route: ActivatedRoute) {}

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

    this.useCaseId = +this.route.snapshot.paramMap.get('usecaseId')!;

    console.log('Use Case ID:', this.useCaseId);

    this.selectedColumns = this.cols // By default all visible

    this.getTargetReport();

  }

  toggleDiagram(param:any) {
    console.log(param)
    this.diagramCollapsed = !this.diagramCollapsed;
  }

  
  title = 'PrimeNG Table Example';

  // fields: FieldData[] = [
  //   {
  //     id: 1,
  //     fieldName: 'Customer ID',
  //     dataType: 'Number',
  //     length: 10,
  //     sourceName: 'CRM',
  //     dqaCompleteness: 'High',
  //     dqaTimeliness: 'Medium',
  //     dqaAccuracy: 'High',
  //     criticality: 'Critical'
  //   },
  //   {
  //     id: 2,
  //     fieldName: 'Customer Name',
  //     dataType: 'String',
  //     length: 100,
  //     sourceName: 'CRM',
  //     dqaCompleteness: 'High',
  //     dqaTimeliness: 'High',
  //     dqaAccuracy: 'High',
  //     criticality: 'High'
  //   },
  //   {
  //     id: 3,
  //     fieldName: 'Transaction Date',
  //     dataType: 'Date',
  //     length: 8,
  //     sourceName: 'ERP',
  //     dqaCompleteness: 'Medium',
  //     dqaTimeliness: 'High',
  //     dqaAccuracy: 'Medium',
  //     criticality: 'Medium'
  //   }
  // ];

  getTargetReport()
   { 
    this.datafieldsService.getTargetReportdata(this.useCaseId, '8').subscribe({
      next: (res: any) => {
        this.fields = res;
      }
         // Force refresh with setRowData
    
    });
   }

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
