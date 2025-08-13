import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { TargetService } from '../../services/target.service';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { PdfService } from 'src/app/features/shared-services/pdf.service';
import { MatSelectChange } from '@angular/material/select';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-edit-target',
  // standalone: true,
  // imports: [],
  templateUrl: './edit-target.component.html',
  styleUrl: './edit-target.component.scss'
})
export class EditTargetComponent {
  targetForm!: FormGroup;
   showDataFields = true;
   showDataQuality = false;
   showDataFieldsTable = true;
   targetTypeOptions = ['SYSTEM', 'FILE', 'DISPLAY', 'PRINTER']
   statusOptions: string[] = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
   timeOptions: string[] = ["00:00:00", "02:00:00", "04:00:00", "06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];
   serviceQualityOptions: string[] = ['STREAMING', 'PERIODIC', 'AD_HOC'];
   frequencyLimit = 1;
   scheduleLimitReached = false;
   formLoaded = false;

 
   // ✅ DataFields table data
   dataFields: any[] = [
     { fieldId: 1, fieldName: 'A', dataType: 'Num' },
     { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
   ];
 
   // ✅ Table column names
   displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
   targetId!: any;
   gridApi: any;
   gridColumnApi: any;
   // rowData: any;
   dataFieldsModel : Datafields = new Datafields();
   activeView!: string; // default view on load
 // report builder visibility/position
 reportVisible = false;
 reportPosition = { x: 200, y: 120 };

   constructor(
     private route: ActivatedRoute,
     private pdfService: PdfService,
     private fb: FormBuilder,
     private toastNotificationService: ToastnotificationService,
     private targetService: TargetService,
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
       field: 'dqa',
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
           headerName: 'T= Timeliness',
           field: 'dqa_t',
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
             color: 'blue',
             fontWeight: 'bold'
           }
         },
         {
           headerName: 'A= Accuracy',
           field: 'dqa_a',
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
 

   onHeaderCellClicked(event: any) {
    // event.column.getColDef().headerName gives the header text
    const clickedHeader = event?.column?.getColDef()?.headerName;
    if (clickedHeader === 'DQA') {
      // position the floating panel near mouse
      const mouseEvent = event.event as MouseEvent;
      const offsetX = 10; // small offset so it doesn't cover cursor
      const offsetY = 10;
      this.reportPosition = { x: mouseEvent.clientX + offsetX, y: mouseEvent.clientY + offsetY };
      this.reportVisible = true;
    }
  }
  openReportBuilder() {
    this.reportVisible = true;
    this.reportPosition = { x: 150, y: 100 }; // fixed position
  }

  closeReportBuilder() {
    this.reportVisible = false;
  }

  onBuildReport(options: any) {
    if (!this.gridApi) {
      console.error('Grid API not ready');
      return;
    }
    // pass grid rows as sample data to generate in PDF
    const allRows: any[] = [];
    this.gridApi.forEachNode((node: any) => allRows.push(node.data));
    this.pdfService.generatePdf(options, allRows);
    this.reportVisible = false;
  }

  onCloseBuilder() {
    this.reportVisible = false;
  }


   addRow() {
     const newItem = {fieldId: '', fieldName: '', dataType: '', fieldLength: '', dqaC: '', dqaT: '', dqaA:'',  criticality: '' };
     this.rowData = [...this.rowData, newItem];
   }
 
   onRowValueChanged(event: any) {
     console.log('Updated row:', event.data);
   }
 
   ngOnInit(): void {
     console.log('Editing target with ID:', this.targetId);
     this.targetForm = this.fb.group({
       target_name: [''],
       quality_of_service: [''],
       frequency_of_update: [''],
       schedule_of_update: [''],
       methodology_of_transfer: [''],
       target_type: [''],
       target_version_number: [''],
       target_status: [''],
       target_owner: [''],
       target_owner_email: [''],
       target_entity: [''],
       // add other form controls as needed
     });
     this.targetId = Number(this.route.snapshot.paramMap.get('id'));
 
       // Step 2: Fetch data from API and patch to form
       this.targetService.getTargetById(this.targetId).subscribe({
         next: (res: any) => {
           const data = res.targetEntity;
           this.targetForm.patchValue(data);
           this.toggleFieldsBasedOnQoS(data.quality_of_service);

         },
         error: (err: any) => {
           console.error('Failed to load target:', err);
         }
       });
       // this.generateTimeOptions();

       setTimeout(() => {
        this.cdr.detectChanges(); // ensure UI updates  
      }, 100);
      
      this.formLoaded = true; // triggers re-render
       

  // Watch for changes in quality_of_service
  this.targetForm.get('quality_of_service')?.valueChanges.subscribe(value => {
    this.toggleFieldsBasedOnQoS(value);
  });
       this.getDataFields();
   }

     onFrequencyChange(): void {
          const freq = +this.targetForm.get('frequency_of_update')?.value || 1;
          this.frequencyLimit = freq;
      
          const currentSelection = this.targetForm.get('schedule_of_update')?.value || [];
          if (currentSelection.length > freq) {
            this.targetForm.get('schedule_of_update')?.setValue(currentSelection.slice(0, freq));
          }
        }
        
          onScheduleSelectionChange(event: MatSelectChange): void {
            const selected = event.value || [];
            if (selected.length > this.frequencyLimit) {
              this.scheduleLimitReached = true;
              // Keep only allowed number of selections
              this.targetForm.get('schedule_of_update')?.setValue(selected.slice(0, this.frequencyLimit));
            } else {
              this.scheduleLimitReached = false;
            }
          }
      
        private toggleFieldsBasedOnQoS(value: string): void {
          if (value === 'STREAMING' || value === 'AD_HOC') {
            this.targetForm.get('frequency_of_update')?.disable({ emitEvent: false });
            this.targetForm.get('schedule_of_update')?.disable({ emitEvent: false });
          } else {
            this.targetForm.get('frequency_of_update')?.enable({ emitEvent: false });
            this.targetForm.get('schedule_of_update')?.enable({ emitEvent: false });
          }
        }
      
 
   getDataFields()
   { 
     this.datafieldsService.getDataFieldsById(this.targetId, 'TARGET').subscribe({
       next: (res: any) => {
         this.rowData = [...res]; // triggers change
         if (this.gridApi) {
           this.gridApi.setRowData([]); // Clear first to ensure refresh
           this.gridApi.setRowData(this.rowData);
         }
   
         this.cdr.detectChanges(); // trigger Angular change detection
         
         error: (err: any) => {
           console.error('Failed to load target:', err);
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
     console.log('Form data:', this.targetForm.value);
       // Extract form values
  const formValues = this.targetForm.value;

  // If QoS is STREAMING or AD_HOC, nullify these fields
  const isStreamingOrAdHoc = formValues.quality_of_service === 'STREAMING' || formValues.quality_of_service === 'AD_HOC';

     // Submit or save logic here
     const payload = {
       targetEntity: {
     // this.targetModel.target_id = this.targetForm.value.targetId;
     target_id: this.targetId,
     target_name : this.targetForm.value.target_name,
     quality_of_service : this.targetForm.value.quality_of_service,
     frequency_of_update: isStreamingOrAdHoc ? null : formValues.frequency_of_update,
     schedule_of_update: isStreamingOrAdHoc ? null : formValues.schedule_of_update,
     methodology_of_transfer:this.targetForm.value.methodology_of_transfer,
     target_type:this.targetForm.value.target_type,
     target_version_number : this.targetForm.value.target_version_number,
     target_status : this.targetForm.value.target_status,
     target_owner: this.targetForm.value.target_owner,
     target_owner_email: this.targetForm.value.target_owner_email,
     target_entity: this.targetForm.value.target_entity
       }
     }
     this.targetService.updateTarget(payload).subscribe(res => {
       if(res)
       {
         // alert("Target Updated Successfully. Your Target ID is "+ this.targetId);
         this.toastNotificationService.success("Target Updated Successfully. Your Target ID is "+ this.targetId);
         // window.location.reload();
       }
     })
   }
 
   saveDatafields(data:any)
   {
     console.log(data, "Target Data Fields");
 
   // this.dataFieldsModel.field_id = data.childGridData[0].fieldId;
   this.dataFieldsModel.field_name = data.data.field_name;
   this.dataFieldsModel.dqa_c = "L";
   this.dataFieldsModel.dqa_t = "L";
   this.dataFieldsModel.dqa_a = "L";
   this.dataFieldsModel.data_type = data.data.data_type;
   this.dataFieldsModel.field_length = data.data.field_length;
   this.dataFieldsModel.criticality = data.data.criticality;
   this.dataFieldsModel.entity_type = 'TARGET';
   this.dataFieldsModel.entity_id = this.targetId;
 
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
       this.toastNotificationService.error("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
       setTimeout(() => {
         this.getDataFields(); // refresh
 
       }, 1000);
   })
   }
}
