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


@Component({
  selector: 'app-use-cases',
  // standalone: true,
  // imports: [],
  templateUrl: './use-cases.component.html',
  styleUrl: './use-cases.component.scss'
})
export class UseCasesComponent {
 displayedColumns: string[] = ['usecaseid', 'name', 'description', 'owner', 'owner_email', 'version', 'status', 'last_review_date', 'reviewed_by', 'next_review_date', 'reviewer', 'permission', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Usecase>();
  gridApi: any;
  gridColumnApi: any;

  // usecase : SystemsModel = new SystemsModel();
  usecase: Usecase[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 5;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];
  constructor(private usecaseService: UsecaseService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
    private dialog: MatDialog
  ) { }

  

 columnDefs: (ColDef | ColGroupDef)[]= [
    { field: 'use_case_id', headerName: 'Use Case ID', editable: false, },
    { field: 'use_case_name', headerName: 'Name', editable: true },
    { field: 'use_case_description', headerName: 'Description', editable: true },
    { field: 'use_case_owner', headerName: 'Owner', editable: true },
    { field: 'use_case_owner_email', headerName: 'Owner Email', editable: true },
    { field: 'version', headerName: 'Version', editable: true },
    { field: 'status', headerName: 'Status', editable: true },
    { field: 'last_review_date', headerName: 'Last Review Date', editable: true },
    { field: 'reviewed_by', headerName: 'Reviewed By', editable: true },
    { field: 'next_review_date', headerName: 'Next Review Date', editable: true },
    { field: 'reviewer', headerName: 'Reviewer', editable: true },
    { field: 'permission', headerName: 'Permission', editable: true },
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
          this.editUseCase(params.node);
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
          this.deleteUseCase(params.node);
        });

        const shareUsecase = document.createElement('button');
        shareUsecase.className = 'fa fa-share';
        shareUsecase.style.color = 'red';
        shareUsecase.style.border = '1px solid lightGrey';
        shareUsecase.style.borderRadius = '5px';
        shareUsecase.style.lineHeight = '22px';
        shareUsecase.style.height = '32px';
        shareUsecase.style.cursor = 'pointer';
        shareUsecase.title = 'Delete';
    
        shareUsecase.addEventListener('click', () => {
          this.openShareComponent(params.node);
        });
    
        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);
        div.appendChild(shareUsecase);
    
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
  
            this.rowData = finalUsecases;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
             
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
  
  

  deleteUseCase(usecases:any) {
    this.usecaseService.deleteUsecase(usecases.data.use_case_id).subscribe(() => {
        // alert("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.usecase_id);
        this.toastNotificationService.success("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.data.use_case_id);
        setTimeout(() => {
          this.getUsecaseList(); // refresh
        }, 1000);
    })
  }

  addUseCaseScreen()
  {
    this.router.navigate(['/use-cases/create-use-case']);

  }

  editUseCase(usecases:any) {
    this.router.navigate(['/use-cases/edit-usecase', usecases.data.use_case_id]);

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
}
