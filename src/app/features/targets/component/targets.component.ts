import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Target } from '../models/target.model';
import { TargetService } from '../services/target.service';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ToastnotificationService } from '../../shared-services/toastnotification.service';
import { createElement, icons } from 'lucide';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.scss',
})
export class TargetsComponent {
  displayedColumns: string[] = [
    'targetid',
    'name',
    'servicequality',
    'frequencyupdate',
    'scheduleupdate',
    'transfermethodology',
    'targettype',
    'targetentity',
    'version',
    'status',
    'owner',
    'owner_email',
    'actions',
  ];
  // public rowData: any;
  rowData: any[] = [];

  dataSource = new MatTableDataSource<Target>();

  // target : SystemsModel = new SystemsModel();
  target: Target[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout
  gridApi: any;
  gridColumnApi: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 20;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];
  showDataFields = true;
  showDataQuality = false;
  showDataFieldsTable = true;

  constructor(
    private targetService: TargetService,
    private router: Router,
    private toastNotificationService: ToastnotificationService
  ) { }

  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'target_id', headerName: 'Target ID', editable: false },
    { field: 'target_name', headerName: 'Name', editable: false },
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
    { field: 'target_type', headerName: 'Target Type', editable: false },
    { field: 'target_version_number', headerName: 'Version', editable: false },
    { field: 'target_status', headerName: 'Status', editable: false },
    { field: 'target_owner', headerName: 'Owner', editable: false },
    { field: 'target_owner_email', headerName: 'Owner Email', editable: false },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 80,
      maxWidth: 100,
      // flex: 1,
      pinned: "right",
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
        // Pass row data or node to save
        saveDataFields.addEventListener('click', () => {
          this.editTarget(params.node);
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
          this.deleteTarget(params.node);
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
           this.cloneTarget(params.node.data);
         });
     
         div.appendChild(saveDataFields);
         div.appendChild(deleteDataFields);
         div.appendChild(cloneDataFields);
 
         return div;
      },
    },
  ];

  // defaultColDef = {
  //   flex: 1,
  //   sortable: true,
  //   resizable: true,
  //   filter: true,
  //   suppressSizeToFit: true,
  // };

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
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
    { field: 'target_id', header: 'Target ID', editable: false },
    { field: 'target_name', header: 'Name', editable: false },
    { field: 'vendor', header: 'Vendor', editable: false },
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
      headerName: 'Methodology Of Transfer',
      editable: false,
    },
    { field: 'target_type', header: 'Target Type', editable: false },
    { field: 'target_version_number', header: 'Version', editable: false },
    { field: 'target_status', header: 'Status', editable: false },
    { field: 'target_owner', header: 'Owner', editable: false },
    { field: 'target_owner_email', header: 'Owner Email', editable: false },
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
    this.getTargetList();
  }

  onCellValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  ngOnInit(): void {
    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);
    this.getTargetList();
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

  getTargetList() {
    this.targetService.getTarget().subscribe({
      next: (targets: any[]) => {
        // Map and extract the targetEntity from each item
        const patchedTargets = targets.map((data) => ({
          ...data.targetEntity,
        }));

        this.rowData = patchedTargets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching targets:', err);
      },
    });
  }

  deleteTarget(targets: any) {
    this.targetService.deleteTarget(targets.target_id).subscribe(() => {
      // alert("Target Deleted Successfully. Deleted Target ID is "+ targets.data.target_id);
      this.toastNotificationService.error(
        'Target Deleted Successfully. Deleted Target ID is ' +
        targets.target_id
      );

      this.getTargetList(); // refresh
    });
  }

  addTargetScreen() {
    this.router.navigate(['/targets/target-builder']);
  }

  editTarget(targets: any) {
    this.router.navigate(['/targets/edit-target', targets.target_id]);
  }

  cloneTarget(targetData: Target) {
        // Remove unique IDs (if any) and flag it as cloned
        const clonedData = { ...targetData };
      
        // Optional: mark this as a clone for validation later
        clonedData.isClone = true;
      
        // Navigate to Interface Builder with prefilled data
        this.router.navigate(['/targets/target-builder'], {
          state: { clonedTarget: clonedData }
        });
      }
}
