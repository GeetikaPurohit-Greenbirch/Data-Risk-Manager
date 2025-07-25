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
  pageSize = 5;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];



  constructor(private systemService: SystemServiceService,
    private dialog: MatDialog,
     private router: Router

  ) {
    this.dataSource = new MatTableDataSource(this.systems);
  }

  

  ngOnInit(): void {
    
    this.getSystemList();
    this.getChildGriddata();
    // this.rowData= [];
    // this.replaceLastPageSizeLabel();
    this.pageSizeOptions = [this.systems.length, 5, 10, 50]; // "All" is first

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
        if (opt.textContent?.trim() === String(this.systems.length)) {
          opt.textContent = 'All';
        }
      });
    }, 100);
  }

  onPageChange(event: any) {
    if (event.pageSize === this.systems.length || event.pageSize === 'All') {
      this.pageSize = this.systems.length;
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
      alert("Data field added Successfully.");
      // window.location.reload();
    }
  })
  
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  // Optional: if your table includes objects, set a custom filterPredicate
  this.dataSource.filterPredicate = (data: SystemsModel, filter: string) => {
    return (
      data.system_name?.toLowerCase().includes(filter) ||
      data.description?.toLowerCase().includes(filter) ||
      data.owner?.toLowerCase().includes(filter) ||
      data.owner_email?.toLowerCase().includes(filter) ||
      data.leanix_id?.toLowerCase().includes(filter) ||
      data.status?.toLowerCase().includes(filter) ||
      String(data.system_id).includes(filter) ||
      String(data.version_number).includes(filter)
    );
  };
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
                this.dataSource.data = this.systems;

      this.dataSource = new MatTableDataSource(this.systems);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // this.pageSizeOptions = [2, 3, 5, this.systems.length];
   

      // Optional: sortingDataAccessor if sorting by number-as-string
      this.dataSource.sortingDataAccessor = (item: SystemsModel, property: string) => {
        switch (property) {
          case 'systemid': return +item.system_id;
          case 'name': return item.system_name;
          case 'description': return item.description;
          case 'owner': return item.owner;
          case 'owner_email': return item.owner_email;
          case 'leanixId': return item.leanix_id;
          case 'version': return item.version_number;
          case 'status': return item.status;
          default: return '';
        }
      };
  
      // 👇 Set and trigger default sorting
      this.sort.active = 'systemid';    // matColumnDef name
      this.sort.direction = 'asc';      // or 'desc'
      this.sort.sortChange.emit();      // <- triggers the sort to apply
    });
  }
  

  getChildGriddata()
{
  this.systemService.getChildData().subscribe((data: any) => {
    console.log(data, "child grid data")
    
  });


}

  deleteSystem(system: SystemsModel) {
    this.systemService.deleteSystem(system.system_id).subscribe(res => {
        alert("System Deleted Successfully. Deleted System ID is "+ system.system_id);
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

  addSystemScreen()
  {
    this.router.navigate(['/systems/system-builder']);

  }

  editSystem(systems:any) {
    this.router.navigate(['/systems/edit-system', systems.system_id]);

  }
  
}
