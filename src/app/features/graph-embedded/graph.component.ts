import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Lineage } from './models/usecase.model';
import { LineageService } from './services/lineage.service';
import { UsecaseService } from '../use-cases/services/usecase.service';
import { ToastnotificationService } from '../shared-services/toastnotification.service';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AddLineageDialogComponent } from './add-lineage-dialog.component';
import { ConfirmDialogComponent } from './component/delete-confirmation/deleteConfirmation.component';

type LineageRow = {id:string, lineage_id: string; lineage_name: string; usecase_id: string };


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
  dataSource = new MatTableDataSource<Lineage>();


  // usecase : SystemsModel = new SystemsModel();
  usecase: Lineage[] = []; // ✅ correct

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


  constructor(private lineageService: LineageService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private usecaseService: UsecaseService

  ) { }



  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'id', headerName: 'Lineage ID', editable: false, },
    { field: 'lineage_name', headerName: 'Name', editable: true },
    { field: 'use_case_name', headerName: 'Usecase Name', editable: false, },
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
        saveDataFields.style.marginRight = '10px';

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
        openBtn.style.marginRight = '10px';
        openBtn.title = 'Open';
        openBtn.addEventListener('click', () => {
          this.editLineage(params.data);
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
          this.deleteLineage(params.data);
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
    this.getLineageList();
    this.getUsecaseOptions()
  }
  ngAfterViewInit() {

  }
  getLineageList() {
    // ✅ Dummy Data for Testing
  

    // ✅ Directly set dummy data (No API call)
   


    this.lineageService.getLineage().subscribe({
      next: (lineages: any[]) => {
        console.log('Fetched lineages:', lineages);
        this.rowData = lineages;
        this.dataSource = new MatTableDataSource(lineages);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: err => {
        console.error('Error fetching lineages:', err);
      }
    });


  }
  getUsecaseOptions(): void {
    this.usecaseService.getUsecase().subscribe({
      next: (usecases: any[]) => {
        this.usecaseOptions = usecases.map(u => ({
          id: u.useCaseEntity.use_case_id,
          name: u.useCaseEntity.use_case_name
        }));
        console.log('Usecase options:', this.usecaseOptions);
      },
      error: err => {
        console.error('Error fetching usecase options:', err);
      }
    });
  }
  openAddLineageDialog() {
    const ref = this.dialog.open(AddLineageDialogComponent, {
      width: '420px',
      data: { usecaseOptions: this.usecaseOptions, mode: 'add' },
      disableClose: true
    });

    ref.afterClosed().subscribe((result?: { lineage_name: string; usecase_id: string }) => {
      if (!result) return;
      this.getLineageList();
    });
  }
  openEditLineageDialog(row: LineageRow) {
    console.log("Edit Lineage ID: ", row);
    const ref = this.dialog.open(AddLineageDialogComponent, {
      width: '420px',
      data: { mode: 'edit', usecaseOptions: this.usecaseOptions, value: {...row,lineage_id:row?.id} },
      disableClose: true
    });

    ref.afterClosed().subscribe((result?: any) => {
      if (!result) return;
      if (result.mode === 'edit') {
        // update by lineage_id
        this.rowData = this.rowData.map((r: any) =>
          r.lineage_id === result.lineage_id
            ? { ...r, lineage_name: result.lineage_name.trim(), usecase_id: result.usecase_id }
            : r
        );
        this.dataSource.data = [...this.rowData] as any;
        this.gridApi?.setRowData?.(this.rowData);
        this.getLineageList(); // Refresh list after editing
      }
    });
  }
  private generateNextLineageId(): string {
    // Find max numeric part among existing IDs like "L001"
    const maxNum = this.rowData.reduce((acc: any, r: any) => {
      const n = parseInt((r.lineage_id || '').replace(/[^\d]/g, ''), 10);
      return isNaN(n) ? acc : Math.max(acc, n);
      // start from 0 if empty
    }, 0);
    const next = maxNum + 1;
    return 'L' + String(next).padStart(3, '0');
  }
  editLineage(lineages: any) {
  console.log("Edit Usecase ID: ", lineages.use_case_id, " Lineage ID: ", lineages.id);

  this.router.navigate([
    '/graph-embedded/edit-lineage',
    lineages.use_case_id,
    lineages.id
  ]);
}

  deleteLineage(lineage: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: { name: lineage.lineage_name || 'this lineage' },
    disableClose: true
  });

  ref.afterClosed().subscribe(result => {
    if (result) {
      this.lineageService.deleteLineage(lineage).subscribe({
        next: (response) => {
          console.log('Lineage deleted successfully:', response);
          this.getLineageList();
          this.toastNotificationService.success('Lineage deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting lineage:', error);
          this.toastNotificationService.error('Failed to delete lineage');
        }
      });
    }
  });
  }
}
