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
dataLength = 0;
pageSizeOptions = [5, 10, 50];

ngAfterViewInit() {
  // this.dataLength = this.dataSource.data.length;
  // if (!this.pageSizeOptions.includes(this.dataLength)) {
  //   this.pageSizeOptions.push(this.dataLength); // for 'All'
  // }
}

  constructor(private controlService: ControlService,
    private router: Router

  ) { }

  

  ngOnInit(): void {
    
    this.getControlList();
  }


  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      
    
      // Optional: if your table includes objects, set a custom filterPredicate
      this.dataSource.filterPredicate = (data: Control, filter: string) => {
        const lowerFilter = filter.trim().toLowerCase();

        const formatDate = (date: any): string => {
          return date
            ? new Date(date).toLocaleDateString('en-CA') // yyyy-mm-dd
            : '';
        };

        const formattedApplicationDate = formatDate(data.application_date);

        return (
          data.control_name?.toLowerCase().includes(filter) ||
          data.control_description?.toLowerCase().includes(filter) ||
          data.attach_to?.toLowerCase().includes(filter) ||
          String(data.attach_to_id).includes(filter) ||
          data.control_owner?.toLowerCase().includes(filter) ||
          data.control_owner_email?.toLowerCase().includes(filter) ||
          data.version_number?.toLowerCase().includes(filter) ||
          data.status?.toLowerCase().includes(filter) ||          
          formattedApplicationDate.includes(lowerFilter) ||
          data.application_date_status?.toLowerCase().includes(filter) ||
          String(data.control_id).includes(filter) 
        );
      };
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

        this.dataLength = this.dataSource.data.length;
        if (!this.pageSizeOptions.includes(this.dataLength)) {
          this.pageSizeOptions.push(this.dataLength); // for 'All'
        }
  // Optional: sortingDataAccessor if sorting by number-as-string

                this.dataSource.sortingDataAccessor = (item: Control, property: string) => {
                  switch (property) {
                    case 'controlid': return +item.control_id;
                    case 'name': return item.control_name;
                    case 'controldesc': return item.control_description;
                    case 'attachto': return item.attach_to;
                    case 'attachtoid': return item.attach_to_id;
                    case 'owner': return item.control_owner;
                    case 'owneremail': return item.control_owner_email;
                    case 'version': return item.version_number;
                    case 'status': return item.status;
                    case 'applicationdate': return item.application_date ? new Date(item.application_date).getTime() : 0;
                    case 'applicationdatestatus': return item.application_date_status;
                    default: return '';
                  }
                };
  
  // 👇 Set and trigger default sorting
  this.sort.active = 'controlid';    // matColumnDef name
  this.sort.direction = 'asc';      // or 'desc'
  this.sort.sortChange.emit();      // <- triggers the sort to apply
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

  addControlScreen()
  {
    this.router.navigate(['/controls/control-builder']);

  }

  editControl(controls:any) {
    this.router.navigate(['/controls/edit-control', controls.control_id]);

  }
}
