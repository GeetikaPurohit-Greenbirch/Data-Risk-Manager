import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SystemServiceService } from '../services/system-service.service';
import { SystemsModel } from '../models/systems-model.model';
import { MatDialog } from '@angular/material/dialog';
import { EditSystemDialogComponent } from '../edit-system-dialog/edit-system-dialog.component';


import {
  trigger, state, style, transition, animate
} from '@angular/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { SystemDataFields } from '../models/system-data-fields.model';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray  } from '@angular/cdk/drag-drop';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastnotificationService } from '../../shared-services/toastnotification.service';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*', display: 'block' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ]
})
export class SystemsComponent implements OnInit {
  displayedColumns: string[] = [ 'systemid', 'name', 'description', 'owner', 'owner_email', 'leanixId', 'version', 'status', 'actions'];
  expandedElement: any | null;
  expandedRow: any | null = null;
  public rowData: any;
  private newRows: any[] = [];
  systemDataModel : SystemDataFields = new SystemDataFields();

  gridApi: any;
  gridColumnApi: any;
  
  isExpansionDetailRow = (index: number, row: any) => row.hasOwnProperty('childGridData');
  dataTypes = ['NUMERIC', 'ALPHANUMERIC', 'DATE/TIME'];
dqaRiskLevels = ['LOW', 'MEDIUM', 'HIGH'];
criticalityOptions = ['CRITICAL', 'MAJOR', 'MINOR', 'INSIGNIFICANT'];

editableColumns: string[] = [
  // 'fieldId',
  'fieldName',
  'fieldDescription',
  'dataType',
  'fieldLength',
  'dqaRiskLevel',
  'criticality',
  'riskLevelStatement',
  'actions'
];


    dataSource = new MatTableDataSource<SystemsModel>;
  

  // systems : SystemsModel = new SystemsModel();
  systems: SystemsModel[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 5;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];



  constructor(private systemService: SystemServiceService,
    private dialog: MatDialog,
     private router: Router,
          private toastNotificationService: ToastnotificationService,
     

  ) {
  }

  columnDefs: (ColDef | ColGroupDef)[]= [
      { field: 'system_id', headerName: 'System ID', editable: false, sortable: true, sort: 'asc'},
      { field: 'system_name', headerName: 'Name', editable: true,  sortable: true,sort: 'asc' },
      { field: 'description', headerName: 'Description', editable: true,sortable: true,sort: 'asc' },
      { field: 'owner', headerName: 'Owner', editable: true, sortable: true,sort: 'asc' },
      { field: 'owner_email', headerName: 'Owner Email', editable: true, sortable: true,sort: 'asc' },
      { field: 'leanix_id', headerName: 'LeanIX ID', editable: true, sortable: true,sort: 'asc' },
      { field: 'version_number', headerName: 'Version', editable: true, sortable: true,sort: 'asc' },
      { field: 'status', headerName: 'Status', editable: true, sortable: true,sort: 'asc' },
      {
        headerName: 'Actions',
        editable: false,
        filter: false,
        sortable: false,
        minWidth: 100, 
        flex:1,
        cellRenderer: (params: any) => {
          const div = document.createElement('div');
          div.className = 'model-cell-renderer';
      
          const saveDataFields = document.createElement('button');
          saveDataFields.className = 'fa fa-edit';
          saveDataFields.style.color = 'green';
          saveDataFields.style.border = '1px solid lightGrey';
          saveDataFields.style.borderRadius = '5px';
          saveDataFields.style.lineHeight = '22px';
          saveDataFields.style.height = '32px';
          saveDataFields.style.cursor = 'pointer';
          saveDataFields.title = 'Save';
      
          // Pass row data or node to save
          saveDataFields.addEventListener('click', () => {
            this.editSystem(params.node);
          });
      
          const deleteDataFields = document.createElement('button');
          deleteDataFields.className = 'fa fa-trash';
          deleteDataFields.style.color = 'red';
          deleteDataFields.style.border = '1px solid lightGrey';
          deleteDataFields.style.borderRadius = '5px';
          deleteDataFields.style.lineHeight = '22px';
          deleteDataFields.style.height = '32px';
          deleteDataFields.style.cursor = 'pointer';
          deleteDataFields.title = 'Delete';
      
          deleteDataFields.addEventListener('click', () => {
            this.deleteSystem(params.node);
          });
      
          div.appendChild(saveDataFields);
          div.appendChild(deleteDataFields);
      
          return div;
        }
      },
    ];
  
