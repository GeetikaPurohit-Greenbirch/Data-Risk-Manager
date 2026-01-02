import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Usecase } from './models/usecase.model';
import { UsecaseService } from './services/usecase.service';
import { ToastnotificationService } from '../shared-services/toastnotification.service';

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
  templateUrl: './use-cases.component.html',
  styleUrl: './use-cases.component.scss',
})
export class UseCasesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
  selectedColumns: any[] = [];
  globalFilterFields: string[] = [];
  cols = [
    { field: 'use_case_id', header: 'Use Case ID', editable: false, },
    { field: 'use_case_name', header: 'Name', editable: false, },
    { field: 'use_case_description', header: 'Description', editable: false, },
    { field: 'use_case_owner', header: 'Owner', editable: false, },
    { field: 'use_case_owner_email', header: 'Owner Email', editable: false, },
    { field: 'version', header: 'Version', editable: false, },
    { field: 'status', header: 'Status', editable: false, },
    { field: 'last_review_date', header: 'Last Review Date', editable: false, },
    { field: 'reviewed_by', header: 'Reviewed By', editable: false, },
    { field: 'next_review_date', header: 'Next Review Date', editable: false, },
    { field: 'reviewer', header: 'Reviewer', editable: false, },
    { field: 'permission', header: 'Permission', editable: false, },
    // { field: 'actions', header: 'Actions', editable: false, },
  ];
  
  constructor(
    private usecaseService: UsecaseService,
    private router: Router,
    private toastNotificationService: ToastnotificationService
  ) { }

  ngOnInit(): void {
    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);
    this.getUsecaseList();
  }
  
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
      .deleteUsecase(usecases.use_case_id)
      .subscribe(() => {
        // alert("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.usecase_id);
        this.toastNotificationService.error(
          'Usecase Deleted Successfully. Deleted Usecase ID is ' +
          usecases.use_case_id
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
      usecases.use_case_id,
    ]);
  }  

  openShareComponent(row: any) {
    this.router.navigate(['/use-cases/share-usecase', row.use_case_id]);
  }

  openLineageComponent(row: any) {
    const useCaseId = row.use_case_id;

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
