import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InterfaceService } from '../../services/interface.service';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { MatSelectChange } from '@angular/material/select';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-edit-interface',
  templateUrl: './edit-interface.component.html',
  styleUrls: ['./edit-interface.component.scss']
})
export class EditInterfaceComponent implements OnInit {
  interfaceForm!: FormGroup;
  showDataFields = true;
  showDataQuality = false;
  showDataFieldsTable = true;
  statusOptions: string[] = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
  serviceQualityOptions: string[] = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  timeOptions: string[] = ["00:00:00", "02:00:00", "04:00:00", "06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];

  // ✅ DataFields table data
  dataFields: any[] = [
    { fieldId: 1, fieldName: 'A', dataType: 'Num' },
    { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  ];

  // ✅ Table column names
  displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  interfaceId!: any;
  gridApi: any;
  gridColumnApi: any;
  activeView!: string; // default view on load
  frequencyLimit = 1;
  scheduleLimitReached = false;

  // rowData: any;
  dataFieldsModel : Datafields = new Datafields();
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastNotificationService: ToastnotificationService,
    private interfaceService: InterfaceService,
    private datafieldsService: DatafieldsService,
    private cdr: ChangeDetectorRef
  ) {}


  columnDefs: (ColDef | ColGroupDef)[]= [
    { field: 'field_id', headerName: 'Field ID', editable: false, },
    { field: 'field_name', headerName: 'Field Name', editable: true },
    { field: 'data_type', headerName: 'Data Type', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
      },
    },
    { field: 'field_length', headerName: 'Length', editable: true },
    // {
    //   headerName: 'DQA',
    //   children: [
    //     {
    //       headerName: 'C',
    //       field: 'dqa_c',
    //       editable: false,
    //       // valueGetter: () => 'L', // Always returns 'L'
    //       width:65,
    //       minWidth: 65,
    //       maxWidth: 65,
    //       resizable: true,
    //       suppressSizeToFit: true,
    //       cellStyle: {
    //         color: 'red',
    //         fontWeight: 'bold'
    //       },
    //     },
    //     {
    //       headerName: 'C Commentary',
    //       field: 'commentary_c',
    //       editable: false,
    //       width:100,
    //       minWidth: 100,
    //       maxWidth: 100,
    //       resizable: true,
    //       suppressSizeToFit: true,
         
    //     },
    //     {
    //       headerName: 'T',
    //       field: 'dqa_t',
    //       editable: false,
    //       // valueGetter: () => 'L', // Always returns 'L'
    //       width:65,
    //       minWidth: 65,
    //       maxWidth: 65,
    //       resizable: true,
    //       suppressSizeToFit: true,
    //       cellStyle: {
    //         color: 'blue',
    //         fontWeight: 'bold'
    //       }
    //     },
    //     {
    //       headerName: 'T Commentary',
    //       field: 'commentary_t',
    //       editable: false,
    //       width:100,
    //       minWidth: 100,
    //       maxWidth: 100,
    //       resizable: true,
    //       suppressSizeToFit: true,
         
    //     },
    //     {
    //       headerName: 'A',
    //       field: 'dqa_a',
    //       editable: false,
    //       // valueGetter: () => 'L', // Always returns 'L'
    //       width:65,
    //       minWidth: 65,
    //       maxWidth: 65,
    //       resizable: true,
    //       suppressSizeToFit: true,
    //       cellStyle: {
    //         color: 'purple',
    //         fontWeight: 'bold'
    //       }
    //     },
    //     {
    //       headerName: 'A Commentary',
    //       field: 'commentary_a',
    //       editable: false,
    //       width:100,
    //       minWidth: 100,
    //       maxWidth: 100,
    //       resizable: true,
    //       suppressSizeToFit: true,
         
    //     },
    //   ],

    // },
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
          this.deleteDAtaFields(params.node);
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

  // rowData = [
  //   { fieldId: '1', fieldName: 'Name', dataType: 'String', fieldLength: '50',  dqaC: 'L',
  //     dqaT: 'L',
  //     dqaA: 'L', criticality: 'HIGH' },
  // ];

  
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.getDataFields();
  }

  addRow() {
    const newItem = {fieldId: '', fieldName: '', dataType: '', fieldLength: '', dqaC: '', dqaT: '', dqaA:'',  criticality: '' };
    this.rowData = [...this.rowData, newItem];
  }

  onRowValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  ngOnInit(): void {
    console.log('Editing interface with ID:', this.interfaceId);
    this.interfaceForm = this.fb.group({
      interface_name: [''],
      quality_of_service: [''],
      frequency_of_update: [''],
      schedule_of_update: [''],
      methodology_of_transfer: [''],
      interface_type: [''],
      interface_version_number: [''],
      interface_status: [''],
      interface_owner: [''],
      interface_owner_email: [''],
      // add other form controls as needed
    });
    this.interfaceId = Number(this.route.snapshot.paramMap.get('id'));

      // Step 2: Fetch data from API and patch to form
      this.interfaceService.getInterfaceById(this.interfaceId).subscribe({
        next: (res: any) => {
          const data = res.interfaceEntity;
          this.interfaceForm.patchValue(data);
        },
        error: (err: any) => {
          console.error('Failed to load interface:', err);
        }
      });
      // this.generateTimeOptions();

      // Fetch data from API and patch to form
  this.interfaceService.getInterfaceById(this.interfaceId).subscribe({
    next: (res: any) => {
      const data = res.interfaceEntity;
      this.interfaceForm.patchValue(data);

      // Apply disable logic immediately after patch
      this.toggleFieldsBasedOnQoS(data.quality_of_service);
    },
    error: (err: any) => {
      console.error('Failed to load interface:', err);
    }
  });

  // Watch for changes in quality_of_service
  this.interfaceForm.get('quality_of_service')?.valueChanges.subscribe(value => {
    this.toggleFieldsBasedOnQoS(value);
  });



      this.getDataFields();

      
  }

