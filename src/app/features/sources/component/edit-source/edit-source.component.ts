import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { SourceService } from '../../services/source.service';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { MatSelectChange } from '@angular/material/select';


ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-edit-source',
  // standalone: true,
  // imports: [],
  templateUrl: './edit-source.component.html',
  styleUrl: './edit-source.component.scss'
})
export class EditSourceComponent implements OnInit {
 sourceForm!: FormGroup;
   showDataFields = true;
   showDataQuality = false;
   showDataFieldsTable = true;
   statusOptions: string[] = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
   serviceQualityOptions: string[] = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  sourceTypeOptions: string[] = [ 'SYSTEM', 'MANUAL_ENTRY' ]
   timeOptions: string[] = ["00:00:00", "02:00:00", "04:00:00", "06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];
   frequencyLimit = 1;
   scheduleLimitReached = false;
   formLoaded = false;
 
   // ✅ DataFields table data
   dataFields: any[] = [
     { fieldId: 1, fieldName: 'A', dataType: 'Num' },
     { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
   ];
 
   // ✅ Table column names
   displayedColumns: string[] = ['fieldId', 'fieldName', 'fieldDesc' , 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
   sourceId!: any;
   gridApi: any;
   gridColumnApi: any;
   // rowData: any;
   dataFieldsModel : Datafields = new Datafields();
   activeView!: string; // default view on load
   showGlobalQualityRisk=false;

   constructor(
     private route: ActivatedRoute,
     private fb: FormBuilder,
     private toastNotificationService: ToastnotificationService,
     private sourceService: SourceService,
     private datafieldsService: DatafieldsService,
     private cdr: ChangeDetectorRef
   ) {}

   columnDefsDQA:(ColDef | ColGroupDef)[]= [
    {
      headerName: 'DQA',
      headerClass: 'custom-parent-header',
      resizable: true,
      children: [
        {
          headerName: 'C= Completeness',
          field: 'default_dqa_c',
          editable: true,
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"]
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'red',
            fontWeight: 'bold'
          },
        },
        {
          headerName: 'C Commentary',
          field: 'default_commentary_c',
          editable: true,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'T= Timeliness',
          field: 'default_dqa_t',
          editable: true,
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: false,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'blue',
            fontWeight: 'bold'
          }
        },
        {
          headerName: 'T Commentary',
          field: 'default_commentary_t',
          editable: true,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'A= Accuracy',
          field: 'default_dqa_a',
          editable: true,
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'purple',
            fontWeight: 'bold'
          }
        },
        {
          headerName: 'A Commentary',
          field: 'default_commentary_a',
          editable: true,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
      ],


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
          this.saveDatafieldsDQA(params.node, 'OUTBOUND');
        });
    
      
        div.appendChild(saveDataFields);
    
        return div;
      }
    },
  ]
 
 
   columnDefs: (ColDef | ColGroupDef)[]= [
     { field: 'field_id', headerName: 'Field ID', editable: false, },
     { field: 'field_name', headerName: 'Field Name', editable: true },
     { field: 'field_description', headerName: 'Field Description', editable: true },
     { field: 'data_type', headerName: 'Data Type', editable: true,
       cellEditor: 'agSelectCellEditor',
       cellEditorParams: {
         values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
       },
     },
     { field: 'field_length', headerName: 'Length', editable: true },
     {
       headerName: 'DQA',
       resizable: true,
       children: [
         {
           headerName: 'C= Completeness',
           field: 'dqa_c',
           editable: true,
          //  valueGetter: () => 'L', // Always returns 'L'
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ["H", "M", "L"]
          },
          //  width:65,
          //  minWidth: 65,
          //  maxWidth: 65,
           resizable: true,
           suppressSizeToFit: true,
           cellStyle: {
             color: 'red',
             fontWeight: 'bold'
           },
         },
         {
          headerName: 'C Commentary',
          field: 'commentary_c',
          editable: true,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'T= Timeliness',
          field: 'dqa_t',
          editable: true,
          // valueGetter: () => 'L', // Always returns 'L'
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ["H", "M", "L"]
          },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'blue',
            fontWeight: 'bold'
          }
        },
        {
          headerName: 'T Commentary',
          field: 'commentary_t',
          editable: true,
          width:100,
          minWidth: 100,
          maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'A= Accuracy',
          field: 'dqa_a',
          editable: true,
          // valueGetter: () => 'L', // Always returns 'L'
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ["H", "M", "L"]
          },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'purple',
            fontWeight: 'bold'
          }
        },
        {
          headerName: 'A Commentary',
          field: 'commentary_a',
          editable: true,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
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
   rowDataDQA: any;
 
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
     const newItem = {fieldId: '', fieldName: '', fieldDesc:'', dataType: '', fieldLength: '', dqaC: '', dqaT: '', dqaA:'',  criticality: '' };
     this.rowData = [...this.rowData, newItem];
   }
 
   onRowValueChanged(event: any) {
     console.log('Updated row:', event.data);
   }
 
   ngOnInit(): void {
     console.log('Editing source with ID:', this.sourceId);
     this.sourceForm = this.fb.group({
       source_name: [''],
       vendor: [''],
       quality_of_service: [''],
       frequency_of_update: [''],
       schedule_of_update: [''],
       methodology_of_transfer: [''],
       source_type: [''],
       source_version_number: [''],
       source_status: [''],
       source_owner: [''],
       source_owner_email: [''],
       // add other form controls as needed
     });
     this.sourceId = Number(this.route.snapshot.paramMap.get('id'));
 
       // Step 2: Fetch data from API and patch to form
       this.sourceService.getSourceById(this.sourceId).subscribe({
         next: (res: any) => {
           const data = res.sourceEntity;
           this.sourceForm.patchValue(data);
           this.toggleFieldsBasedOnQoS(data.quality_of_service);

         },
         error: (err: any) => {
           console.error('Failed to load source:', err);
         }
       });
       // this.generateTimeOptions();

       setTimeout(() => {
        this.cdr.detectChanges(); // ensure UI updates  
      }, 100);
      
      this.formLoaded = true; // triggers re-render

  // Watch for changes in quality_of_service
  this.sourceForm.get('quality_of_service')?.valueChanges.subscribe(value => {
    this.toggleFieldsBasedOnQoS(value);
  });

       this.getDataFields();

       this.rowDataDQA = [{}];

   }
 
   onFrequencyChange(): void {
       const freq = +this.sourceForm.get('frequency_of_update')?.value || 1;
       this.frequencyLimit = freq;
   
       const currentSelection = this.sourceForm.get('schedule_of_update')?.value || [];
       if (currentSelection.length > freq) {
         this.sourceForm.get('schedule_of_update')?.setValue(currentSelection.slice(0, freq));
       }
     }
     
       onScheduleSelectionChange(event: MatSelectChange): void {
         const selected = event.value || [];
         if (selected.length > this.frequencyLimit) {
           this.scheduleLimitReached = true;
           // Keep only allowed number of selections
           this.sourceForm.get('schedule_of_update')?.setValue(selected.slice(0, this.frequencyLimit));
         } else {
           this.scheduleLimitReached = false;
         }
       }
   
     private toggleFieldsBasedOnQoS(value: string): void {
       if (value === 'STREAMING' || value === 'AD_HOC') {
         this.sourceForm.get('frequency_of_update')?.disable({ emitEvent: false });
         this.sourceForm.get('schedule_of_update')?.disable({ emitEvent: false });
       } else {
         this.sourceForm.get('frequency_of_update')?.enable({ emitEvent: false });
         this.sourceForm.get('schedule_of_update')?.enable({ emitEvent: false });
       }
     }
   
   getDataFields()
   { 
     this.datafieldsService.getDataFieldsById(this.sourceId, 'SOURCE').subscribe({
       next: (res: any) => {
         this.rowData = [...res]; // triggers change
         if (this.gridApi) {
           this.gridApi.setRowData([]); // Clear first to ensure refresh
           this.gridApi.setRowData(this.rowData);
         }
   
         this.cdr.detectChanges(); // trigger Angular change detection
         
         error: (err: any) => {
           console.error('Failed to load source:', err);
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
     this.getDatafieldsDQA();
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
     console.log('Form data:', this.sourceForm.value);

     // Extract form values
  const formValues = this.sourceForm.value;

  // If QoS is STREAMING or AD_HOC, nullify these fields
  const isStreamingOrAdHoc = formValues.quality_of_service === 'STREAMING' || formValues.quality_of_service === 'AD_HOC';


     // Submit or save logic here
     const payload = {
       sourceEntity: {
     // this.sourceModel.source_id = this.sourceForm.value.sourceId;
     source_id: this.sourceId,
     source_name : this.sourceForm.value.source_name,
     vendor: this.sourceForm.value.vendor,
     quality_of_service : this.sourceForm.value.quality_of_service,
     frequency_of_update: isStreamingOrAdHoc ? null : formValues.frequency_of_update,
     schedule_of_update: isStreamingOrAdHoc ? null : formValues.schedule_of_update,
     methodology_of_transfer:this.sourceForm.value.methodology_of_transfer,
     source_type:this.sourceForm.value.source_type,
     source_version_number : this.sourceForm.value.source_version_number,
     source_status : this.sourceForm.value.source_status,
     source_owner: this.sourceForm.value.source_owner,
     source_owner_email: this.sourceForm.value.source_owner_email
       }
     }
     this.sourceService.updateSource(payload).subscribe(res => {
       if(res)
       {
         // alert("Source Updated Successfully. Your Source ID is "+ this.sourceId);
         this.toastNotificationService.success("Source Updated Successfully. Your Source ID is "+ this.sourceId);
         // window.location.reload();
       }
     })
   }


   getDatafieldsDQA()
  {
    this.datafieldsService.getDataFieldsDQA(this.sourceId, 'SOURCE').subscribe({
      next: (res: any) => {
        this.rowDataDQA = [res]; // triggers change
        this.showGlobalQualityRisk = res.allow_risk_update;
        console.log('rowDataoutboundDQA:', this.rowDataDQA);

        if (this.gridApi) {
          this.gridApi.setRowData([]); // Clear first to ensure refresh
          this.gridApi.setRowData(this.rowDataDQA);
        }
  
        this.cdr.detectChanges(); // trigger Angular change detection
        
      },
      error: (err: any) => {
        console.error('Failed to load interface:', err);
      }
         // Force refresh with setRowData
    
    });
  
  }


   saveDatafieldsDQA(data:any, interface_type:any)
   {
     console.log(data, "Interface Data Fields");
     this.dataFieldsModel.id = data.data.id;
       this.dataFieldsModel.allow_risk_update = this.showGlobalQualityRisk;
       this.dataFieldsModel.entity_id = [this.sourceId];
       this.dataFieldsModel.entity_type = "SOURCE";
     this.dataFieldsModel.default_dqa_t = data.data.default_dqa_t;
     this.dataFieldsModel.default_dqa_a = data.data.default_dqa_a;
     this.dataFieldsModel.default_dqa_c = data.data.default_dqa_c;
     this.dataFieldsModel.default_commentary_t = data.data.default_commentary_t;
     this.dataFieldsModel.default_commentary_a = data.data.default_commentary_a;
     this.dataFieldsModel.default_commentary_c = data.data.default_commentary_c;
 
         // alert("Data field added Successfully.");
         if(!data.data.id)
         {
           this.datafieldsService.createGlobalRisk(this.dataFieldsModel).subscribe(() => {
   
           this.toastNotificationService.success("Global Risk Added Successfully.");
           setTimeout(() => {
               this.getDataFields(); // refresh
            
             }, 1000);
         });
       }
         else
         {
           this.datafieldsService.updateGlobalRisk(this.dataFieldsModel).subscribe(() => {
   
             this.toastNotificationService.success("Global Risk updated Successfully.");
             setTimeout(() => {
                   this.getDataFields();
               
               }, 1000);
           });
         }
        
   }

 
  saveDatafields(data:any)
  {
    console.log(data, "Interface Data Fields");

  this.dataFieldsModel.field_id = data.data.field_id;
  this.dataFieldsModel.field_name = data.data.field_name;
  this.dataFieldsModel.field_description = data.data.field_description;
  this.dataFieldsModel.dqa_c = data.data.dqa_c;
  this.dataFieldsModel.dqa_t = data.data.dqa_t;
  this.dataFieldsModel.dqa_a = data.data.dqa_a;
  this.dataFieldsModel.commentary_a = data.data.commentary_a;
  this.dataFieldsModel.commentary_t = data.data.commentary_t;
  this.dataFieldsModel.commentary_c = data.data.commentary_c;
  this.dataFieldsModel.data_type = data.data.data_type;
  this.dataFieldsModel.field_length = data.data.field_length;
  this.dataFieldsModel.criticality = data.data.criticality;
  this.dataFieldsModel.entity_type = 'SOURCE';
  this.dataFieldsModel.entity_id = this.sourceId;
 
      // alert("Data field added Successfully.");
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
