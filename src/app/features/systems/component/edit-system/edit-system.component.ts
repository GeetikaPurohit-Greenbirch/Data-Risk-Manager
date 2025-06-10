import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { SystemServiceService } from '../../services/system-service.service';
import { SystemsModel } from '../../models/systems-model.model';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';

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
   dataFieldsModel : Datafields = new Datafields();
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private systemService: SystemServiceService,
     private datafieldsService: DatafieldsService,
        private cdr: ChangeDetectorRef,
        private toastNotificationService: ToastnotificationService,

  ) {}


  columnDefs:(ColDef | ColGroupDef)[]= [
    { field: 'field_id', headerName: 'Field ID', editable: false, },
    { field: 'field_name', headerName: 'Field Name', editable: true },
    { field: 'data_type', headerName: 'Data Type', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
      },
    },
    { field: 'field_length', headerName: 'Length', editable: true },
    {
      headerName: 'DQA',
      children: [
        {
          headerName: 'C',
          field: 'dqa_c',
          editable: false,
          valueGetter: () => 'L', // Always returns 'L'
          width:65,
          minWidth: 65,
          maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'red',
            fontWeight: 'bold'
          },
        },
        {
          headerName: 'T',
          field: 'dqa_t',
          editable: false,
          valueGetter: () => 'L', // Always returns 'L'
          width:65,
          minWidth: 65,
          maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'blue',
            fontWeight: 'bold'
          }
        },
        {
          headerName: 'A',
          field: 'dqa_a',
          editable: false,
          valueGetter: () => 'L', // Always returns 'L'
          width:65,
          minWidth: 65,
          maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'purple',
            fontWeight: 'bold'
          }
        }
      ],

    },
    { field: 'criticality', headerName: 'Criticality', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["MAJOR", "MINOR", "INSIGNIFICANT", "CRITICAL"]
      },
     },
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
        saveDataFields.className = 'fa fa-save';
        saveDataFields.style.color = 'green';
        saveDataFields.style.border = '1px solid lightGrey';
        saveDataFields.style.borderRadius = '5px';
        saveDataFields.style.lineHeight = '22px';
        saveDataFields.style.height = '32px';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.title = 'Save';
    
        // Pass row data or node to save
        saveDataFields.addEventListener('click', () => {
          this.saveDatafields(params.node);
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
          // this.deleteDAtaFields(params.node);
        });
    
        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);
    
        return div;
      }
    },
  ];

  defaultColDef = {
    flex: 1,
    resizable: true,
    filter:true,
    suppressSizeToFit: true
  };

  rowData: any;

  
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
      this.getDataFields();
  }

  getDataFields()
  { 
    this.datafieldsService.getDataFieldsById(this.systemId, 'SYSTEM').subscribe({
      next: (res: any) => {
        this.rowData = [...res]; // triggers change
        if (this.gridApi) {
          this.gridApi.setRowData([]); // Clear first to ensure refresh
          this.gridApi.setRowData(this.rowData);
        }
  
        this.cdr.detectChanges(); // trigger Angular change detection
        
        error: (err: any) => {
          console.error('Failed to load interface:', err);
        }
      }
         // Force refresh with setRowData
    
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
    console.log(data, "Interface Data Fields");

  // this.dataFieldsModel.field_id = data.childGridData[0].fieldId;
  this.dataFieldsModel.field_name = data.data.field_name;
  this.dataFieldsModel.dqa_c = "L";
  this.dataFieldsModel.dqa_t = "L";
  this.dataFieldsModel.dqa_a = "L";
  this.dataFieldsModel.data_type = data.data.data_type;
  this.dataFieldsModel.field_length = data.data.field_length;
  this.dataFieldsModel.criticality = data.data.criticality;
  this.dataFieldsModel.entity_type = 'SYSTEM';
  this.dataFieldsModel.entity_id = this.systemId;

  this.datafieldsService.createDataFields(this.dataFieldsModel).subscribe(() => {
 
      // alert("Data field added Successfully.");
      if(!data.data.field_id)
      {
        this.toastNotificationService.success("Data field added Successfully.");
      } 
      else
      {
        this.toastNotificationService.success("Data field updated Successfully.");
      }
      setTimeout(() => {
        this.getDataFields(); // refresh

      }, 1000);
    
  })
  }


  deleteDAtaFields(data:any)
  {
    this.datafieldsService.deleteDataFields(data.data.field_id).subscribe(() => {
      // alert("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
      this.toastNotificationService.success("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
      setTimeout(() => {
        this.getDataFields(); // refresh

      }, 1000);
  })
  }
}
