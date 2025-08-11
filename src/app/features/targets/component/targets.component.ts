import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Target } from '../models/target.model';
import { TargetService } from '../services/target.service';
import { ColDef, ColGroupDef } from 'ag-grid-community';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.scss'
})
export class TargetsComponent {
displayedColumns: string[] = ['targetid', 'name', 'servicequality', 'frequencyupdate', 'scheduleupdate', 'transfermethodology', 'targettype', 'targetentity' ,'version', 'status', 'owner', 'owner_email', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Target>();


  // target : SystemsModel = new SystemsModel();
  target: Target[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout
  gridApi: any;
  gridColumnApi: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 5;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];

  constructor(private targetService: TargetService,
    private router: Router

  ) { }

   columnDefs: (ColDef | ColGroupDef)[]= [
        { field: 'target_id', headerName: 'Target ID', editable: false, },
        { field: 'target_name', headerName: 'Name', editable: true },
        { field: 'vendor', headerName: 'Vendor', editable: true },
        { field: 'quality_of_service', headerName: 'Quality Of Service', editable: true },
        { field: 'frequency_of_update', headerName: 'Frequency Of Update', editable: true },
        { field: 'schedule_of_update', headerName: 'Schedule Of Update', editable: true },
        { field: 'methodology_of_transfer', headerName: 'Methodology Of Transfer', editable: true },
        { field: 'target_type', headerName: 'Target Type', editable: true },
        { field: 'target_version_number', headerName: 'Version', editable: true },
        { field: 'target_status', headerName: 'Status', editable: true },
        { field: 'target_owner', headerName: 'Owner', editable: true },
        { field: 'target_owner_email', headerName: 'Owner Email', editable: true },
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
              this.editTarget(params.node);
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
              this.deleteTarget(params.node);
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
        this.getTargetList();
      }
    
    
      onCellValueChanged(event: any) {
        console.log('Updated row:', event.data);
      }
  

  ngOnInit(): void {
    
    this.getTargetList();
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
  


  getTargetList() {
    this.targetService.getTarget().subscribe({
      next: (targets: any[]) => {
        // Map and extract the targetEntity from each item
        const patchedTargets = targets.map(data => ({
          ...data.targetEntity
        }));
  
        this.rowData = patchedTargets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
      },
      error: (err) => {
        console.error('Error fetching targets:', err);
      }
    });
  }
  

  deleteTarget(targets:any) {
    this.targetService.deleteTarget(targets.data.target_id).subscribe(() => {
        alert("Target Deleted Successfully. Deleted Target ID is "+ targets.data.target_id);
        this.getTargetList(); // refresh
    })
  }

  addTargetScreen()
  {
    this.router.navigate(['/targets/target-builder']);

  }

  editTarget(targets:any) {
    this.router.navigate(['/targets/edit-target', targets.data.target_id]);

  }
}
