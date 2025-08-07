import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter, forkJoin } from 'rxjs';
import { ControlService } from '../../services/control.service';
import { SourceService } from 'src/app/features/sources/services/source.service';
import { SystemServiceService } from 'src/app/features/systems/services/system-service.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { InterfaceService } from 'src/app/features/interfaces/services/interface.service';
import { isRawIdxResponse } from '@okta/okta-auth-js/types/lib/idx/types/idx-js';

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
  attachTo!:string;
  attachToId!:number;
  activeView!: string; // default view on load

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private controlService: ControlService,
        private sourceService: SourceService,
        private systemService: SystemServiceService,
        private toastNotificationService: ToastnotificationService,
        private datafieldsService: DatafieldsService,
        private cdr: ChangeDetectorRef,
        private interfaceService: InterfaceService,
  ) {}


  columnDefs:(ColDef | ColGroupDef)[]= [
    { field: 'field_id', headerName: 'Field ID', editable: false, },
    { field: 'entity_id', headerName: 'Entity ID', editable: false, },
    { field: 'interface_name', headerName: 'Entity Name', editable: false, },
    { field: 'entity_type', headerName: 'Entity Type', editable: false },
    // { field: 'data_type', headerName: 'Data Type', editable: true,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: {
    //     values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
    //   },
    // },
    {
      headerName: 'Before Control Completeness',
      field: 'dqa_c',
      editable: false,
      // valueGetter: () => 'L', // Always returns 'L'
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
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
    { field: 'commentary_p', headerName: 'Completeness Commentary', editable: false },
    { field: 'aftercompleteness', headerName: 'After Control Completeness', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
      cellStyle: {
        color: 'red',
        fontWeight: 'bold'
      },
     },
    {
      headerName: 'Before Control Timeliness',
      field: 'dqa_t',
      editable: false,
      // valueGetter: () => 'L', // Always returns 'L'
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
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
    { field: 'commentary_t', headerName: 'Timeliness Commentary', editable: false },
    { field: 'aftertimliness', headerName: 'After Control Timeliness', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
      cellStyle: {
        color: 'blue',
        fontWeight: 'bold'
      },
     },
    {
      headerName: 'After Control Accuracy',
      field: 'dqa_a',
      editable: false,
      // valueGetter: () => 'L', // Always returns 'L'
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
      width:65,
      minWidth: 65,
      maxWidth: 65,
      resizable: true,
      suppressSizeToFit: true,
      cellStyle: {
        color: 'purple',
        fontWeight: 'bold'
      }
    },
    { field: 'commentary_a', headerName: 'Accuracy Commentary', editable: false },
    { field: 'afteraccuracy', headerName: 'After Control Accuracy', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["H", "M", "L"],
      },
      cellStyle: {
        color: 'purple',
        fontWeight: 'bold'
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
          this.controlForm.patchValue({
            application_date: new Date(data.application_date),
            attach_to: data.attach_to
          });
          this.attachTo = data.attach_to;
          this.attachToId = data.attach_to_id;
          this.onChange(data.attach_to, data.attach_to_id); // Load options & set selected value

        },
        error: (err: any) => {
          console.error('Failed to load control:', err);
        }
      });
    
  }


  onChange(attachTo: string, preselectedId?: string): void {
    this.filteredAttachToIdOptions = []; // Clear previous list
    this.controlForm.get('attach_to_id')?.setValue(null); // Reset selection
  
    if (attachTo === 'SOURCE') {
      this.sourceService.getSources().subscribe(data => {
        this.filteredAttachToIdOptions = data.map(item => ({
          id: item.sourceEntity.source_id,
          name: item.sourceEntity.source_name
        }));
  
        // Set preselected ID if available
        if (preselectedId) {
          this.controlForm.get('attach_to_id')?.setValue(preselectedId);
        }
      });
    } else if (attachTo === 'SYSTEM') {
      this.systemService.getSystems().subscribe(data => {
        this.filteredAttachToIdOptions = data.map(item => ({
          id: item.systemEntity.system_id,
          name: item.systemEntity.system_name
        }));
  
        // Set preselected ID if available
        if (preselectedId) {
          this.controlForm.get('attach_to_id')?.setValue(preselectedId);
        }
      });
    }
  }
  

  // Handle changes in cell values
  onCellValueChanged(event: any): void {
    console.log('Cell Value Changed:', event);
  }

  addDatafields(view:string)
  {
    this.activeView = view;
    this.showDataFields = true;
    // alert(this.attachTo +','+ this.attachToId);
      this.datafieldsService.getDataFieldsById(this.attachToId, this.attachTo).subscribe({
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

  interfaceOptionList: string[] = [];


  loadInboundInterfaces(view:string) {
    this.activeView = view;

    this.showDataFields = true;
    const interfaces$ = this.interfaceService.getInterface();
    const interfaceDataFields$ = this.interfaceService.getInboundData(this.attachToId);
  
    forkJoin([interfaces$, interfaceDataFields$]).subscribe({
      next: ([interfaces, interfaceDataFields]: [any[], any[]]) => {
        try {
          // Step 1: Populate dropdown from getInterface()
          if (interfaces?.length > 0) {
            this.interfaceOptionList = interfaces.map(
              (item: { interfaceEntity: { interface_id: any; interface_name: any } }) =>
                `${item.interfaceEntity.interface_id} - ${item.interfaceEntity.interface_name}`
            );
          }
  
          // Step 2: Parse and flatten inbound & outboundinterface fields from getInboundData()
          const parsedInboundInterfaces = JSON.parse(interfaceDataFields[0]?.inbound_interfaces || '[]');
  
          const parsedOutboundInterfaces = JSON.parse(interfaceDataFields[0]?.outbound_interfaces || '[]');

          // Assuming you have only one object in the array (as per your example)
          const rawData = interfaceDataFields[0]; // replace with your actual variable

          const inboundInterfaces = JSON.parse(rawData.inbound_interfaces || '[]');
          const outboundInterfaces = JSON.parse(rawData.outbound_interfaces || '[]');
          const systemFields = JSON.parse(rawData.system_fields || '[]');

          let combinedFields: any[] = [];

          // From system_fields
          systemFields.forEach((field: any) => {
            combinedFields.push({
              ...field,
              interface_name: rawData.system_name,
              interface_id: rawData.system_id,
              source: 'System'
            });
          });

          // From inbound_interfaces
          outboundInterfaces.forEach((intf: any) => {
            intf.fields.forEach((field: any) => {
              combinedFields.push({
                ...field,
                interface_name: intf.interface_name,
                interface_id: intf.interface_id,
                source: 'Outbound'
              });
            });
          });

          this.rowData = combinedFields;
          if (this.gridApi) {
            this.gridApi.setRowData([]); // Clear first to ensure refresh
            this.gridApi.setRowData(this.rowData);
          }
  
          this.cdr.detectChanges(); // trigger Angular change detection
        } catch (e) {
          console.error('Error parsing interface data:', e);
        }
      },
      error: (err: any) => {
        console.error('Failed to load interface or inbound data:', err);
      }
    });
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
          control_name:this.controlForm.value.control_name, 
          control_description:this.controlForm.value.control_description,
          attach_to:this.controlForm.value.attach_to,
          attach_to_id:this.controlForm.value.attach_to_id,
          control_owner:this.controlForm.value.control_owner,
          control_owner_email:this.controlForm.value.control_owner_email,
          version_number : this.controlForm.value.version_number,
          status : this.controlForm.value.status,
          application_date:this.controlForm.value.application_date,
          application_date_status:this.controlForm.value.application_date_status,
            
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
