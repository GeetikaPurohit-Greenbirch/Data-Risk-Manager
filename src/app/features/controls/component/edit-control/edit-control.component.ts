import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { ControlService } from '../../services/control.service';
import { SourceService } from 'src/app/features/sources/services/source.service';
import { SystemServiceService } from 'src/app/features/systems/services/system-service.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-edit-control',
  // standalone: true,
  // imports: [],
  templateUrl: './edit-control.component.html',
  styleUrl: './edit-control.component.scss'
})
export class EditControlComponent {
controlForm!: FormGroup;
  showDataFields = false;

  // ✅ DataFields table data
  dataFields: any[] = [
    { fieldId: 1, fieldName: 'A', dataType: 'Num' },
    { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  ];

  // ✅ Table column names
  displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  controlId!: any;
  gridApi: any;
  gridColumnApi: any;
  attachToOptions = ['SYSTEM', 'SOURCE'];
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED','PRODUCTION'];
  applicationStatusOptions= ['TARGET', 'PLANNED', 'COMMITTED', 'DELAYED'];
  filteredAttachToIdOptions: { id: number, name: string }[] = [];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private controlService: ControlService,
        private sourceService: SourceService,
        private systemService: SystemServiceService,
        private toastNotificationService: ToastnotificationService,
  ) {}


  columnDefs: ColDef[]= [
    { field: 'fieldName', headerName: 'Field Name', editable: true },
    { field: 'dataType', headerName: 'Data Type', editable: true },
    { field: 'value', headerName: 'Value', editable: true },
    { field: 'description', headerName: 'Description', editable: true },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 100, 
      flex:1,
      cellRenderer: (params: any) => {
        const value = params.value || '';

        const div = document.createElement('div');
        div.className = 'model-cell-renderer';  
        const buttonar = document.createElement('button');
        buttonar.className = 'fa fa-trash';
        // buttonar.style.marginRight = '5px';
        buttonar.style.border = '1px solid lightGrey';
        buttonar.style.borderRadius = '5px';
        buttonar.style.lineHeight = '22px';
        buttonar.style.height = '32px';
        buttonar.innerHTML = '';
        buttonar.addEventListener('click', () => {
          this.onDeleteRecord();
        });

        // div.appendChild(buttonwip);
        div.appendChild(buttonar);

        return div;
      }
    },
  ];

  defaultColDef = {
    flex: 1,
    resizable: true,
    filter:true,
  };

  rowData = [
    { fieldName: 'Name', dataType: 'String', value: 'John Doe', description: 'User full name' },
    { fieldName: 'Age', dataType: 'Number', value: 30, description: 'User age' }
  ];

  
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  addRow() {
    const newItem = { fieldName: '', dataType: '', value: '', description: '' };
    this.rowData = [...this.rowData, newItem];
  }

  onRowValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  onDeleteRecord()
  {

  }

 
  ngOnInit(): void {
    console.log('Editing control with ID:', this.controlId);
    this.controlForm = this.fb.group({
        control_name: [''],
         control_description:[''],
         attach_to:[''],
         attach_to_id:[''],
         control_owner:[''],
         control_owner_email:[''],
         version_number: [''],
         status: [''],
         application_date: [''],
         application_date_status: [''],
         });
    this.controlId = Number(this.route.snapshot.paramMap.get('id'));

      // Step 2: Fetch data from API and patch to form
      this.controlService.getControlById(this.controlId).subscribe({
        next: (res: any) => {
          const data = res.controlEntity;
          this.controlForm.patchValue(data);
        },
        error: (err: any) => {
          console.error('Failed to load control:', err);
        }
      });
    
  }


  onChange(attachTo: string): void
  {
    this.filteredAttachToIdOptions = []; // Clear previous list
  this.controlForm.get('attachToId')?.setValue(null); // Reset selection

  if (attachTo === 'SOURCE') {
    this.sourceService.getSources().subscribe(data =>{
      this.filteredAttachToIdOptions = data.map(item => ({
        id: item.sourceEntity.source_id,
        name: item.sourceEntity.source_name
      }));
    });
  } else if (attachTo === 'SYSTEM') {
    this.systemService.getSystems().subscribe((data) => {
      this.filteredAttachToIdOptions = data.map(item => ({
         id: item.systemEntity.system_id,
        name: item.systemEntity.system_name
      }));
    });
  }
  }

  // Handle changes in cell values
  onCellValueChanged(event: any): void {
    console.log('Cell Value Changed:', event);
  }


  // ✅ Add a new DataField row
  addField(): void {
    const newId = this.dataFields.length + 1;
    const newField = {
      fieldId: newId,
      fieldName: '',
      dataType: ''
    };
    this.dataFields = [...this.dataFields, newField]; // Reassign array
  }

  // ✅ Trigger update/save logic
  onUpdate(): void {
    console.log('Form data:', this.controlForm.value);
    // Submit or save logic here
    const payload = {
      controlEntity: {
   
    
          control_id: this.controlId,
          control_name:this.controlForm.value.controlName, 
          control_description:this.controlForm.value.controlDescription,
          attach_to:this.controlForm.value.attachto,
          attach_to_id:this.controlForm.value.attachToId,
          control_owner:this.controlForm.value.owner,
          control_owner_email:this.controlForm.value.ownerEmail,
          version_number : this.controlForm.value.version,
          status : this.controlForm.value.status,
          application_date:this.controlForm.value.applicationDate,
          application_date_status:this.controlForm.value.applicationStatus,
            
      }
    }
    this.controlService.updateControl(payload).subscribe(res => {
      if(res)
      {
        // alert("Control Updated Successfully. Your Control ID is "+ this.targetId);
        this.toastNotificationService.success("Control Updated Successfully. Your Control ID is "+ this.controlId);
        // window.location.reload();
      }
    })
  }

  saveDatafields(data:any)
  {

  }

  deleteDAtaFields(data:any, id:number)
  {

  }
}
