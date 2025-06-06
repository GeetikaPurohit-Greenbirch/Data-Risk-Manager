import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { UsecaseService } from '../../services/usecase.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-edit-usecase',
  // standalone: true,
  // imports: [],
  templateUrl: './edit-usecase.component.html',
  styleUrl: './edit-usecase.component.scss'
})
export class EditUsecaseComponent {
usecaseForm!: FormGroup;
  showDataFields = false;

  // ✅ DataFields table data
  dataFields: any[] = [
    { fieldId: 1, fieldName: 'A', dataType: 'Num' },
    { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  ];

  // ✅ Table column names
  displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  usecaseId!: any;
  gridApi: any;
  gridColumnApi: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private usecaseService: UsecaseService,
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
    console.log('Editing usecase with ID:', this.usecaseId);
    this.usecaseForm = this.fb.group({
      use_case_name: [''],
      use_case_description:[''],
      use_case_owner:[''],
      use_case_owner_email: [''],
      status: [''],
      version: [''],
      last_review_date: [''],
      reviewed_by: [''],
      next_review_date: [''],
      reviewer:[''],
         });
    this.usecaseId = Number(this.route.snapshot.paramMap.get('id'));

      // Step 2: Fetch data from API and patch to form
      this.usecaseService.getUsecaseById(this.usecaseId).subscribe({
        next: (res: any) => {
          const data = res.useCaseEntity;
          this.usecaseForm.patchValue(data);
        },
        error: (err: any) => {
          console.error('Failed to load usecase:', err);
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
    console.log('Form data:', this.usecaseForm.value);
    // Submit or save logic here
    const payload = {
      useCaseEntity: {
        use_case_id : this.usecaseId,
          use_case_name : this.usecaseForm.value.use_case_name,
          use_case_description : this.usecaseForm.value.use_case_description,
          use_case_owner : this.usecaseForm.value.use_case_owner,
          use_case_owner_email : this.usecaseForm.value.use_case_owner_email,
          version : this.usecaseForm.value.version,
          status : this.usecaseForm.value.status,
          last_review_date : this.usecaseForm.value.last_review_date,
          reviewed_by : this.usecaseForm.value.reviewed_by,
          next_review_date : this.usecaseForm.value.next_review_date,
          reviewer : this.usecaseForm.value.reviewer
  
      }
    }
    this.usecaseService.updateInterface(payload).subscribe(res => {
      if(res)
      {
        // alert("Interface Updated Successfully. Your Interface ID is "+ this.interfaceId);
        this.toastNotificationService.success("Interface Updated Successfully. Your Interface ID is "+ this.usecaseId);
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
