import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { ControlService } from '../../services/control.service';

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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private controlService: ControlService
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
         control_type:[''],
         version_number: [''],
         status: [''],
         control_effect: [''],
         control_application: [''],
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
  }

  saveDatafields(data:any)
  {

  }

  deleteDAtaFields(data:any, id:number)
  {

  }
}
