import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SourceService } from '../services/source.service';
import { Router } from '@angular/router';
import { SourceEntity, Sources } from '../models/sources.model';


@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrl: './sources.component.scss'
})
export class SourcesComponent {
displayedColumns: string[] = ['sourceid', 'name', 'vendor', 'servicequality', 'frequencyupdate', 'scheduleupdate', 'transfermethodology', 'sourcetype', 'version', 'status', 'owner', 'owner_email', 'actions'];
  public rowData: any;
  dataSource = new MatTableDataSource<Sources>();


  // source : SystemsModel = new SystemsModel();
  source: Sources[] = []; // ✅ correct

  useThreeColumn: boolean = true; // Toggle for layout

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private sourceService: SourceService,
    private router: Router

  ) { }

  

  ngOnInit(): void {
    
    this.getSourceList();
  }

  ngAfterViewInit() {
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    // Optional: if your table includes objects, set a custom filterPredicate
    this.dataSource.filterPredicate = (data: Sources, filter: string) => {
      return (
        data.source_name?.toLowerCase().includes(filter) ||
        data.quality_of_service?.toLowerCase().includes(filter) ||
        String(data.frequency_of_update).includes(filter) ||
        data.schedule_of_update?.includes(filter) ||
        data.methodology_of_transfer?.toLowerCase().includes(filter) ||
        data.source_type?.toLowerCase().includes(filter) ||
        data.source_version_number?.toLowerCase().includes(filter) ||
        data.source_status?.toLowerCase().includes(filter) ||
        data.source_owner?.toLowerCase().includes(filter) ||
        data.source_owner_email?.toLowerCase().includes(filter) ||
        String(data.source_id).includes(filter) 
      );
    };
  }

  getSourceList() {
    this.sourceService.getSources().subscribe({
      next: (sources: any[]) => {
        // Map and extract the sourceEntity from each item
        const patchedSources = sources.map(data => ({
          ...data.sourceEntity
        }));
  
        this.dataSource.data = patchedSources;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
          // Optional: sortingDataAccessor if sorting by number-as-string
              this.dataSource.sortingDataAccessor = (item: Sources, property: string) => {
                switch (property) {
                  case 'sourceid': return +item.source_id;
                  case 'name': return item.source_name;
                  case 'servicequality': return item.quality_of_service;
                  case 'frequencyupdate': return item.frequency_of_update;
                  case 'scheduleupdate': return item.schedule_of_update;
                  case 'transfermethodology': return item.methodology_of_transfer;
                  case 'sourcetype': return item.source_type;
                  case 'version': return item.source_version_number;
                  case 'status': return item.source_status;
                  case 'owner': return item.source_owner;
                  case 'owner_email': return item.source_owner_email;
                  default: return '';
                }
              };

// 👇 Set and trigger default sorting
this.sort.active = 'sourceid';    // matColumnDef name
this.sort.direction = 'asc';      // or 'desc'
this.sort.sortChange.emit();      // <- triggers the sort to apply
        console.log(this.dataSource.data, "Sources");
      },
      error: (err) => {
        console.error('Error fetching sources:', err);
      }
    });
  }
  

  deleteSource(sources:any) {
    this.sourceService.deleteSource(sources.source_id).subscribe(() => {
        alert("Source Deleted Successfully. Deleted Source ID is "+ sources.source_id);
        this.getSourceList(); // refresh
    })
  }

  addSourceScreen()
  {
    this.router.navigate(['sources/source-builder']);
  }

  editSystem(source_id: Sources) {
    this.router.navigate(['/sources/edit-source', source_id]);

  }
}
