import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Target } from '../models/target.model';
import { TargetService } from '../services/target.service';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.scss'
})
export class TargetsComponent {
displayedColumns: string[] = ['targetid', 'name', 'servicequality', 'frequencyupdate', 'scheduleupdate', 'transfermethodology', 'targettype', 'targetentity' ,'version', 'status', 'owner', 'owner_email', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Target>();


  // target : SystemsModel = new SystemsModel();
  target: Target[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private targetService: TargetService,
    private router: Router

  ) { }

  

  ngOnInit(): void {
    
    this.getTargetList();
  }

  ngAfterViewInit() {
    
  }

  getTargetList() {
    this.targetService.getTarget().subscribe({
      next: (targets: any[]) => {
        // Map and extract the targetEntity from each item
        const patchedTargets = targets.map(data => ({
          ...data.targetEntity
        }));
  
        this.dataSource.data = patchedTargets;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        console.log(this.dataSource.data, "Targets");
      },
      error: (err) => {
        console.error('Error fetching targets:', err);
      }
    });
  }
  

  deleteTarget(targets:any) {
    this.targetService.deleteTarget(targets.target_id).subscribe(() => {
        alert("Target Deleted Successfully. Deleted Target ID is "+ targets.target_id);
        this.getTargetList(); // refresh
    })
  }

  editSystem(target_id: Target) {
    this.router.navigate(['/targets/edit-target', target_id]);

  }
}
