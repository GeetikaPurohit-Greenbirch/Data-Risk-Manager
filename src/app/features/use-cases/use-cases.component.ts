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


  // usecase : SystemsModel = new SystemsModel();
  usecase: Usecase[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usecaseService: UsecaseService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
    private dialog: MatDialog
  ) { }

  

  ngOnInit(): void {
    
    this.getUsecaseList();
  }

  ngAfterViewInit() {
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    // Optional: if your table includes objects, set a custom filterPredicate
    this.dataSource.filterPredicate = (data: Usecase, filter: string) => {
      const lowerFilter = filter.trim().toLowerCase();

      const formatDate = (date: any): string => {
        return date
          ? new Date(date).toLocaleDateString('en-CA') // yyyy-mm-dd
          : '';
      };
    
      const formattedLastReviewDate = formatDate(data.last_review_date);
      const formattedNextReviewDate = formatDate(data.next_review_date);

      return (
        data.use_case_name?.toLowerCase().includes(lowerFilter) ||
        data.use_case_description?.toLowerCase().includes(lowerFilter) ||
        data.use_case_owner?.toLowerCase().includes(lowerFilter) ||
        data.use_case_owner_email?.toLowerCase().includes(lowerFilter) ||
        data.status?.toLowerCase().includes(lowerFilter) ||
        data.reviewed_by?.toLowerCase().includes(lowerFilter) ||
        data.reviewer?.toLowerCase().includes(lowerFilter) ||
        String(data.use_case_id).includes(lowerFilter) ||
        String(data.version).includes(lowerFilter) ||
        formattedLastReviewDate.includes(lowerFilter) ||
        formattedNextReviewDate.includes(lowerFilter)
      );
    };
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
             // Optional: sortingDataAccessor if sorting by number-as-string
                  this.dataSource.sortingDataAccessor = (item: Usecase, property: string) => {
                    switch (property) {
                      case 'usecaseid': return +item.use_case_id;
                      case 'name': return item.use_case_name;
                      case 'description': return item.use_case_description;
                      case 'owner': return item.use_case_owner;
                      case 'owner_email': return item.use_case_owner_email;
                      case 'version': return item.version;
                      case 'status': return item.status;
                      case 'last_review_date': return item.last_review_date ? new Date(item.last_review_date).getTime() : 0;
                      case 'reviewed_by': return item.reviewed_by;
                      case 'next_review_date': return item.next_review_date ? new Date(item.next_review_date).getTime() : 0;
                      case 'reviewer': return item.reviewer;
                     
                      default: return '';
                    }
                  };
  
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
  
  

  deleteUseCase(usecases:any) {
    this.usecaseService.deleteUsecase(usecases.use_case_id).subscribe(() => {
        // alert("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.usecase_id);
        this.toastNotificationService.success("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.use_case_id);
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
    this.router.navigate(['/use-cases/edit-usecase', usecases.use_case_id]);

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
    this.router.navigate(['/use-cases/share-usecase', row.use_case_id]);
  }
}