  onFrequencyChange(): void {
    const freq = +this.interfaceForm.get('frequency_of_update')?.value || 1;
    this.frequencyLimit = freq;

    const currentSelection = this.interfaceForm.get('schedule_of_update')?.value || [];
    if (currentSelection.length > freq) {
      this.interfaceForm.get('schedule_of_update')?.setValue(currentSelection.slice(0, freq));
    }
  }
  
    onScheduleSelectionChange(event: MatSelectChange): void {
      const selected = event.value || [];
      if (selected.length > this.frequencyLimit) {
        this.scheduleLimitReached = true;
        // Keep only allowed number of selections
        this.interfaceForm.get('schedule_of_update')?.setValue(selected.slice(0, this.frequencyLimit));
      } else {
        this.scheduleLimitReached = false;
      }
    }

  private toggleFieldsBasedOnQoS(value: string): void {
    if (value === 'STREAMING' || value === 'AD_HOC') {
      this.interfaceForm.get('frequency_of_update')?.disable({ emitEvent: false });
      this.interfaceForm.get('schedule_of_update')?.disable({ emitEvent: false });
    } else {
      this.interfaceForm.get('frequency_of_update')?.enable({ emitEvent: false });
      this.interfaceForm.get('schedule_of_update')?.enable({ emitEvent: false });
    }
  }

  getDataFields()
  { 
    this.datafieldsService.getDataFieldsById(this.interfaceId, 'INTERFACE').subscribe({
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

  addDatafields(view:string)
  {
    this.activeView = view;
    this.showDataFieldsTable = true;
    this.showDataFields = true;
    this.showDataQuality = false;
  }

  showDQA(view:string)
  {
    this.activeView = view;
    this.showDataFieldsTable = true;
    this.showDataFields = false;
    this.showDataQuality = true;
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
    console.log('Form data:', this.interfaceForm.value);

    // Extract form values
  const formValues = this.interfaceForm.value;

  // If QoS is STREAMING or AD_HOC, nullify these fields
  const isStreamingOrAdHoc = formValues.quality_of_service === 'STREAMING' || formValues.quality_of_service === 'AD_HOC';

    // Submit or save logic here
    const payload = {
      interfaceEntity: {
    // this.interfaceModel.interface_id = this.interfaceForm.value.interfaceId;
    interface_id: this.interfaceId,
    interface_name : this.interfaceForm.value.interface_name,
    quality_of_service : this.interfaceForm.value.quality_of_service,
    frequency_of_update: isStreamingOrAdHoc ? null : formValues.frequency_of_update,
      schedule_of_update: isStreamingOrAdHoc ? null : formValues.schedule_of_update,
    methodology_of_transfer:this.interfaceForm.value.methodology_of_transfer,
    interface_type:this.interfaceForm.value.interface_type,
    interface_version_number : this.interfaceForm.value.interface_version_number,
    interface_status : this.interfaceForm.value.interface_status,
    interface_owner: this.interfaceForm.value.interface_owner,
    interface_owner_email: this.interfaceForm.value.interface_owner_email
      }
    }
    this.interfaceService.updateInterface(payload).subscribe(res => {
      if(res)
      {
        // alert("Interface Updated Successfully. Your Interface ID is "+ this.interfaceId);
        this.toastNotificationService.success("Interface Updated Successfully. Your Interface ID is "+ this.interfaceId);
        // window.location.reload();
      }
    })
  }

  saveDatafields(data:any)
  {
    console.log(data, "Interface Data Fields");

    this.dataFieldsModel.field_id = data.data.field_id;
  this.dataFieldsModel.field_name = data.data.field_name;
  this.dataFieldsModel.dqa_c = "L";
  this.dataFieldsModel.dqa_t = "L";
  this.dataFieldsModel.dqa_a = "L";
  this.dataFieldsModel.commentary_a = data.data.commentary_a;
  this.dataFieldsModel.commentary_t = data.data.commentary_t;
  this.dataFieldsModel.commentary_c = data.data.commentary_c;
  this.dataFieldsModel.data_type = data.data.data_type;
  this.dataFieldsModel.field_length = data.data.field_length;
  this.dataFieldsModel.criticality = data.data.criticality;
  this.dataFieldsModel.entity_type = 'INTERFACE';
  this.dataFieldsModel.entity_id = this.interfaceId;

  if(!data.data.field_id)
    {
      this.datafieldsService.createDataFields(this.dataFieldsModel).subscribe(() => {

      this.toastNotificationService.success("Data field added Successfully.");
      setTimeout(() => {
        this.getDataFields(); // refresh

      }, 1000);
    });
  }
    else
    {
      this.datafieldsService.updateInterface(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Data field updated Successfully.");
        setTimeout(() => {
          this.getDataFields(); // refresh
  
        }, 1000);
      });
    }
   
  }


  deleteDAtaFields(data:any)
  {
    this.datafieldsService.deleteDataFields(data.data.field_id).subscribe(() => {
      // alert("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
      this.toastNotificationService.error("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
      setTimeout(() => {
        this.getDataFields(); // refresh

      }, 1000);
  })
  }
}
