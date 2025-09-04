import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter, forkJoin } from 'rxjs';
import { SystemServiceService } from '../../services/system-service.service';
import { SystemsModel } from '../../models/systems-model.model';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { InterfaceService } from 'src/app/features/interfaces/services/interface.service';
import { TargetService } from 'src/app/features/targets/services/target.service';
import * as joint from 'jointjs';

ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-edit-system',
  // standalone: true,
  // imports: [],
  templateUrl: './edit-system.component.html',
  styleUrl: './edit-system.component.scss'
})
export class EditSystemComponent{
 systemForm!: FormGroup;
  systemModel : SystemsModel = new SystemsModel();
  // showDataFieldsTable = false;
  public showDataFields = false;
  public showInputDataFields = false;
  public showInbound = false;
  public showoutbound = false;
  public showsystemMapping = false;
  activeView!: string; // default view on load
  isLoading: boolean = false;

 
  @ViewChild('paperContainer', { static: false }) paperContainer!: ElementRef;

  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  private elementsMap: { [id: string]: joint.dia.Element } = {};
  
  inboundFields: any[] = [];
  outboundFields:any[] = [];
  links: any[] = []; // Store link data
  showGlobalQualityRiskGridInbound = false; // Controls visibility of AG Grid
  showGlobalQualityRiskGridOutbound = false;
  statusOptions: string[] = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];

  
  formLoaded = false;

  // ✅ Table column names
  systemId!: any;
  gridApi: any;
  gridApiIn: any;
  gridApiout: any;
  gridColumnApi: any;
   dataFieldsModel : Datafields = new Datafields();
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private systemService: SystemServiceService,
     private datafieldsService: DatafieldsService,
        private cdr: ChangeDetectorRef,
        private toastNotificationService: ToastnotificationService,
        private interfaceService: InterfaceService,
        private targetService : TargetService,
        

  ) {}

  columnDefsInboundDQA:(ColDef | ColGroupDef)[]= [
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
          this.saveDatafieldsDQA(params.node, 'INBOUND');
        });
    
      
        div.appendChild(saveDataFields);
    
        return div;
      }
    },
  ]


  columnDefsOoutboundDQA:(ColDef | ColGroupDef)[]= [
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
  columnDefs:(ColDef | ColGroupDef)[]= [
    { field: 'interface_id', headerName: 'Entity ID', editable: false, },
    { field: 'interface_name', headerName: 'Entity Name', editable: false, },
    { field: 'entity_type', headerName: 'Entity Type', editable: false, },
    { field: 'field_id', headerName: 'Field ID', editable: false, },
    { field: 'field_name', headerName: 'Field Name', editable: this.isEditable },
    { field: 'data_type', headerName: 'Data Type', editable: this.isEditable,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
      },
    },
    { field: 'field_length', headerName: 'Length', editable: this.isEditable },
    {
      headerName: 'DQA',
      headerClass: 'custom-parent-header',
      resizable: true,
      children: [
        {
          headerName: 'C',
          field: 'dqa_c',
          editable: this.isEditable,
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
          field: 'commentary_c',
          editable: this.isEditable,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'T',
          field: 'dqa_t',
          editable: this.isEditable,
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
          field: 'commentary_t',
          editable: this.isEditable,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'A',
          field: 'dqa_a',
          editable: this.isEditable,
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
          field: 'commentary_a',
          editable: this.isEditable,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
      ],

    },
    { field: 'criticality', headerName: 'Criticality', editable: this.isEditable,
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

           // ✅ Disable if entity_type is 'INTERFACE'
           if (params.data.entity_type === 'INTERFACE') {
            saveDataFields.disabled = true;
            saveDataFields.style.opacity = '0.5';
            saveDataFields.style.cursor = 'not-allowed';
          }
    
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
    
         // ✅ Disable if entity_type is 'INTERFACE'
        if (params.data.entity_type === 'INTERFACE') {
          deleteDataFields.disabled = true;
          deleteDataFields.style.opacity = '0.5';
          deleteDataFields.style.cursor = 'not-allowed';
        }

        deleteDataFields.addEventListener('click', () => {
          if (!deleteDataFields.disabled) {
            this.deleteDAtaFields(params.node);
          }
        });
    
        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);
    
        return div;
      }
    },
  ];

  columnDefsOutbound:(ColDef | ColGroupDef)[]= [
    { field: 'interface_id', headerName: 'Entity ID', editable: false, },
    { field: 'interface_name', headerName: 'Entity Name', editable: false, },
    { field: 'entity_type', headerName: 'Entity Type', editable: false, },

    { field: 'field_id', headerName: 'Field ID', editable: false, },
    { field: 'field_name', headerName: 'Field Name', editable: this.isEditable },
    { field: 'data_type', headerName: 'Data Type', editable: this.isEditable,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
      },
    },
    { field: 'field_length', headerName: 'Length', editable: this.isEditable },
    {
      headerName: 'DQA',
      headerClass: 'custom-parent-header',
      resizable: true,
      children: [
        {
          headerName: 'C',
          field: 'dqa_c',
          editable: this.isEditable,
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
          field: 'commentary_c',
          editable: this.isEditable,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'T',
          field: 'dqa_t',
          editable: this.isEditable,
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
          field: 'commentary_t',
          editable: this.isEditable,
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'A',
          field: 'dqa_a',
          editable: this.isEditable,
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
          field: 'commentary_a',
          editable: this.isEditable,
          width:100,
          minWidth: 100,
          maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
      ],

    },
    { field: 'criticality', headerName: 'Criticality', editable: this.isEditable,
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
    
         // ✅ Disable if entity_type is 'INTERFACE'
        if (params.data.entity_type === 'INTERFACE') {
          deleteDataFields.disabled = true;
          deleteDataFields.style.opacity = '0.5';
          deleteDataFields.style.cursor = 'not-allowed';
        }

        deleteDataFields.addEventListener('click', () => {
          if (!deleteDataFields.disabled) {
            this.deleteDAtaFields(params.node);
          }
        });
    
        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);
    
        return div;
      }
    },
  ];

  inboundColumnDefs:(ColDef)[]= [
    { field: 'interface', headerName: 'Interface', editable: true,
      cellEditor: 'agSelectCellEditor',
    cellEditorParams: (params: any) => {
      return {
        values: this.interfaceOptionList
      };
    }
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
    
        const saveInterface = document.createElement('button');
        saveInterface.className = 'fa fa-save';
        saveInterface.style.color = 'green';
        saveInterface.style.border = '1px solid lightGrey';
        saveInterface.style.borderRadius = '5px';
        saveInterface.style.lineHeight = '22px';
        saveInterface.style.height = '32px';
        saveInterface.style.cursor = 'pointer';
        saveInterface.title = 'Save';
    
        // Pass row data or node to save
        saveInterface.addEventListener('click', () => {
          this.saveInboundInterface(params.node, 'INBOUND');
        });
    
        const deleteInterface = document.createElement('button');
        deleteInterface.className = 'fa fa-trash';
        deleteInterface.style.color = 'red';
        deleteInterface.style.border = '1px solid lightGrey';
        deleteInterface.style.borderRadius = '5px';
        deleteInterface.style.lineHeight = '22px';
        deleteInterface.style.height = '32px';
        deleteInterface.style.cursor = 'pointer';
        deleteInterface.title = 'Delete';
    
        deleteInterface.addEventListener('click', () => {
          this.deleteInboundInterface(params.node, 'INBOUND');
        });
    
        div.appendChild(saveInterface);
        div.appendChild(deleteInterface);
    
        return div;
      }
    },
  ];

  outBoundColumnDefs:(ColDef)[]= [
    { field: 'interface', headerName: 'Interface', editable: true,
      cellEditor: 'agSelectCellEditor',
    cellEditorParams: (params: any) => {
      return {
        values: this.interfaceOptionList
      };
    }
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
    
        const saveInterface = document.createElement('button');
        saveInterface.className = 'fa fa-save';
        saveInterface.style.color = 'green';
        saveInterface.style.border = '1px solid lightGrey';
        saveInterface.style.borderRadius = '5px';
        saveInterface.style.lineHeight = '22px';
        saveInterface.style.height = '32px';
        saveInterface.style.cursor = 'pointer';
        saveInterface.title = 'Save';
    
        // Pass row data or node to save
        saveInterface.addEventListener('click', () => {
          this.saveInboundInterface(params.node, 'OUTBOUND');
        });
    
        const deleteInterface = document.createElement('button');
        deleteInterface.className = 'fa fa-trash';
        deleteInterface.style.color = 'red';
        deleteInterface.style.border = '1px solid lightGrey';
        deleteInterface.style.borderRadius = '5px';
        deleteInterface.style.lineHeight = '22px';
        deleteInterface.style.height = '32px';
        deleteInterface.style.cursor = 'pointer';
        deleteInterface.title = 'Delete';
    
        deleteInterface.addEventListener('click', () => {
          this.deleteInboundInterface(params.node, 'OUTBOUND');
        });
    
        div.appendChild(saveInterface);
        div.appendChild(deleteInterface);
    
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
  rowDataInboundDQA: any;
  rowDataoutboundDQA: any;
  rowDataInput: any;
  rowDataInbound: any;
  rowDataOutbound: any;
  rowDataOutboundTarget: any;
  rowDataCombined:any;

  
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  addRow() {
    const newItem = { entity_type:'SYSTEM', fieldName: '', dataType: '', value: '', description: '' };
    this.rowDataInput = [...this.rowDataInput, newItem];
  }

  isEditable(params: any): boolean {
    return params.data.entity_type === 'SYSTEM';
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

      setTimeout(() => {
        this.cdr.detectChanges(); // ensure UI updates  
      }, 100);
      
      this.formLoaded = true; // triggers re-render

      this.getDataFields();
      // this.getInboundInterface();
      this.loadInboundInterfaces();
      this.rowDataInbound = [{}];
      this.rowDataInput = [{}];
      this.rowDataInboundDQA = [{}];
      this.rowDataoutboundDQA = [{}];
      this.rowDataOutbound = [{}]; // Initialize with one blank row
      this.getOutboundTarget();
      this.rowDataOutboundTarget = [{}];
      this.loadDropdownOptions();
      this.rowDataCombined = [{}];
      // this.getInboundInterfaceData();

  }

  setActiveView(view: string) {
    this.activeView = view;
  }

  getDataFields()
  { 
    // this.isLoading = true; // show loader

    this.datafieldsService.getDataFieldsById(this.systemId, 'SYSTEM').subscribe({
      next: (res: any) => {
        this.rowData = [...res]; // triggers change

        if (this.gridApi) {
          this.gridApi.setRowData([]); // Clear first to ensure refresh
          this.gridApi.setRowData(this.rowData);
        }
  
        this.cdr.detectChanges(); // trigger Angular change detection
       
      },
      error: (err: any) => {
        console.error('Failed to load data fields:', err);
      },
      complete: () => {
        // this.isLoading = false; // hide loader
      }
         // Force refresh with setRowData
    
    });
  }

  // rowDataInbound: string[] = [];

  interfaceOptionList: string[] = [];

getInboundInterface() {
  this.interfaceService.getInterface().subscribe({
    next: (res: any) => {
      if (res?.length > 0) {
        this.interfaceOptionList = res.map(
          (item: { interfaceEntity: { interface_id: any; interface_name: any; } }) =>
            `${item.interfaceEntity.interface_id} - ${item.interfaceEntity.interface_name}`
        );
      }

      // Show only one row in the grid initially
      this.rowDataInbound = [{}];
      this.rowDataOutbound = [{}];
      this.rowDataInput = [{}];

      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Failed to load interface:', err);
    }
  });
}

targetOptionList: string[] = [];

getOutboundTarget() {
  this.targetService.getTarget().subscribe({
    next: (res: any) => {
      if (res?.length > 0) {
        this.targetOptionList = res.map(
          (item: { targetEntity: { target_id: any; target_name: any; } }) =>
            `${item.targetEntity.target_id} - ${item.targetEntity.target_name}`
        );
      }

      // Show only one row in the grid initially
      this.rowDataOutboundTarget = [{}];

      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Failed to load interface:', err);
    }
  });
}


combinedOptions: string[] = [];

loadDropdownOptions(): void {
  forkJoin([
    this.interfaceService.getInterface(),
    this.targetService.getTarget()
  ]).subscribe(([interfaces, targets]: [any[], any[]]) => {
    const interfaceOptions = interfaces?.map(
      (item: { interfaceEntity: { interface_id: any; interface_name: any } }) =>
        `Interface: ${item.interfaceEntity.interface_id} - ${item.interfaceEntity.interface_name}`
    ) || [];

    const targetOptions = targets?.map(
      (item: { targetEntity: { target_id: any; target_name: any } }) =>
        `Target: ${item.targetEntity.target_id} - ${item.targetEntity.target_name}`
    ) || [];

    this.combinedOptions = [...interfaceOptions, ...targetOptions];
    console.log(this.combinedOptions, "Combined options")
    this.rowDataCombined = [{}]; // show one empty row in grid
    this.cdr.detectChanges();
  });
}

  addDatafields(view:string)
  {
    this.activeView = view;
    // this.showDataFieldsTable = true;
    this.showInputDataFields = false;
    this.showDataFields = true;
    this.showInbound = false;
    this.showoutbound = false;
    this.showsystemMapping = false;
    this.cdr.detectChanges();
    this.getDatafieldsDQA('OUTBOUND');
  }
  
  addInputDatafields(view:string)
  {
    this.activeView = view;
    this.showInputDataFields = true;
    this.showDataFields = false;
    this.showInbound = false;
    this.showoutbound = false;
    this.showsystemMapping = false;
    this.cdr.detectChanges();
    this.getDatafieldsDQA('INBOUND')
  }

  // Handle changes in cell values
  onCellValueChanged(event: any): void {
    console.log('Cell Value Changed:', event);
  }

  inboundOnCellValueChanged(event: any): void
  {
    console.log('Cell Value Changed:', event);

  }
  outboundOnCellValueChanged(event: any): void
  {
    console.log('Cell Value Changed:', event);

  }
  outboundTaregtOnCellValueChanged(event: any): void
  {
    console.log('Cell Value Changed:', event);

  }

  inputCellValueChanged(event: any): void
  {
    console.log('Cell Value Changed:', event);

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
        // alert("System Updated Successfully. Your System ID is "+ this.systemId);
        this.toastNotificationService.success("System Updated Successfully. Your System ID is "+ this.systemId)
        // window.location.reload();
      }
    })
  }

  onInboundGridReady(params: any) {
    this.gridApiIn = params.api;
  }

  onOutboundGridReady(params: any) {
    this.gridApiout = params.api;
  }

  toggleOutboundGrid(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.showGlobalQualityRiskGridOutbound = checked;
    if (!checked) {
      this.gridApi = null;
    }
    this.cdr.detectChanges();
  }

  toggleInboundGrid(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.showGlobalQualityRiskGridInbound = checked;
    if (!checked) {
      this.gridApi = null;
    }
    this.cdr.detectChanges();
  }

  getDatafieldsDQA(interface_type:any)
  {
    if(interface_type == 'OUTBOUND')
    {
    const entity_id = this.outboundInterfaceList.map((i: any) => i.interface_id);
    this.datafieldsService.getDataFieldsDQA(entity_id[0], 'INTERFACE').subscribe({
      next: (res: any) => {
       
        this.rowDataoutboundDQA = [res]; // triggers change
        this.showGlobalQualityRiskGridOutbound = res.allow_risk_update;
        console.log('rowDataoutboundDQA:', this.rowDataoutboundDQA);

        if (this.gridApiout && this.showGlobalQualityRiskGridOutbound) {
          this.gridApiout.setRowData([]); // Clear first to ensure refresh
          this.gridApiout.setRowData(this.rowDataoutboundDQA);
        }
  
        this.cdr.detectChanges(); // trigger Angular change detection
          
      
      },
      error: (err: any) => {
        console.error('Failed to load interface:', err);
        
      }
         // Force refresh with setRowData
    
    });
  }
  else if(interface_type == 'INBOUND')
  {
    this.datafieldsService.getDataFieldsDQA(this.systemId, 'SYSTEM').subscribe({
      next: (res: any) => {
        this.rowDataInboundDQA = [res]; // triggers change
        this.showGlobalQualityRiskGridInbound = res.allow_risk_update;
        if (this.gridApiIn && this.showGlobalQualityRiskGridInbound) {
          this.gridApiIn.setRowData(this.rowDataInboundDQA);
        }
  
        this.cdr.detectChanges(); // trigger Angular change detection
        
      
      },
      error: (err: any) => {
        console.error('Failed to load interface:', err);
        
      }
         // Force refresh with setRowData
    
    });
  }
  }

  saveDatafieldsDQA(data:any, interface_type:any)
  {
    console.log(data, "Interface Data Fields");
    this.dataFieldsModel.id = data.data.id;
    if(interface_type == 'INBOUND')
    {
      this.dataFieldsModel.allow_risk_update = this.showGlobalQualityRiskGridInbound;
      this.dataFieldsModel.entity_id = [this.systemId];
      this.dataFieldsModel.entity_type = "SYSTEM";
    }
    else if(interface_type == 'OUTBOUND')
    {
      this.dataFieldsModel.allow_risk_update = this.showGlobalQualityRiskGridOutbound;
      // this.dataFieldsModel.entity_id = data.data.entity_id;
      this.dataFieldsModel.entity_id = this.outboundInterfaceList.map((i: any) => i.interface_id);
      this.dataFieldsModel.entity_type = "INTERFACE";
    }
    this.dataFieldsModel.default_dqa_t = data.data.default_dqa_t;
    this.dataFieldsModel.default_dqa_a = data.data.default_dqa_a;
    this.dataFieldsModel.default_dqa_c = data.data.default_dqa_c;
    this.dataFieldsModel.default_commentary_t = data.data.default_commentary_t;
    this.dataFieldsModel.default_commentary_a = data.data.default_commentary_a;
    this.dataFieldsModel.default_commentary_c = data.data.default_commentary_c;

    console.log(this.outboundInterfaceList, "INTERFACE Data")
    console.log(this.dataFieldsModel, "DQA Risk level");
        // alert("Data field added Successfully.");
        if(!data.data.id)
        {
          this.datafieldsService.createGlobalRisk(this.dataFieldsModel).subscribe(() => {
  
          this.toastNotificationService.success("Global Risk Added Successfully.");
          setTimeout(() => {
              this.loadInboundInterfaces(); // refresh
           
            }, 1000);
        });
      }
        else
        {
          this.datafieldsService.updateGlobalRisk(this.dataFieldsModel).subscribe(() => {
  
            this.toastNotificationService.success("Global Risk updated Successfully.");
            setTimeout(() => {
                  this.loadInboundInterfaces();
              
              }, 1000);
          });
        }
       
  }

  saveDatafields(data:any)
  {
    console.log(data, "Interface Data Fields");

  this.dataFieldsModel.field_id = data.data.field_id;
  this.dataFieldsModel.field_name = data.data.field_name;
  this.dataFieldsModel.dqa_c = data.data.dqa_c;
  this.dataFieldsModel.dqa_t = data.data.dqa_t;
  this.dataFieldsModel.dqa_a = data.data.dqa_a;
  this.dataFieldsModel.commentary_a = data.data.commentary_a;
  this.dataFieldsModel.commentary_t = data.data.commentary_t;
  this.dataFieldsModel.commentary_c = data.data.commentary_c;
  this.dataFieldsModel.data_type = data.data.data_type;
  this.dataFieldsModel.field_length = data.data.field_length;
  this.dataFieldsModel.criticality = data.data.criticality;
  this.dataFieldsModel.entity_type = data.data.entity_type;
  this.dataFieldsModel.entity_id = data.data.entity_id;
 
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

  addInbound(view: string)
  {
    this.activeView = view;
    // this.showDataFieldsTable = true;
    this.showInputDataFields = false;
    this.showDataFields = false;
    this.showInbound = true;
    this.showoutbound = true;
    this.showsystemMapping = false;
    this.loadInboundInterfaces();
  }

  // addOutBound()
  // {
  //   // this.showDataFieldsTable = true;
  //   this.showInputDataFields = false;
  //   this.showDataFields = false;
  //   this.showInbound = false;
  //   this.showoutbound = true;
  //   this.showsystemMapping = false;
  // }

  sysMapping(view:string)
  {
    this.activeView = view;
    // this.showDataFieldsTable = true;
    this.showInputDataFields = false;
    this.showDataFields = false;
    this.showInbound = false;
    this.showoutbound = false;
    this.showsystemMapping = true;

    this.cdr.detectChanges();

  }

  addInterface()
  {
    const newRow = {}; // or prefill with defaults
    this.rowDataInbound = [...this.rowDataInbound, newRow]; // Add new row
  }


  addOutInterface()
  {
    const newRow = {}; // or prefill with defaults

    this.rowDataOutbound = [...this.rowDataOutbound, newRow]; // Add new row
  
  }

  saveInboundInterface(data:any, interface_type:string)
  {
    const str = data.data.interface;
    const interfaceId = str.split(" - ")[0]; // Extract "2", "3", etc.
 
    this.getInterfaceDataFields(interfaceId);

   const payload = {
    system_id: this.systemId,
    interface_id: parseInt(interfaceId),
    interface_type: interface_type
   }
   
      this.interfaceService.saveInboundInterface(payload, this.systemId).subscribe(res => {
        if(res)
        {
          // const response = JSON.stringify(res)
          // this.rowDataInbound = response
          if(interface_type === 'INBOUND')
          {
            // alert("Inbound Interface Saved Successfully for System ID"+ this.systemId);
            this.toastNotificationService.success("Inbound Interface Saved Successfully for System ID"+ this.systemId);
          }
          else
          {
            // alert("Outbound Interface Saved Successfully for System ID"+ this.systemId);
            this.toastNotificationService.success("Outbound Interface Saved Successfully for System ID"+ this.systemId);
          }
          this.loadInboundInterfaces();
        }
      })
  }

  deleteInboundInterface(data:any, interface_type:string)
  {
    const str = data.data.interface;
    const interfaceId = str.split(" - ")[0]; // Extract "2", "3", etc.
 
    this.getInterfaceDataFields(interfaceId);
   
      this.interfaceService.deleteInboundInterface(interfaceId, this.systemId, interface_type).subscribe(res => {
        if(res)
        {
          // const response = JSON.stringify(res)
          // this.rowDataInbound = response
          if(interface_type === 'INBOUND')
          {
            // alert("Inbound Interface Saved Successfully for System ID"+ this.systemId);
            this.toastNotificationService.success("Inbound Interface Saved Successfully for System ID"+ this.systemId);
          }
          else
          {
            // alert("Outbound Interface Saved Successfully for System ID"+ this.systemId);
            this.toastNotificationService.success("Outbound Interface Saved Successfully for System ID"+ this.systemId);
          }
        }
      })
  }

  public outboundInterfaceList!:any;
  public systemList!:any;
  loadInboundInterfaces() {
    // this.isLoading = true; // show loader
    const interfaces$ = this.interfaceService.getInterface();
    const interfaceDataFields$ = this.interfaceService.getInboundData(this.systemId);
  
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
  
          if (parsedInboundInterfaces?.length > 0) {
            this.rowDataInbound = parsedInboundInterfaces.map(
              (item:  { interface_id: any; interface_name: any  }) =>
                ({                
                  interface: `${item.interface_id} - ${item.interface_name}`
                })
            );
            // this.rowDataInbound = parsedInboundInterfaces.flatMap((item: any) =>
            //   item.fields.map((field: any) => ({
            //     ...field,
            //     interface: `${item.interface_id} - ${item.interface_name}`
            //   }))
            // );
          } else {
            // Fallback: show one blank row if no data
            this.rowDataInbound = [{}];
          }
  
          const parsedOutboundInterfaces = JSON.parse(interfaceDataFields[0]?.outbound_interfaces || '[]');

          // Assuming you have only one object in the array (as per your example)
          const rawData = interfaceDataFields[0]; // replace with your actual variable

          const inboundInterfaces = JSON.parse(rawData.inbound_interfaces || '[]');
          const outboundInterfaces = JSON.parse(rawData.outbound_interfaces || '[]');
          const systemFields = JSON.parse(rawData.system_fields || '[]');

          this.systemList = systemFields;
          this.outboundInterfaceList = outboundInterfaces;

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
          inboundInterfaces.forEach((intf: any) => {
            intf.fields.forEach((field: any) => {
              combinedFields.push({
                ...field,
                interface_name: intf.interface_name,
                interface_id: intf.interface_id,
                source: 'Inbound'
              });
            });
          });

          // outboundInterfaces.forEach((intf: any) => {
          //   intf.fields.forEach((field: any) => {
          //     combinedFields.push({
          //       ...field,
          //       interface_name: intf.interface_name,
          //       source: 'Outbound'
          //     });
          //   });
          // });

          // this.rowData = combinedFields;
          this.rowData =[].concat(
              ...outboundInterfaces.map((i: any) =>
                i.fields.map((field: any) => ({
                  ...field,
                  interface_name: i.interface_name,
                  interface_id: i.interface_id
                }))
              )
            );
          // this.rowDataInput = inboundInterfaces[0].fields;
          // this.rowDataInput = [].concat(...inboundInterfaces.map((i: { fields: any; }) => i.fields));
          this.rowDataInput = combinedFields;
          // this.rowDataInput = [].concat(
          //   ...inboundInterfaces.map((i: any) =>
          //     i.fields.map((field: any) => ({
          //       ...field,
          //       interface_name: i.interface_name,
          //       interface_id: i.interface_id
          //     }))
          //   )
          // );
          // this.inboundInterfaceList = inboundInterfaces;

          if (parsedOutboundInterfaces?.length > 0) {
            this.rowDataOutbound = parsedOutboundInterfaces.map(
              (item: { interface_id: any; interface_name: any; } ) =>
              ({                
                interface: `${item.interface_id} - ${item.interface_name}`
              })
            );

            // this.rowDataOutbound = parsedOutboundInterfaces.flatMap((item: any) =>
            //   item.fields.map((field: any) => ({
            //     ...field,
            //     interface: `${item.interface_id} - ${item.interface_name}`
            //   }))
            // );
          } else {
            // Fallback: show one blank row if no data
            this.rowDataOutbound = [{}];
          }
  
          // Refresh grid
          if (this.gridApi) {
            this.gridApi.setRowData([]);
            this.gridApi.setRowData(this.rowDataInput);
            this.gridApi.setRowData(this.rowDataInbound);
            this.gridApi.setRowData(this.rowDataOutbound);
          }


          this.inboundFields = [];
          this.outboundFields = [];

          // 🔄 Flatten inbound
        parsedInboundInterfaces.forEach((intf: any) => {
          intf.fields.forEach((field: any) => {
            this.inboundFields.push({
              interface: intf.interface_name,
              fieldId: field.field_id,
              entityType: field.entity_type,
              fieldName: field.field_name,
              dataType: field.data_type,
              length: field.field_length,
            });
          });
        });

         // 🔄 Flatten outbound
        parsedOutboundInterfaces.forEach((intf: any) => {
          intf.fields.forEach((field: any) => {
            this.outboundFields.push({
              interface: intf.interface_name,
              fieldId: field.field_id,
              entityType: field.entity_type,
              fieldName: field.field_name,
              dataType: field.data_type,
              length: field.field_length,
            });
          });
        });

          // 🔄 Now render fields on the diagram

        // this.renderFields();
  
          this.cdr.detectChanges(); // trigger Angular change detection
        } catch (e) {
          console.error('Error parsing interface data:', e);
        }
      },
      error: (err: any) => {
        console.error('Failed to load interface or inbound data:', err);
      },
      complete: () => {
        // this.isLoading = false; // hide loader
      }
    });
  }
    

  getInterfaceDataFields(interfaceId: any) {
    
    const interfaceFields$ = this.datafieldsService.getDataFieldsById(interfaceId, 'INTERFACE');
    const systemFields$ = this.datafieldsService.getDataFieldsById(this.systemId, 'SYSTEM');
  
    forkJoin([interfaceFields$, systemFields$]).subscribe({
      next: ([interfaceFields, systemFields]: [any[], any[]]) => {
        this.rowData = [...interfaceFields, ...systemFields];
  
        if (this.gridApi) {
          this.gridApi.setRowData([]); // Clear existing data
          this.gridApi.setRowData(this.rowData); // Set merged data
        }
  
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err: any) => {
        console.error('Failed to load interface or system fields:', err);
      }
    });
  }
  

}



    // forkJoin([
    //   this.interfaceService.getInterface(),
    //   this.targetService.getTarget()
    // ]).subscribe(([interfaces, targets]: [any[], any[]]) => {
    //   const interfaceOptions = interfaces?.map(
    //     (item: { interfaceEntity: { interface_id: any; interface_name: any } }) =>
    //       `Interface: ${item.interfaceEntity.interface_id} - ${item.interfaceEntity.interface_name}`
    //   ) || [];
  
    //   const targetOptions = targets?.map(
    //     (item: { targetEntity: { target_id: any; target_name: any } }) =>
    //       `Target: ${item.targetEntity.target_id} - ${item.targetEntity.target_name}`
    //   ) || [];
  
    //   this.combinedOptions = [...interfaceOptions, ...targetOptions];
    //   console.log(this.combinedOptions, "Combined options")
    //   this.rowDataCombined = [{}]; // show one empty row in grid
    //   this.cdr.detectChanges();
    // });