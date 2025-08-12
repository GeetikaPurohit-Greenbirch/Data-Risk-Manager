import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usecase } from './models/usecase.model';
import { UsecaseService } from './services/usecase.service';
import { ToastnotificationService } from '../shared-services/toastnotification.service';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AddLineageDialogComponent } from './add-lineage-dialog.component';

type LineageRow = { lineage_id: string; lineage_name: string; usecase_id: string };


@Component({
  selector: 'app-builder',
  // standalone: true,
  // imports: [],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class UseCasesComponent {
  displayedColumns: string[] = ['lineage_id', 'name', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Usecase>();


  // usecase : SystemsModel = new SystemsModel();
  usecase: Usecase[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  gridApi: any;
  gridColumnApi: any;
   pageSize = 5;
  data: any[] = []; // example

    usecaseOptions = [
    { id: 'Usecase001', name: 'Fraud Detection' },
    { id: 'Usecase002', name: 'Customer 360' },
    { id: 'Usecase003', name: 'Churn Prediction' }
  ];


  constructor(private usecaseService: UsecaseService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
    private dialog: MatDialog,
     private ngZone: NgZone,
  private cdr: ChangeDetectorRef

  ) { }



  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'lineage_id', headerName: 'Lineage ID', editable: false, },
    { field: 'lineage_name', headerName: 'Name', editable: true },
    { field: 'usecase_id', headerName: 'Usecase ID', editable: false, },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 100,
      flex: 1,
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
    this.openEditLineageFromGrid?.(params.data);
          

        });

        const openBtn = document.createElement('button');
      openBtn.className = 'fa fa-external-link'; // or 'fa fa-folder-open'
      openBtn.style.color = '#0b5ed7';
      openBtn.style.border = '1px solid lightGrey';
      openBtn.style.borderRadius = '5px';
      openBtn.style.height = '32px';
      openBtn.style.width = '36px';
      openBtn.style.cursor = 'pointer';
      openBtn.title = 'Open';
      openBtn.addEventListener('click', () => {
        this.editUseCase(params.data);
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
          // this.deleteControl(params.node);
        });

        div.appendChild(saveDataFields);
        div.appendChild(openBtn)
        div.appendChild(deleteDataFields);

        return div;
      }
    },
  ];

  defaultColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    filter: true,
    suppressSizeToFit: true
  };

  openAddLineageDialogFromGrid() {
  this.ngZone.run(() => {
    this.openAddLineageDialog();   // your existing method
    this.cdr.markForCheck();       // nudge CD just in case
  });
}

