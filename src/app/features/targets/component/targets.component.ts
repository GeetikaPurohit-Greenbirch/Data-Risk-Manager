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

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    
      // Optional: if your table includes objects, set a custom filterPredicate
      this.dataSource.filterPredicate = (data: Target, filter: string) => {
        return (
          data.target_name?.toLowerCase().includes(filter) ||
          data.quality_of_service?.toLowerCase().includes(filter) ||
          String(data.frequency_of_update).includes(filter) ||
          data.schedule_of_update?.includes(filter) ||
          data.methodology_of_transfer?.toLowerCase().includes(filter) ||
          data.target_type?.toLowerCase().includes(filter) ||
          data.target_version_number?.toLowerCase().includes(filter) ||
          data.target_status?.toLowerCase().includes(filter) ||
          data.target_owner?.toLowerCase().includes(filter) ||
          data.target_owner_email?.toLowerCase().includes(filter) ||
          String(data.target_id).includes(filter) 
        );
      };
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
  // Optional: sortingDataAccessor if sorting by number-as-string
                this.dataSource.sortingDataAccessor = (item: Target, property: string) => {
                  switch (property) {
                    case 'targetid': return +item.target_id;
                    case 'name': return item.target_name;
                    case 'servicequality': return item.quality_of_service;
                    case 'frequencyupdate': return item.frequency_of_update;
                    case 'scheduleupdate': return item.schedule_of_update;
                    case 'transfermethodology': return item.methodology_of_transfer;
                    case 'targettype': return item.target_type;
                    case 'targetentity': return item.target_entity;
                    case 'version': return item.target_version_number;
                    case 'status': return item.target_status;
                    case 'owner': return item.target_owner;
                    case 'owner_email': return item.target_owner_email;

                    default: return '';
                  }
                };

                // 👇 Set and trigger default sorting
      this.sort.active = 'targetid';    // matColumnDef name
      this.sort.direction = 'asc';      // or 'desc'
      this.sort.sortChange.emit();      // <- triggers the sort to apply
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

  addTargetScreen()
  {
    this.router.navigate(['/targets/target-builder']);

  }

  editSystem(target_id: Target) {
    this.router.navigate(['/targets/edit-target', target_id]);

  }
}
