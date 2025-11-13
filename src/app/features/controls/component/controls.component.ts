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
import { createElement, icons } from 'lucide';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {
  displayedColumns: string[] = [
    'controlid',
    'name',
    'controldesc',
    'attachto',
    'attachtoid',
    'owner',
    'owneremail',
    'version',
    'status',
    'applicationdate',
    'applicationdatestatus',
    'actions',
  ];
  public rowData: any;
  dataSource = new MatTableDataSource<Control>();

  // control : SystemsModel = new SystemsModel();
  control: Control[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 20;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];
  gridApi: any;
  gridColumnApi: any;
  showDataFields = true;
  showDataQuality = false;
  showDataFieldsTable = true;

  constructor(
    private controlService: ControlService,
    private router: Router,
    private toastNotificationService: ToastnotificationService
  ) {}

  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'control_id', headerName: 'Control ID', editable: false },
    { field: 'control_name', headerName: 'Name', editable: true },
    {
      field: 'control_description',
      headerName: 'Control Description',
      editable: true,
    },
    { field: 'attach_to', headerName: 'Attach To', editable: true },
    { field: 'attach_to_id', headerName: 'Attach To ID', editable: true },
    { field: 'control_owner', headerName: 'Control Owner', editable: true },
    { field: 'control_owner_email', headerName: 'Owner Email', editable: true },
    { field: 'version_number', headerName: 'Version', editable: true },
    { field: 'status', headerName: 'Status', editable: true },
    {
      field: 'application_date',
      headerName: 'Application Date',
      editable: true,
    },
    {
      field: 'application_date_status',
      headerName: 'Application Date Status',
      editable: true,
    },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 80,
      maxWidth:100,
      // flex: 1,
      pinned:"right",
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
          this.editControl(params.node);
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
          this.deleteControl(params.node);
        });

        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);

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
    { field: 'control_id', header: 'Control ID', editable: false },
    { field: 'control_name', header: 'Name', editable: true },
    {
      field: 'control_description',
      header: 'Control Description',
      editable: true,
    },
    { field: 'attach_to', header: 'Attach To', editable: true },
    { field: 'attach_to_id', header: 'Attach To ID', editable: true },
    { field: 'control_owner', header: 'Control Owner', editable: true },
    { field: 'control_owner_email', header: 'Owner Email', editable: true },
    { field: 'version_number', header: 'Version', editable: true },
    { field: 'status', header: 'Status', editable: true },
    {
      field: 'application_date',
      header: 'Application Date',
      editable: true,
    },
    {
      field: 'application_date_status',
      header: 'Application Date Status',
      editable: true,
    },
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
    this.getControlList();
  }

  onCellValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  ngOnInit(): void {
    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);
    this.getControlList();
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

  getControlList() {
    this.controlService.getControl().subscribe({
      next: (controls: any[]) => {
        // Map and extract the controlEntity from each item
        const patchedControls = controls.map((data) => ({
          ...data.controlEntity,
        }));

        this.rowData = patchedControls;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching controls:', err);
      },
    });
  }

  deleteControl(controls: any) {
    this.controlService
      .deleteControl(controls.control_id)
      .subscribe(() => {
        // alert("Control Deleted Successfully. Deleted Control ID is "+ controls.data.control_id);
        this.toastNotificationService.error(
          'Control Deleted Successfully. Deleted Control ID is ' +
            controls.control_id
        );
        this.getControlList(); // refresh
      });
  }

  addControlScreen() {
    this.router.navigate(['/controls/control-builder']);
  }

  editControl(controls: any) {
    this.router.navigate(['/controls/edit-control', controls.control_id]);
  }
}