    defaultColDef = {
      flex: 1,
      sortable: true,
      resizable: true,
      filter:true,
      suppressSizeToFit: true
    };
  
    
  
    // rowData = [
    //   { fieldId: '1', fieldName: 'Name', dataType: 'String', fieldLength: '50',  dqaC: 'L',
    //     dqaT: 'L',
    //     dqaA: 'L', criticality: 'HIGH' },
    // ];
  
    
    onGridReady(params: any) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
     
      this.gridApi.sizeColumnsToFit();
      this.getSystemList();
    }
  
  
    onCellValueChanged(event: any) {
      console.log('Updated row:', event.data);
    }

  ngOnInit(): void {
    
    this.getSystemList();
    this.getChildGriddata();
    // this.rowData= [];
    // this.replaceLastPageSizeLabel();
    this.pageSizeOptions = [this.rowData.length, 5, 10, 50]; // "All" is first

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.patchAllLabel();
    }, 0);
  }
  patchAllLabel() {
    setTimeout(() => {
      const options = document.querySelectorAll('mat-option span.mdc-list-item__primary-text');
      options.forEach((opt: any) => {
        if (opt.textContent?.trim() === String(this.rowData.length)) {
          opt.textContent = 'All';
        }
      });
    }, 100);
  }

  onPageChange(event: any) {
    if (event.pageSize === this.rowData.length || event.pageSize === 'All') {
      this.pageSize = this.rowData.length;
    } else {
      this.pageSize = event.pageSize;
    }
  }
  

  toggleRow(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  addRow(row: any) {
    const newRow = {
      fieldId: '',
      fieldName: '',
      fieldDescription: '',
      dataType: 'Numeric',
      dqaRiskLevel: 'Low',
      criticality: 'Minor',
      riskLevelStatement:''
    };
  
  
    if (!row.childGridData) {
      row.childGridData = [];
    }
  
    row.childGridData = [...row.childGridData, newRow]; // update reference

  }

removeSubRow(parentRow: any, index: number) {
  parentRow.childGridData.splice(index, 1);
}

saveChildGrid(parentRow: any) {
  console.log(parentRow.childGridData, "Child grid data");
  this.systemDataModel.entity_type = "SYSTEM";
  this.systemDataModel.entity_id = parentRow.system_id;
  // this.systemDataModel.field_id = parentRow.childGridData[0].fieldId;
  this.systemDataModel.field_name = parentRow.childGridData[0].field_name;
  this.systemDataModel.field_description = parentRow.childGridData[0].field_description;
  this.systemDataModel.data_type = parentRow.childGridData[0].data_type;
  this.systemDataModel.field_length = parentRow.childGridData[0].field_length;
  this.systemDataModel.risk_level = parentRow.childGridData[0].risk_level;
  this.systemDataModel.criticality = parentRow.childGridData[0].criticality;
  this.systemDataModel.risk_level_statement = parentRow.childGridData[0].risk_level_statement;

  console.log(this.systemDataModel,"System Data Fields");

  this.systemService.createSystemDataFields(this.systemDataModel).subscribe((res: any) => {
    if(res)
    {
      console.log(res, "System builder created");
      // alert("Data field added Successfully.");
      this.toastNotificationService.success("Data field added Successfully.");

      // window.location.reload();
    }
  })
  
}


  getSystemList(): void {
    this.systemService.getSystems().subscribe((data: any) => {
          const systemsWithChildData = data.map((system: any) => {
            const sys = {
              ...system.systemEntity,
              childGridData: [] // set for now, we'll load below
            };
    
      
            return sys;
          });
      
          this.systems = systemsWithChildData;
                this.rowData = this.systems;

      this.dataSource = new MatTableDataSource(this.systems);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // this.pageSizeOptions = [2, 3, 5, this.systems.length];
   

    });
  }
  

  getChildGriddata()
{
  this.systemService.getChildData().subscribe((data: any) => {
    console.log(data, "child grid data")
    
  });


}

  deleteSystem(system: any) {
    this.systemService.deleteSystem(system.data.system_id).subscribe(res => {
        // alert("System Deleted Successfully. Deleted System ID is "+ system.data.system_id);
        this.toastNotificationService.error("System Deleted Successfully. Deleted System ID is "+ system.data.system_id);

        this.getSystemList(); // refresh
    })
  }

  addSystemScreen()
  {
    this.router.navigate(['/systems/system-builder']);

  }

  editSystem(systems:any) {
    this.router.navigate(['/systems/edit-system', systems.data.system_id]);

  }
  
  
}
