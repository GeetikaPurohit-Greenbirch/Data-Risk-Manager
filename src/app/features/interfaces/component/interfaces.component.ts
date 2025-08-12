import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Interface } from '../models/interface.model';
import { InterfaceService } from '../services/interface.service';
import { Router } from '@angular/router';
import { ToastnotificationService } from '../../shared-services/toastnotification.service';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';



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
  gridApi: any;
  gridColumnApi: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 5;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];

  constructor(private interfaceService: InterfaceService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
  ) { }

  
 columnDefs: (ColDef | ColGroupDef)[]= [
    { field: 'interface_id', headerName: 'Interface ID', editable: false, },
    { field: 'interface_name', headerName: 'Name', editable: true },
    { field: 'quality_of_service', headerName: 'Quality Of Service', editable: true },
    { field: 'frequency_of_update', headerName: 'Frequency Of Update', editable: true },
    { field: 'schedule_of_update', headerName: 'Schedule Of Update', editable: true },
    { field: 'methodology_of_transfer', headerName: 'Methodology Of Transfer', editable: true },
    { field: 'interface_type', headerName: 'Interface Type', editable: true },
    { field: 'interface_version_number', headerName: 'Version', editable: true },
    { field: 'interface_status', headerName: 'Status', editable: true },
    { field: 'interface_owner', headerName: 'Owner', editable: true },
    { field: 'interface_owner_email', headerName: 'Owner Email', editable: true },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 100, 
      flex:1,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        const saveDataFields = document.createElement('button');
        saveDataFields.className = 'fa fa-edit';
        saveDataFields.style.color = 'green';
        saveDataFields.style.border = '1px solid lightGrey';
        saveDataFields.style.borderRadius = '5px';
        saveDataFields.style.lineHeight = '22px';
        saveDataFields.style.height = '32px';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.title = 'Save';
    
        // Pass row data or node to save
        saveDataFields.addEventListener('click', () => {
          this.editInterface(params.node);
        });
    
        const deleteDataFields = document.createElement('button');
        deleteDataFields.className = 'fa fa-trash';
        deleteDataFields.style.color = 'red';
        deleteDataFields.style.border = '1px solid lightGrey';
        deleteDataFields.style.borderRadius = '5px';
        deleteDataFields.style.lineHeight = '22px';
        deleteDataFields.style.height = '32px';
        deleteDataFields.style.cursor = 'pointer';
        deleteDataFields.title = 'Delete';
    
        deleteDataFields.addEventListener('click', () => {
          this.deleteInterface(params.node);
        });
    
        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);
    
        return div;
      }
    },
  ];

  defaultColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    filter:true,
    suppressSizeToFit: true
  };

  

  // rowData = [
  //   { fieldId: '1', fieldName: 'Name', dataType: 'String', fieldLength: '50',  dqaC: 'L',
  //     dqaT: 'L',
  //     dqaA: 'L', criticality: 'HIGH' },
  // ];

  
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.getInterfaceList();
  }


  onCellValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  ngOnInit(): void {
    
    this.getInterfaceList();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.patchAllLabel();
    }, 0);
  }
  patchAllLabel() {
    setTimeout(() => {
      const options = document.querySelectorAll('mat-option span.mdc-list-item__primary-text');
      options.forEach((opt: any) => {
        if (opt.textContent?.trim() === String(this.rowData.length)) {
          opt.textContent = 'All';
        }
      });
    }, 100);
  }

  onPageChange(event: any) {
    if (event.pageSize === this.rowData.length || event.pageSize === 'All') {
      this.pageSize = this.rowData.length;
    } else {
      this.pageSize = event.pageSize;
    }
  }


  getInterfaceList() {
    this.interfaceService.getInterface().subscribe({
      next: (interfaces: any[]) => {
        // Map and extract the interfaceEntity from each item
        const patchedInterfaces = interfaces.map(data => ({
          ...data.interfaceEntity
        }));
  
        this.rowData = patchedInterfaces;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching interfaces:', err);
      }
    });
  }
  

  deleteInterface(interfaces:any) {
    this.interfaceService.deleteInterface(interfaces.data.interface_id).subscribe(() => {
        // alert("Interface Deleted Successfully. Deleted Interface ID is "+ interfaces.interface_id);
        this.toastNotificationService.error("Interface Deleted Successfully. Deleted Interface ID is "+ interfaces.data.interface_id);
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
    this.router.navigate(['/interfaces/edit-interface', interfaces.data.interface_id]);

  }
}
