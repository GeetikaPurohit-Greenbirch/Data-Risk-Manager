import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Control } from '../models/control.model';
import { ControlService } from '../services/control.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {
 displayedColumns: string[] = ['controlid', 'name', 'controldesc', 'attachto', 'attachtoid', 'owner', 'owneremail', 'version', 'status', 'applicationdate', 'applicationdatestatus', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Control>();


  // control : SystemsModel = new SystemsModel();
  control: Control[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private controlService: ControlService,
    private router: Router

  ) { }

  

  ngOnInit(): void {
    
    this.getControlList();
  }

  ngAfterViewInit() {
    
  }

  getControlList() {
    this.controlService.getControl().subscribe({
      next: (controls: any[]) => {
        // Map and extract the controlEntity from each item
        const patchedControls = controls.map(data => ({
          ...data.controlEntity
        }));
  
        this.dataSource.data = patchedControls;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        console.log(this.dataSource.data, "Controls");
      },
      error: (err) => {
        console.error('Error fetching controls:', err);
      }
    });
  }
  

  deleteControl(controls:any) {
    this.controlService.deleteControl(controls.control_id).subscribe(() => {
        alert("Control Deleted Successfully. Deleted Control ID is "+ controls.control_id);
        this.getControlList(); // refresh
    })
  }

  editControl(controls:any) {
    this.router.navigate(['/controls/edit-control', controls.control_id]);

  }
}
