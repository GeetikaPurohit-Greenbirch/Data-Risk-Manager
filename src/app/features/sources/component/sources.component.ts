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
import { createElement, icons } from 'lucide';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrl: './sources.component.scss',
})
export class SourcesComponent {
  displayedColumns: string[] = [
    'sourceid',
    'name',
    'vendor',
    'servicequality',
    'frequencyupdate',
    'scheduleupdate',
    'transfermethodology',
    'sourcetype',
    'version',
    'status',
    'owner',
    'owner_email',
    'actions',
  ];
  // public rowData: any;
  rowData: any[] = [];

  dataSource = new MatTableDataSource<Sources>();

  // source : SystemsModel = new SystemsModel();
  source: Sources[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout
  gridApi: any;
  gridColumnApi: any;
  showDataFields = true;
  showDataQuality = false;
  showDataFieldsTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 20;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];

  constructor(
    private sourceService: SourceService,
    private router: Router,
    private toastNotificationService: ToastnotificationService
  ) { }

  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'source_id', headerName: 'Source ID', editable: false },
    { field: 'source_name', headerName: 'Name', editable: false },
    { field: 'vendor', headerName: 'Vendor', editable: false },
    {
      field: 'quality_of_service',
      headerName: 'Quality Of Service',
      editable: false,
    },
    {
      field: 'frequency_of_update',
      headerName: 'Frequency Of Update',
      editable: false,
    },
    {
      field: 'schedule_of_update',
      headerName: 'Schedule Of Update',
      editable: false,
    },
    {
      field: 'methodology_of_transfer',
      headerName: 'Methodology Of Transfer',
      editable: false,
    },
    { field: 'source_type', headerName: 'Source Type', editable: false },
    { field: 'source_version_number', headerName: 'Version', editable: false },
    { field: 'source_status', headerName: 'Status', editable: false },
    { field: 'source_owner', headerName: 'Owner', editable: false },
    { field: 'source_owner_email', headerName: 'Owner Email', editable: false },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 80,
      maxWidth: 100,
      // flex: 1,
      pinned: 'right',
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';

        const saveDataFields = document.createElement('button');
        saveDataFields.title = 'Edit';
        saveDataFields.style.padding = '0px';
        saveDataFields.style.border = 'none';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.style.background = 'transparent';

        const editIcon = createElement(icons.Pencil, {
          color: '#098236',
          height: '14px',
          strokeWidth: 2
        });
        saveDataFields.appendChild(editIcon);
        
        saveDataFields.addEventListener('click', () => {
          this.editSource(params.node);
        });

        const deleteDataFields = document.createElement('button');
        deleteDataFields.title = 'Delete';
        deleteDataFields.style.border = 'none';
        deleteDataFields.style.padding = '0px';
        deleteDataFields.style.cursor = 'pointer';
        deleteDataFields.style.background = 'transparent';

        const deleteIcon = createElement(icons.Trash2, {
          color: '#c10007',
          height: '14px',
          strokeWidth: 2
        });
        deleteDataFields.appendChild(deleteIcon);

        deleteDataFields.addEventListener('click', () => {
          this.deleteSource(params.node);
        });

        // 🧬 Clone Button
                const cloneDataFields = document.createElement('button');
                cloneDataFields.title = 'Copy';
                cloneDataFields.style.border = 'none';
                cloneDataFields.style.padding = '0px';
                cloneDataFields.style.cursor = 'pointer';
                cloneDataFields.style.background = 'transparent';
        
                const cloneBtn = createElement(icons.Copy, {
                  color: '#3e63dd',
                  height: '14px',
                  strokeWidth: 2
                });
                cloneDataFields.appendChild(cloneBtn);
                cloneDataFields.addEventListener('click', () => {
                  this.cloneSource(params.node.data);
                });
            
                div.appendChild(saveDataFields);
                div.appendChild(deleteDataFields);
                div.appendChild(cloneDataFields);
        
                return div;
      },
    },
  ];

  defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    editable: false,
    resizable: true,
    suppressSizeToFit: true,
  };

  // rowData = [
  //   { fieldId: '1', fieldName: 'Name', dataType: 'String', fieldLength: '50',  dqaC: 'L',
  //     dqaT: 'L',
  //     dqaA: 'L', criticality: 'HIGH' },
  // ];

  selectedColumns: any[] = [];
  globalFilterFields: string[] = [];

  cols = [
    { field: 'source_id', header: 'Source ID', editable: false },
    { field: 'source_name', header: 'Name', editable: false },
    { field: 'vendor', header: 'Vendor', editable: false },
    { field: 'source_description', header: 'Description', editable: false },
    {
      field: 'quality_of_service',
      header: 'Quality Of Service',
      editable: false,
    },
    {
      field: 'frequency_of_update',
      header: 'Frequency Of Update',
      editable: false,
    },
    {
      field: 'schedule_of_update',
      header: 'Schedule Of Update',
      editable: false,
    },
    {
      field: 'methodology_of_transfer',
      header: 'Methodology Of Transfer',
      editable: false,
    },
    { field: 'source_type', header: 'Source Type', editable: false },
    { field: 'source_version_number', header: 'Version', editable: false },
    { field: 'source_status', header: 'Status', editable: false },
    { field: 'source_owner', header: 'Owner', editable: false },
    { field: 'source_owner_email', header: 'Owner Email', editable: false },
  ];

  onColumnsChange(event: any) {
    // event.value contains selected column objects
    this.selectedColumns = event.value;
    this.globalFilterFields = this.selectedColumns.map((c: any) => c.field);
  }

  // called from input (so we don't rely on template dt variable usage)
  onGlobalFilter(value: string, dt: any) {
    // sanitize input and call table API
    const q = (value || '').trim();
    dt.filterGlobal(q, 'contains');
  }
  
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
    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);
    this.getSourceList();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.patchAllLabel();
    }, 0);
  }
  patchAllLabel() {
    setTimeout(() => {
      const options = document.querySelectorAll(
        'mat-option span.mdc-list-item__primary-text'
      );
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
        const patchedSources = sources.map((data) => ({
          ...data.sourceEntity,
        }));

        this.rowData = patchedSources;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching sources:', err);
      },
    });
  }

  deleteSource(sources: any) {
    this.sourceService.deleteSource(sources.source_id).subscribe(() => {
      // alert("Source Deleted Successfully. Deleted Source ID is "+ sources.data.source_id);
      this.toastNotificationService.error(
        'Source Deleted Successfully. Deleted Source ID is ' +
        sources.source_id
      );

      this.getSourceList(); // refresh
    });
  }

  addSourceScreen() {
    this.router.navigate(['sources/source-builder']);
  }

  editSource(sources: any) {
    this.router.navigate(['/sources/edit-source', sources.source_id]);
  }

  cloneSource(sourceData: Sources) {
      // Remove unique IDs (if any) and flag it as cloned
      const clonedData = { ...sourceData };
    
      // Optional: mark this as a clone for validation later
      clonedData.isClone = true;
    
      // Navigate to Interface Builder with prefilled data
      this.router.navigate(['/sources/source-builder'], {
        state: { clonedSource: clonedData }
      });
    }
}
