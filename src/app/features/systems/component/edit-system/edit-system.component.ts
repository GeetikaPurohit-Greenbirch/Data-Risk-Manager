import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { SystemServiceService } from '../../services/system-service.service';
import { SystemsModel } from '../../models/systems-model.model';

ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-edit-system',
  // standalone: true,
  // imports: [],
  templateUrl: './edit-system.component.html',
  styleUrl: './edit-system.component.scss'
})
export class EditSystemComponent {
 systemForm!: FormGroup;
  showDataFields = false;
  systemModel : SystemsModel = new SystemsModel();

  // ✅ DataFields table data
  dataFields: any[] = [
    { fieldId: 1, fieldName: 'A', dataType: 'Num' },
    { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  ];

  // ✅ Table column names
  displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  systemId!: any;
  gridApi: any;
  gridColumnApi: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private systemService: SystemServiceService
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
    console.log('Editing system with ID:', this.systemId);
    this.systemForm = this.fb.group({
      system_name: [''],
      leanix_id: [''],
      description: [''],
      owner: [''],
      owner_email: [''],
      version_number: [''],
      status: [''],
    
      // add other form controls as needed
    });
    this.systemId = Number(this.route.snapshot.paramMap.get('id'));

      // Step 2: Fetch data from API and patch to form
      this.systemService.getSystemById(this.systemId).subscribe({
        next: (res: any) => {
          const data = res.systemEntity;
          this.systemForm.patchValue(data);
        },
        error: (err: any) => {
          console.error('Failed to load system:', err);
        }
      });
    
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
    console.log('Form data:', this.systemForm.value);
    const payload = {
      systemEntity: {
    // this.systemModel.system_id = this.systemForm.value.systemId;
    system_id: this.systemId,
   system_name : this.systemForm.value.system_name,
    leanix_id : this.systemForm.value.leanix_id,
    description : this.systemForm.value.description,
    owner : this.systemForm.value.owner,
    owner_email : this.systemForm.value.owner_email,
    version_number : this.systemForm.value.version_number,
    status : this.systemForm.value.status,
    // this.systemModel.accuracy_risk = this.systemForm.value.accuracyRisk;
    // this.systemModel.timeliness_risk = this.systemForm.value.timlinessRisk;
      }
    }
    this.systemService.updateSystem(payload).subscribe(res => {
      if(res)
      {
        alert("System Updated Successfully. Your System ID is "+ this.systemId);
        window.location.reload();
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
