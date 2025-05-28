import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Interface } from '../models/interface.model';
import { InterfaceService } from '../services/interface.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-interfaces',
  templateUrl: './interfaces.component.html',
  styleUrl: './interfaces.component.scss'
})
export class InterfacesComponent {
 displayedColumns: string[] = ['interfaceid', 'name', 'servicequality', 'frequencyupdate', 'scheduleupdate', 'transfermethodology', 'interfacetype', 'version', 'status', 'owner', 'owner_email', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Interface>();


  // interface : SystemsModel = new SystemsModel();
  interface: Interface[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private interfaceService: InterfaceService,
    private router: Router

  ) { }

  

  ngOnInit(): void {
    
    this.getInterfaceList();
  }

  ngAfterViewInit() {
    
  }

  getInterfaceList() {
    this.interfaceService.getInterface().subscribe({
      next: (interfaces: any[]) => {
        // Map and extract the interfaceEntity from each item
        const patchedInterfaces = interfaces.map(data => ({
          ...data.interfaceEntity
        }));
  
        this.dataSource.data = patchedInterfaces;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        console.log(this.dataSource.data, "Interfaces");
      },
      error: (err) => {
        console.error('Error fetching interfaces:', err);
      }
    });
  }
  

  deleteInterface(interfaces:any) {
    this.interfaceService.deleteInterface(interfaces.interface_id).subscribe(() => {
        alert("Interface Deleted Successfully. Deleted Interface ID is "+ interfaces.interface_id);
        this.getInterfaceList(); // refresh
    })
  }

  editInterface(interfaces:any) {
    this.router.navigate(['/interfaces/edit-interface', interfaces.interface_id]);

  }
}
