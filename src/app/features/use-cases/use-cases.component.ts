import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usecase } from './models/usecase.model';
import { UsecaseService } from './services/usecase.service';
import { ToastnotificationService } from '../shared-services/toastnotification.service';


@Component({
  selector: 'app-use-cases',
  // standalone: true,
  // imports: [],
  templateUrl: './use-cases.component.html',
  styleUrl: './use-cases.component.scss'
})
export class UseCasesComponent {
 displayedColumns: string[] = ['usecaseid', 'name', 'description', 'owner', 'owner_email', 'version', 'status', 'last_review_date', 'reviewed_by', 'next_review_date', 'reviewer', 'actions'];
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
  ) { }

  

  ngOnInit(): void {
    
    this.getUsecaseList();
  }

  ngAfterViewInit() {
    
  }

  getUsecaseList() {
    this.usecaseService.getUsecase().subscribe({
      next: (usecases: any[]) => {
        // Map and extract the usecaseEntity from each item
        const patchedUsecases = usecases.map(data => ({
          ...data.useCaseEntity
        }));
  
        this.dataSource.data = patchedUsecases;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        console.log(this.dataSource.data, "Usecases");
      },
      error: (err) => {
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
}
