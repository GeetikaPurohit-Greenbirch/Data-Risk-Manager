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
   showDataFields = false;
   showDataQuality = false;
   showDataFieldsTable = false;
   statusOptions: string[] = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
   timeOptions: string[] = ["00:00:00", "02:00:00", "04:00:00", "06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];
 
   // ✅ DataFields table data
   dataFields: any[] = [
     { fieldId: 1, fieldName: 'A', dataType: 'Num' },
     { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
   ];
 
   // ✅ Table column names
   displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
   sourceId!: any;
   gridApi: any;
   gridColumnApi: any;
   // rowData: any;
   dataFieldsModel : Datafields = new Datafields();
   constructor(
     private route: ActivatedRoute,
     private fb: FormBuilder,
     private toastNotificationService: ToastnotificationService,
     private sourceService: SourceService,
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
     console.log('Editing source with ID:', this.sourceId);
     this.sourceForm = this.fb.group({
       source_name: [''],
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
         },
         error: (err: any) => {
           console.error('Failed to load source:', err);
         }
       });
       // this.generateTimeOptions();
       this.getDataFields();
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
 
   addDatafields()
   {
     this.showDataFieldsTable = true;
     this.showDataFields = true;
     this.showDataQuality = false;
   }
 
   showDQA()
   {
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
     // Submit or save logic here
     const payload = {
       sourceEntity: {
     // this.sourceModel.source_id = this.sourceForm.value.sourceId;
     source_id: this.sourceId,
     source_name : this.sourceForm.value.source_name,
     quality_of_service : this.sourceForm.value.quality_of_service,
     frequency_of_update:this.sourceForm.value.frequency_of_update,
     schedule_of_update:this.sourceForm.value.schedule_of_update,
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
 
   saveDatafields(data:any)
   {
     console.log(data, "Source Data Fields");
 
   // this.dataFieldsModel.field_id = data.childGridData[0].fieldId;
   this.dataFieldsModel.field_name = data.data.field_name;
   this.dataFieldsModel.dqa_c = "L";
   this.dataFieldsModel.dqa_t = "L";
   this.dataFieldsModel.dqa_a = "L";
   this.dataFieldsModel.data_type = data.data.data_type;
   this.dataFieldsModel.field_length = data.data.field_length;
   this.dataFieldsModel.criticality = data.data.criticality;
   this.dataFieldsModel.entity_type = 'SOURCE';
   this.dataFieldsModel.entity_id = this.sourceId;
 
   console.log(this.dataFieldsModel,"Source Data Fields");
 
   this.datafieldsService.createDataFields(this.dataFieldsModel).subscribe((res: any) => {
     if(res)
     {
       console.log(res, "Source builder created");
       // alert("Data field added Successfully.");
       this.toastNotificationService.success("Data field added Successfully.");
       setTimeout(() => {
         this.getDataFields(); // refresh
 
       }, 1000);
     }
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
