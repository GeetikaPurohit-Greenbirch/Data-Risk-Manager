import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SourceService } from '../services/source.service';
import { Router } from '@angular/router';
import { Sources } from '../models/sources.model';


@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrl: './sources.component.scss'
})
export class SourcesComponent {
displayedColumns: string[] = ['sourceid', 'name', 'servicequality', 'frequencyupdate', 'scheduleupdate', 'transfermethodology', 'sourcetype', 'version', 'status', 'owner', 'owner_email', 'actions'];
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

  editSystem(source_id: Sources) {
    this.router.navigate(['/sources/edit-source', source_id]);

  }
}
