import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Interface } from '../models/interface.model';
import { InterfaceService } from '../services/interface.service';
import { Router } from '@angular/router';
import { ToastnotificationService } from '../../shared-services/toastnotification.service';



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
    private router: Router,
    private toastNotificationService: ToastnotificationService,
  ) { }

  

  ngOnInit(): void {
    
    this.getInterfaceList();
  }

  ngAfterViewInit() {
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    // Optional: if your table includes objects, set a custom filterPredicate
    this.dataSource.filterPredicate = (data: Interface, filter: string) => {
      return (
        data.interface_name?.toLowerCase().includes(filter) ||
        data.quality_of_service?.toLowerCase().includes(filter) ||
        data.schedule_of_update?.includes(filter) ||
        data.methodology_of_transfer?.toLowerCase().includes(filter) ||
        data.interface_type?.toLowerCase().includes(filter) ||
        data.interface_version_number?.toLowerCase().includes(filter) ||
        data.interface_status?.toLowerCase().includes(filter) ||
        data.interface_owner?.toLowerCase().includes(filter) ||
        data.interface_owner_email?.toLowerCase().includes(filter) ||
        String(data.id).includes(filter) ||
        String(data.frequency_of_update).includes(filter)
      );
    };
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
         // Optional: sortingDataAccessor if sorting by number-as-string
              this.dataSource.sortingDataAccessor = (item: Interface, property: string) => {
                switch (property) {
                  case 'interfaceid': return +item.interface_id;
                  case 'name': return item.interface_name;
                  case 'servicequality': return item.quality_of_service;
                  case 'frequencyupdate': return item.frequency_of_update;
                  case 'scheduleupdate': return item.schedule_of_update;
                  case 'transfermethodology': return item.methodology_of_transfer;
                  case 'interfacetype': return item.interface_type;
                  case 'version': return item.interface_version_number;
                  case 'status': return item.interface_status;
                  case 'owner': return item.interface_owner;
                  case 'owner_email': return item.interface_owner_email;
                  default: return '';
                }
              };
                    // 👇 Set and trigger default sorting
      this.sort.active = 'interfaceid';    // matColumnDef name
      this.sort.direction = 'asc';      // or 'desc'
      this.sort.sortChange.emit();      // <- triggers the sort to apply
        console.log(this.dataSource.data, "Interfaces");
      },
      error: (err) => {
        console.error('Error fetching interfaces:', err);
      }
    });
  }
  

  deleteInterface(interfaces:any) {
    this.interfaceService.deleteInterface(interfaces.interface_id).subscribe(() => {
        // alert("Interface Deleted Successfully. Deleted Interface ID is "+ interfaces.interface_id);
        this.toastNotificationService.success("Interface Deleted Successfully. Deleted Interface ID is "+ interfaces.interface_id);
        setTimeout(() => {
          this.getInterfaceList(); // refresh
        }, 1000);
    })
  }

  addInterfaceScreen()
  {
    this.router.navigate(['/interfaces/interface-builder']);

  }

  editInterface(interfaces:any) {
    this.router.navigate(['/interfaces/edit-interface', interfaces.interface_id]);

  }
}
