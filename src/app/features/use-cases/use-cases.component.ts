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
  
  

  deleteUseCase(usecases:any) {
    this.usecaseService.deleteUsecase(usecases.use_case_id).subscribe(() => {
        // alert("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.usecase_id);
        this.toastNotificationService.success("Usecase Deleted Successfully. Deleted Usecase ID is "+ usecases.use_case_id);
        setTimeout(() => {
          this.getUsecaseList(); // refresh
        }, 1000);
    })
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
