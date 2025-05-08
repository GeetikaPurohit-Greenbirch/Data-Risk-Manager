import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SystemServiceService } from '../services/system-service.service';
import { SystemsModel } from '../models/systems-model.model';
import { MatDialog } from '@angular/material/dialog';
import { EditSystemDialogComponent } from '../edit-system-dialog/edit-system-dialog.component';


@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss']
})
export class SystemsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'systemid', 'name', 'description', 'owner','owner_email' ,'leanixId', 'accuracyRisk', 'timelinessRisk', 'version', 'status', 'actions'];
  dataSource: MatTableDataSource<SystemsModel>;

  // systems : SystemsModel = new SystemsModel();
  systems: SystemsModel[] = []; // ✅ correct


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private systemService: SystemServiceService,
    private dialog: MatDialog

  ) {
    this.dataSource = new MatTableDataSource(this.systems);
  }

  ngOnInit(): void {
    this.getSystemList();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSystemList()
  {
    this.systemService.getSystems().subscribe((data: SystemsModel[]) => {
      this.systems = data;
      this.dataSource.data = this.systems;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    
  }

  deleteSystem(system: SystemsModel) {
    this.systemService.deleteSystem(system.id).subscribe(res => {
        alert("System Deleted Successfully. Deleted System ID is "+ system.id);
        this.getSystemList(); // refresh
    })
  }

  editSystem(system: SystemsModel) {
    const dialogRef = this.dialog.open(EditSystemDialogComponent, {
      width: '1200px',
      data: { ...system } // Pass a copy
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Save updated data to server
        // this.systemService.updateSystem(result).subscribe(() => {
          this.getSystemList(); // refresh
        // });
      }
    });
  }
  
}