openEditLineageFromGrid(row: LineageRow) {
  this.ngZone.run(() => {
    this.openEditLineageDialog(row);
    this.cdr.markForCheck();
  });
}


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    // this.getControlList();
  }


  onCellValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }



  ngOnInit(): void {

    this.dataSource.data = [
      { lineage_id: 'L001', name: 'Lineage 1', permission: 'Edit' },
      { lineage_id: 'L002', name: 'Lineage 2', permission: 'Edit' },
      { lineage_id: 'L003', name: 'Lineage 3', permission: 'Edit' }
    ];

     this.getLineageList();
  }
  

  ngAfterViewInit() {

  }


  getLineageList() {
  // ✅ Dummy Data for Testing
  const dummyControls: any[] = [
    {
      lineage_id: 'L001',
      lineage_name: 'Lineage 1',
      usecase_id: 'Usecase001',
    },
    {
     lineage_id: 'L002',
     lineage_name: 'Lineage 2',
      usecase_id: 'Usecase002',
    },
    {
      lineage_id: 'L003',
      lineage_name: 'Lineage 3',
      usecase_id: 'Usecase003',
    }
  ];

  // ✅ Directly set dummy data (No API call)
  this.rowData = dummyControls;
  this.dataSource = new MatTableDataSource(dummyControls);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

  openAddLineageDialog() {
    const ref = this.dialog.open(AddLineageDialogComponent, {
      width: '420px',
      data: { usecaseOptions: this.usecaseOptions },
      disableClose: true
    });

    ref.afterClosed().subscribe((result?: { lineage_name: string; usecase_id: string }) => {
      if (!result) return;

      const newRow: LineageRow = {
        lineage_id: this.generateNextLineageId(),
        lineage_name: result.lineage_name.trim(),
        usecase_id: result.usecase_id
      };

      // Update arrays
      this.rowData = [newRow, ...this.rowData];

      // Refresh MatTable
      this.dataSource.data = [...this.rowData] as any;

      // Refresh AG Grid
      if (this.gridApi?.setRowData) {
        this.gridApi.setRowData(this.rowData);
      } else if (this.gridApi?.setGridOption) {
        this.gridApi.setGridOption('rowData', this.rowData);
      }

      // this.toastNotificationService.success('Lineage added');
    });
  }

  openEditLineageDialog(row: LineageRow) {
  const ref = this.dialog.open(AddLineageDialogComponent, {
    width: '420px',
    data: { mode: 'edit', usecaseOptions: this.usecaseOptions, value: row },
    disableClose: true
  });

  ref.afterClosed().subscribe((result?: any) => {
    if (!result) return;
    if (result.mode === 'edit') {
      // update by lineage_id
      this.rowData = this.rowData.map((r:any) =>
        r.lineage_id === result.lineage_id
          ? { ...r, lineage_name: result.lineage_name.trim(), usecase_id: result.usecase_id }
          : r
      );
      this.dataSource.data = [...this.rowData] as any;
      this.gridApi?.setRowData?.(this.rowData);
    }
  });
}



   private generateNextLineageId(): string {
    // Find max numeric part among existing IDs like "L001"
    const maxNum = this.rowData.reduce((acc:any, r:any) => {
      const n = parseInt((r.lineage_id || '').replace(/[^\d]/g, ''), 10);
      return isNaN(n) ? acc : Math.max(acc, n);
      // start from 0 if empty
    }, 0);
    const next = maxNum + 1;
    return 'L' + String(next).padStart(3, '0');
  }



  getUsecaseList() {
    this.usecaseService.getUsecase().subscribe({
      next: (usecases: any[]) => {
        const usecaseEntities = usecases.map(data => ({
          ...data.useCaseEntity
        }));

        const useCaseIds = usecaseEntities.map(u => u.use_case_id);

        // Call permission API with use case IDs
        this.usecaseService.getPermissionsForUsecases(useCaseIds).subscribe({
          next: (permissions: any[]) => {
            // Merge permission with usecaseEntities
            const finalUsecases = usecaseEntities.map(uc => {
              const perm = permissions.find(p => p.use_case_id === uc.use_case_id);
              return {
                ...uc,
                permission: perm?.is_editable ? 'Edit' : 'View' // or use boolean if needed
              };
            });

            this.dataSource.data = finalUsecases;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            console.log(this.dataSource.data, "Usecases with Permissions");
          },
          error: err => {
            console.error('Error fetching permissions:', err);
          }
        });
      },
      error: err => {
        console.error('Error fetching usecases:', err);
      }
    });
  }



  deleteUseCase(usecases: any) {
    this.usecaseService.deleteUsecase(usecases.use_case_id).subscribe(() => {
      // alert("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.usecase_id);
      this.toastNotificationService.success("Usecase Deleted Successfully. Deleted Usecase ID is " + usecases.use_case_id);
      setTimeout(() => {
        this.getUsecaseList(); // refresh
      }, 1000);
    })
  }

  editUseCase(lineages: any) {
    console.log("Edit Usecase ID: ", lineages.lineage_id);
    this.router.navigate(['/graph-embedded/edit-lineage', lineages.lineage_id]);

  }
  openShareComponent(row: any) {
    this.router.navigate(['/use-cases/share-usecase', row.use_case_id]);
  }
}
