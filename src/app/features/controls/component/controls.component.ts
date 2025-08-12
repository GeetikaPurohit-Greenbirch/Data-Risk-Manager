import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Control } from '../models/control.model';
import { ControlService } from '../services/control.service';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastnotificationService } from '../../shared-services/toastnotification.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {
 displayedColumns: string[] = ['controlid', 'name', 'controldesc', 'attachto', 'attachtoid', 'owner', 'owneremail', 'version', 'status', 'applicationdate', 'applicationdatestatus', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Control>();


  // control : SystemsModel = new SystemsModel();
  control: Control[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 5;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];
gridApi: any;
gridColumnApi: any;



  constructor(private controlService: ControlService,
    private router: Router,
     private toastNotificationService: ToastnotificationService,

  ) { }

  
     columnDefs: (ColDef | ColGroupDef)[]= [
          { field: 'control_id', headerName: 'Target ID', editable: false, },
          { field: 'control_name', headerName: 'Name', editable: true },
          { field: 'control_description', headerName: 'Control Description', editable: true },
          { field: 'attach_to', headerName: 'Attach To', editable: true },
          { field: 'attach_to_id', headerName: 'Attach To ID', editable: true },
          { field: 'control_owner', headerName: 'Control Owner', editable: true },
          { field: 'control_owner_email', headerName: 'Owner Email', editable: true },
          { field: 'version_number', headerName: 'Version', editable: true },
          { field: 'status', headerName: 'Status', editable: true },
          { field: 'application_date', headerName: 'Application Date', editable: true },
          { field: 'application_date_status', headerName: 'Application Date Status', editable: true },
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
                this.editControl(params.node);
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
                this.deleteControl(params.node);
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
          this.getControlList();
        }
      
      
        onCellValueChanged(event: any) {
          console.log('Updated row:', event.data);
        }
    

  ngOnInit(): void {
    
    this.getControlList();
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
  


  getControlList() {
    this.controlService.getControl().subscribe({
      next: (controls: any[]) => {
        // Map and extract the controlEntity from each item
        const patchedControls = controls.map(data => ({
          ...data.controlEntity
        }));
  
        this.rowData = patchedControls;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    
      },
      error: (err) => {
        console.error('Error fetching controls:', err);
      }
    });
  }
  

  deleteControl(controls:any) {
    this.controlService.deleteControl(controls.data.control_id).subscribe(() => {
        // alert("Control Deleted Successfully. Deleted Control ID is "+ controls.data.control_id);
        this.toastNotificationService.error("Control Deleted Successfully. Deleted Control ID is "+ controls.data.control_id);
        this.getControlList(); // refresh
    })
  }

  addControlScreen()
  {
    this.router.navigate(['/controls/control-builder']);

  }

  editControl(controls:any) {
    this.router.navigate(['/controls/edit-control', controls.data.control_id]);

  }
}
