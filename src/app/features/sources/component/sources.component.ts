import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SourceService } from '../services/source.service';
import { Router } from '@angular/router';
import { SourceEntity, Sources } from '../models/sources.model';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastnotificationService } from '../../shared-services/toastnotification.service';


@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrl: './sources.component.scss'
})
export class SourcesComponent {
displayedColumns: string[] = ['sourceid', 'name', 'vendor', 'servicequality', 'frequencyupdate', 'scheduleupdate', 'transfermethodology', 'sourcetype', 'version', 'status', 'owner', 'owner_email', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Sources>();


  // source : SystemsModel = new SystemsModel();
  source: Sources[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout
  gridApi: any;
  gridColumnApi: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 5;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];

  constructor(private sourceService: SourceService,
    private router: Router,
     private toastNotificationService: ToastnotificationService,

  ) { }

  columnDefs: (ColDef | ColGroupDef)[]= [
      { field: 'source_id', headerName: 'Source ID', editable: false, },
      { field: 'source_name', headerName: 'Name', editable: true },
      { field: 'vendor', headerName: 'Vendor', editable: true },
      { field: 'quality_of_service', headerName: 'Quality Of Service', editable: true },
      { field: 'frequency_of_update', headerName: 'Frequency Of Update', editable: true },
      { field: 'schedule_of_update', headerName: 'Schedule Of Update', editable: true },
      { field: 'methodology_of_transfer', headerName: 'Methodology Of Transfer', editable: true },
      { field: 'source_type', headerName: 'Source Type', editable: true },
      { field: 'source_version_number', headerName: 'Version', editable: true },
      { field: 'source_status', headerName: 'Status', editable: true },
      { field: 'source_owner', headerName: 'Owner', editable: true },
      { field: 'source_owner_email', headerName: 'Owner Email', editable: true },
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
            this.editSource(params.node);
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
            this.deleteSource(params.node);
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
      this.getSourceList();
    }
  
  
    onCellValueChanged(event: any) {
      console.log('Updated row:', event.data);
    }

  ngOnInit(): void {
    
    this.getSourceList();
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
  

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  
  //   // Optional: if your table includes objects, set a custom filterPredicate
  //   this.dataSource.filterPredicate = (data: Sources, filter: string) => {
  //     return (
  //       data.source_name?.toLowerCase().includes(filter) ||
  //       data.quality_of_service?.toLowerCase().includes(filter) ||
  //       String(data.frequency_of_update).includes(filter) ||
  //       data.schedule_of_update?.includes(filter) ||
  //       data.methodology_of_transfer?.toLowerCase().includes(filter) ||
  //       data.source_type?.toLowerCase().includes(filter) ||
  //       data.source_version_number?.toLowerCase().includes(filter) ||
  //       data.source_status?.toLowerCase().includes(filter) ||
  //       data.source_owner?.toLowerCase().includes(filter) ||
  //       data.source_owner_email?.toLowerCase().includes(filter) ||
  //       String(data.source_id).includes(filter) 
  //     );
  //   };
  // }

  getSourceList() {
    this.sourceService.getSources().subscribe({
      next: (sources: any[]) => {
        // Map and extract the sourceEntity from each item
        const patchedSources = sources.map(data => ({
          ...data.sourceEntity
        }));
  
        this.rowData = patchedSources;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
      },
      error: (err) => {
        console.error('Error fetching sources:', err);
      }
    });
  }
  

  deleteSource(sources:any) {
    this.sourceService.deleteSource(sources.data.source_id).subscribe(() => {
        // alert("Source Deleted Successfully. Deleted Source ID is "+ sources.data.source_id);
        this.toastNotificationService.error("Source Deleted Successfully. Deleted Source ID is "+ sources.data.source_id);

        this.getSourceList(); // refresh
    })
  }

  addSourceScreen()
  {
    this.router.navigate(['sources/source-builder']);
  }

  editSource(sources:any) {
    this.router.navigate(['/sources/edit-source', sources.data.source_id]);

  }
}
