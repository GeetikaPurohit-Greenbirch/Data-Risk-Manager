import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usecase } from './models/usecase.model';
import { UsecaseService } from './services/usecase.service';
import { ToastnotificationService } from '../shared-services/toastnotification.service';
import { ShareDialogComponent } from './component/share-dialog/share-dialog.component';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { icons, createElement } from 'lucide';

export interface Lineage {
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  use_case_id: number;
  lineage_json: any;
}

@Component({
  selector: 'app-use-cases',
  // standalone: true,
  // imports: [],
  templateUrl: './use-cases.component.html',
  styleUrl: './use-cases.component.scss',
})
export class UseCasesComponent {
  displayedColumns: string[] = [
    'usecaseid',
    'name',
    'description',
    'owner',
    'owner_email',
    'version',
    'status',
    'last_review_date',
    'reviewed_by',
    'next_review_date',
    'reviewer',
    'permission',
    'actions',
  ];
  public rowData?: any;
  dataSource = new MatTableDataSource<Usecase>();
  gridApi: any;
  gridColumnApi: any;

  // usecase : SystemsModel = new SystemsModel();
  usecase: Usecase[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 20;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];
  constructor(
    private usecaseService: UsecaseService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
    private dialog: MatDialog
  ) { }

  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'use_case_id', headerName: 'Use Case ID', editable: false, },
    { field: 'use_case_name', headerName: 'Name', editable: false, },
    { field: 'use_case_description', headerName: 'Description', editable: false, },
    { field: 'use_case_owner', headerName: 'Owner', editable: false, },
    { field: 'use_case_owner_email', headerName: 'Owner Email', editable: false, },
    { field: 'version', headerName: 'Version', editable: false, },
    { field: 'status', headerName: 'Status', editable: false, },
    { field: 'last_review_date', headerName: 'Last Review Date', editable: false, },
    { field: 'reviewed_by', headerName: 'Reviewed By', editable: false, },
    { field: 'next_review_date', headerName: 'Next Review Date', editable: false, },
    { field: 'reviewer', headerName: 'Reviewer', editable: false, },
    { field: 'permission', headerName: 'Permission', editable: false, },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 80,
      maxWidth: 140,
      // flex: 1,
      pinned: 'right',
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';

        // const saveDataFields = document.createElement('button');
        // saveDataFields.className = 'fa fa-edit';
        // saveDataFields.style.color = '#098236';
        // // saveDataFields.style.border = '1px solid lightGrey';
        // // saveDataFields.style.borderRadius = '5px';
        // // saveDataFields.style.lineHeight = '20px';
        // // saveDataFields.style.height = '24px';
        // // saveDataFields.style.cursor = 'pointer';
        // saveDataFields.title = 'Save';

        // EDIT ICON
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
          this.editUseCase(params.node);
        });


        // DELETE ICON
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
          this.deleteUseCase(params.node);
        });


        // SHARE ICON
        const shareUsecase = document.createElement('button');
        shareUsecase.title = 'Share';
        shareUsecase.style.border = 'none';
        shareUsecase.style.padding = '0px';
        shareUsecase.style.cursor = 'pointer';
        shareUsecase.style.background = 'transparent';

        const shareIcon = createElement(icons.Share2, {
          color: '#333',
          height: '14px',
          strokeWidth: 2
        });
        shareUsecase.appendChild(shareIcon);

        shareUsecase.addEventListener('click', () => {
          this.openShareComponent(params.node);
        });

        // GOTO LINEAGE ICON
        const goToLineage = document.createElement('button');
        goToLineage.title = 'Navigate to Lineage';
        goToLineage.style.border = 'none';
        goToLineage.style.padding = '0px';
        goToLineage.style.cursor = 'pointer';
        goToLineage.style.background = 'transparent';

        const navigateIcon = createElement(icons.Navigation, {
          color: '#333',
          height: '14px',
          strokeWidth: 2
        });
        goToLineage.appendChild(navigateIcon);

        goToLineage.addEventListener('click', () => {
          this.openLineageComponent(params.node);
        });



        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);
        div.appendChild(shareUsecase);
        div.appendChild(goToLineage);

        return div;
      },
    },
  ];

  // defaultColDef = {
  //   flex: 1,
  //   sortable: true,
  //   resizable: true,
  //   filter:true,
  //   suppressSizeToFit: true
  // };

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    suppressSizeToFit: true,
    editable: false,  
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
    this.getUsecaseList();
  }

  onCellValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  ngOnInit(): void {
    this.getUsecaseList();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.patchAllLabel();
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

  getUsecaseList() {
    this.usecaseService.getUsecase().subscribe({
      next: (usecases: any[]) => {
        const usecaseEntities = usecases.map((data) => ({
          ...data.useCaseEntity,
        }));

        const useCaseIds = usecaseEntities.map((u) => u.use_case_id);

        // Call permission API with use case IDs
        this.usecaseService.getPermissionsForUsecases(useCaseIds).subscribe({
          next: (permissions: any[]) => {
            // Merge permission with usecaseEntities
            const finalUsecases = usecaseEntities.map((uc) => {
              const perm = permissions.find(
                (p) => p.use_case_id === uc.use_case_id
              );
              return {
                ...uc,
                permission: perm?.is_editable ? 'Edit' : 'View', // or use boolean if needed
              };
            });
            this.patchAllLabel();
            this.rowData = finalUsecases;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: (err) => {
            console.error('Error fetching permissions:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching usecases:', err);
      },
    });
  }

  deleteUseCase(usecases: any) {
    this.usecaseService
      .deleteUsecase(usecases.data.use_case_id)
      .subscribe(() => {
        // alert("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.usecase_id);
        this.toastNotificationService.error(
          'Usecase Deleted Successfully. Deleted Usecase ID is ' +
          usecases.data.use_case_id
        );
        setTimeout(() => {
          this.getUsecaseList(); // refresh
        }, 1000);
      });
  }

  addUseCaseScreen() {
    this.router.navigate(['/use-cases/create-use-case']);
  }

  editUseCase(usecases: any) {
    this.router.navigate([
      '/use-cases/edit-usecase',
      usecases.data.use_case_id,
    ]);
  }

  // openShareDialog(row: any) {
  //   this.usecaseService.getShareableUsers(row.use_case_id).subscribe((users: any[]) => {
  //     const dialogRef = this.dialog.open(ShareDialogComponent, {
  //       width: '400px',
  //       data: {
  //         useCaseId: row.use_case_id,
  //         users: users // should include: id, name, alreadyShared flag
  //       }
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         // Call API to share use case
  //         this.usecaseService.shareUseCase(result).subscribe(() => {
  //           alert('Use case shared successfully!');
  //         });
  //       }
  //     });
  //   });
  // }

  openShareComponent(row: any) {
    this.router.navigate(['/use-cases/share-usecase', row.data.use_case_id]);
  }

  openLineageComponent(row: any) {
    const useCaseId = row.data.use_case_id;

    this.usecaseService.navigateToLineage(useCaseId).subscribe({
      next: (response) => {
        const lineage_json = Array.isArray(response) ? response[0] : response;
        if (lineage_json.lineage_json !== '{}') {
          const lineage = Array.isArray(response) ? response[0] : response;
          if (lineage) {
            this.router.navigate([
              '/graph-embedded/edit-lineage',
              useCaseId,
              lineage.id,
            ]);
          }
        } else {
          this.toastNotificationService.error(
            'No lineage found for useCaseId : ' + useCaseId
          );
          setTimeout(() => {
            this.getUsecaseList(); // refresh
          }, 1000);
        }
      },
      error: (err) => {
        console.error('Failed to fetch lineageId:', err);
      },
    });
  }
}
