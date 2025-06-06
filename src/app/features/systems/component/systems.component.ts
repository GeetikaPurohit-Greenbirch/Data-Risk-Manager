import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
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
  displayedColumns: string[] = ['select', 'systemid', 'name', 'description', 'owner', 'owner_email', 'leanixId', 'version', 'status', 'actions'];
  expandedElement: any | null;
  expandedRow: any | null = null;
  public rowData: any;
  private newRows: any[] = [];
  systemDataModel : SystemDataFields = new SystemDataFields();
  
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

  dataSource: MatTableDataSource<SystemsModel>;

  // systems : SystemsModel = new SystemsModel();
  systems: SystemsModel[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private systemService: SystemServiceService,
    private dialog: MatDialog,
     private router: Router

  ) {
    this.dataSource = new MatTableDataSource(this.systems);
  }

  

  ngOnInit(): void {
    
    this.getSystemList();
    // this.getChildGriddata ();
    // this.rowData= [];

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      alert("Data field added Successfully.");
      // window.location.reload();
    }
  })
  
}


  getSystemList()
  {
    this.systemService.getSystems().subscribe((data: any) => {
      const systemsWithChildData = data.map((system: any) => {
        const sys = {
          ...system.systemEntity,
          childGridData: [] // set for now, we'll load below
        };
  
        // Fetch child data
        this.systemService.getChildData().subscribe((childData: any[]) => {
          sys.childGridData = childData;
        });
  
        return sys;
      });
  
      this.systems = systemsWithChildData;
      this.dataSource.data = this.systems;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    
  }

//   getChildGriddata()
// {
//   this.systemService.getChildData().subscribe((data: any) => {
//     console.log(data, "child grid data")
    
//   });


// }

  deleteSystem(system: SystemsModel) {
    this.systemService.deleteSystem(system.systemEntity.system_id).subscribe(res => {
        alert("System Deleted Successfully. Deleted System ID is "+ system.systemEntity.system_id);
        this.getSystemList(); // refresh
    })
  }

  // editSystem(system: SystemsModel) {
  //   const dialogRef = this.dialog.open(EditSystemDialogComponent, {
  //     width: '1200px',
  //     data: { ...system } // Pass a copy
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // Save updated data to server
  //       // this.systemService.updateSystem(result).subscribe(() => {
  //         this.getSystemList(); // refresh
  //       // });
  //     }
  //   });
  // }

  editSystem(systems:any) {
    this.router.navigate(['/systems/edit-system', systems.system_id]);

  }
  
}
