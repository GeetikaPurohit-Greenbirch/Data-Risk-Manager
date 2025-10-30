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
import { createElement, icons } from 'lucide';



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
  pageSize = 20;
  data: any[] = []; // example
  // pageSizeOptions = [this.systems.length, 5, 10, 50]; // 'All' will be replaced visually
  pageSizeOptions: number[] = [];

  constructor(private interfaceService: InterfaceService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
  ) { }

  
 columnDefs: (ColDef | ColGroupDef)[]= [
    { field: 'interface_id', headerName: 'Interface ID', editable: false, },
    { field: 'interface_name', headerName: 'Name', editable: false },
    { field: 'quality_of_service', headerName: 'Quality Of Service', editable: false },
    { field: 'frequency_of_update', headerName: 'Frequency Of Update', editable: false },
    { field: 'schedule_of_update', headerName: 'Schedule Of Update', editable: false },
    { field: 'methodology_of_transfer', headerName: 'Methodology Of Transfer', editable: false },
    { field: 'interface_type', headerName: 'Interface Type', editable: false },
    { field: 'interface_version_number', headerName: 'Version', editable: false },
    { field: 'interface_status', headerName: 'Status', editable: false },
    { field: 'interface_owner', headerName: 'Owner', editable: false },
    { field: 'interface_owner_email', headerName: 'Owner Email', editable: false },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 100, 
      flex:1,
      pinned:"right",
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        const saveDataFields = document.createElement('button');
        saveDataFields.title = 'Edit';
        saveDataFields.style.padding = '0px';
        saveDataFields.style.border = 'none';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.style.background = 'transparent';

        const editIcon = createElement(icons.Pencil, {
          color: '#098236',
          height: '14px',
          strokeWidth: 2
        });
        saveDataFields.appendChild(editIcon);
    
        // Pass row data or node to save
        saveDataFields.addEventListener('click', () => {
          this.editInterface(params.node);
        });
    
        const deleteDataFields = document.createElement('button');
        deleteDataFields.title = 'Delete';
        deleteDataFields.style.border = 'none';
        deleteDataFields.style.padding = '0px';
        deleteDataFields.style.cursor = 'pointer';
        deleteDataFields.style.background = 'transparent';

        const deleteIcon = createElement(icons.Trash2, {
          color: '#c10007',
          height: '14px',
          strokeWidth: 2
        });
        deleteDataFields.appendChild(deleteIcon);
        deleteDataFields.addEventListener('click', () => {
          this.deleteInterface(params.node);
        });

        // 🧬 Clone Button
        const cloneDataFields = document.createElement('button');
        cloneDataFields.title = 'Copy';
        cloneDataFields.style.border = 'none';
        cloneDataFields.style.padding = '0px';
        cloneDataFields.style.cursor = 'pointer';
        cloneDataFields.style.background = 'transparent';

        const cloneBtn = createElement(icons.Copy, {
          color: '#3e63dd',
          height: '14px',
          strokeWidth: 2
        });
        cloneDataFields.appendChild(cloneBtn);
        cloneDataFields.addEventListener('click', () => {
          this.cloneInterface(params.node.data);
        });
    
        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);
        div.appendChild(cloneDataFields);

        return div;
      }
    },
  ];
 
  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    suppressSizeToFit: true
  }; 
  
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

  cloneInterface(interfaceData: Interface) {
    // Remove unique IDs (if any) and flag it as cloned
    const clonedData = { ...interfaceData };
  
    // Optional: mark this as a clone for validation later
    clonedData.isClone = true;
  
    // Navigate to Interface Builder with prefilled data
    this.router.navigate(['/interfaces/interface-builder'], {
      state: { clonedInterface: clonedData }
    });
  }
  
}
