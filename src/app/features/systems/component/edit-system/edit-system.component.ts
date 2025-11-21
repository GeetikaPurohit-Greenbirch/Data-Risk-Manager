import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CellFocusedEvent, ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter, forkJoin, Observable } from 'rxjs';
import { SystemServiceService } from '../../services/system-service.service';
import { SystemsModel } from '../../models/systems-model.model';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { InterfaceService } from 'src/app/features/interfaces/services/interface.service';
import { TargetService } from 'src/app/features/targets/services/target.service';
import * as joint from 'jointjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateLineageComponent } from '../create-lineage/create-lineage.component';
import { UsecaseService } from 'src/app/features/use-cases/services/usecase.service';
import { icons, createElement } from 'lucide';

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
  useCaseId!:number;
  useCaseName = '';
  public rowindex = 0;
  public savedUseCase: string | null = null;
  useCaseModel!:number;
  is_modified_risk_level: boolean = false;
  resetRiskBtn : boolean = false;
 
  @ViewChild('paperContainer', { static: false }) paperContainer!: ElementRef;

  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  private elementsMap: { [id: string]: joint.dia.Element } = {};
  
  inboundFields: any[] = [];
  outboundFields:any[] = [];
  combinedFields:any[] = [];
  links: any[] = []; // Store link data
  showGlobalQualityRiskGridInbound = false; // Controls visibility of AG Grid
  showGlobalQualityRiskGridOutbound = false;
  statusOptions: string[] = [  'NEW', 'DRAFT', 'READY_FOR_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
  useCases: any[] = [];
  
  formLoaded = false;

  // ✅ Table column names
  isBacktolineage=false;
  BacktolineagePath: any ="";
  systemId!: any;
  gridApi: any;
  gridApiIn: any;
  gridApiout: any;
  gridColumnApi: any;
  dataFieldsModel : Datafields = new Datafields();
  systemData: any;

  isClone = false;
  originalVersion = '';
  paentInterfaceId:any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private systemService: SystemServiceService,
    private datafieldsService: DatafieldsService,
    private cdr: ChangeDetectorRef,
    private toastNotificationService: ToastnotificationService,
        private interfaceService: InterfaceService,
        private targetService : TargetService,
        private dialog: MatDialog,
         private usecaseService: UsecaseService,
         private router: Router,

  ) {
    this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
              const nav = this.router.getCurrentNavigation();
              const state = nav?.extras?.state as { clonedSystem?: any };
              if (state?.clonedSystem) {
                this.systemData = state.clonedSystem;
                this.isClone = true;
                this.originalVersion = this.systemData.version_number;
                this.paentInterfaceId = this.systemData.system_id;
                this.resetFormForClone();
              }
            });
  }

  columnDefsInboundDQA:(ColDef | ColGroupDef)[]= [
    {
      headerName: 'DQA',
      headerClass: 'custom-parent-header',
      resizable: true,
      headerTooltip: 'DQA',
      children: [
        {
          headerName: 'Completeness',
          field: 'default_dqa_c',
          editable: true,
          headerTooltip: 'Completeness',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#e8000a',
            fontWeight: '600'
          },
        },
        {
          headerName: 'C Commentary',
          field: 'default_commentary_c',
          editable: true,
          headerTooltip: 'C Commentary',
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'Timeliness',
          field: 'default_dqa_t',
          editable: true,
          headerTooltip: 'Timeliness',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: false,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#3e63dd',
            fontWeight: '600'
          }
        },
        {
          headerName: 'T Commentary',
          field: 'default_commentary_t',
          editable: true,
          headerTooltip: 'T Commentary',
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'Accuracy',
          field: 'default_dqa_a',
          editable: true,
          headerTooltip: 'Accuracy',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'purple',
            fontWeight: '600'
          }
        },
        {
          headerName: 'A Commentary',
          field: 'default_commentary_a',
          editable: true,
          headerTooltip: 'A Commentary',
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
       
      pinned:'right',
      // flex:1,
      minWidth: 80,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        const saveDataFields = document.createElement('button');
        saveDataFields.title = 'Save';
        saveDataFields.style.padding = '0px';
        saveDataFields.style.border = 'none';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.style.background = 'transparent';

        const saveIcon = createElement(icons.Save, {
          color: '#008236',
          height: '14px',
          strokeWidth: 2
        });
        saveDataFields.appendChild(saveIcon);
    
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
      headerTooltip: 'DQA',
      resizable: true,
      children: [
        {
          headerName: 'Completeness',
          field: 'default_dqa_c',
          editable: true,
          headerTooltip: 'Completeness',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#e8000a',
            fontWeight: '600'
          },
        },
        {
          headerName: 'C Commentary',
          field: 'default_commentary_c',
          editable: true,
          headerTooltip: 'C Commentary',
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'Timeliness',
          field: 'default_dqa_t',
          editable: true,
          headerTooltip: 'Timeliness',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: false,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#3e63dd',
            fontWeight: '600'
          }
        },
        {
          headerName: 'T Commentary',
          field: 'default_commentary_t',
          editable: true,
          headerTooltip: 'T Commentary',
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'Accuracy',
          field: 'default_dqa_a',
          editable: true,
          headerTooltip: 'Accuracy',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'purple',
            fontWeight: '600'
          }
        },
        {
          headerName: 'A Commentary',
          field: 'default_commentary_a',
          editable: true,
          headerTooltip: 'A Commentary',
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
      pinned:'right',
      // flex:1,
      minWidth: 80,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        const saveDataFields = document.createElement('button');
        saveDataFields.title = 'Save';
        saveDataFields.style.border = 'none';
        saveDataFields.style.padding = '0px';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.style.background = 'transparent';

        const saveIcon = createElement(icons.Save, {
          color: '#008236',
          height: '14px',
          strokeWidth: 2
        });
        saveDataFields.appendChild(saveIcon);
    
        // Pass row data or node to save
        saveDataFields.addEventListener('click', () => {
          this.saveDatafieldsDQA(params.node, 'OUTBOUND');
        });
    
      
        div.appendChild(saveDataFields);
    
        return div;
      }
    },
  ];

  columnDefs:(ColDef | ColGroupDef)[]= [
    { field: 'interface_id', headerName: 'Entity ID', editable: false, headerTooltip: 'Entity ID',},
    { field: 'interface_name', headerName: 'Entity Name', editable: false, headerTooltip: 'Entity Name',},
    { field: 'entity_type', headerName: 'Entity Type', editable: false, headerTooltip: 'Entity Type',},
    { field: 'field_id', headerName: 'Field ID', editable: false, headerTooltip: 'Field ID',},
    { field: 'user_generated_id', headerName: 'Field No.', editable: this.isEditable, headerTooltip: 'Field No.',},
    { field: 'field_name', headerName: 'Field Name', editable: this.isEditable, headerTooltip: 'Filed Name',},
    { field: 'data_type', headerName: 'Data Type', editable: this.isEditable,headerTooltip: 'Data Type',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
      },
    },
    { field: 'field_length', headerName: 'Length',
       editable: this.isEditable, headerTooltip: 'Length', },
    {
      headerName: 'DQA',
      headerClass: 'custom-parent-header',
      resizable: true,
      headerTooltip: 'DQA',
      children: [
        {
          headerName: 'C',
          field: 'dqa_c',
          editable: this.isEditable,
          headerTooltip: 'C',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#e8000a',
            fontWeight: '600'
          },
        },
        {
          headerName: 'C Commentary',
          field: 'commentary_c',
          editable: this.isEditable,
          headerTooltip: 'C Commentary',
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
          headerTooltip: 'T',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#3e63dd',
            fontWeight: '600'
          }
        },
        {
          headerName: 'T Commentary',
          field: 'commentary_t',
          editable: this.isEditable,
          headerTooltip: 'T Commentary',
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
          headerTooltip: 'A',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'purple',
            fontWeight: '600'
          }
        },
        {
          headerName: 'A Commentary',
          field: 'commentary_a',
          editable: this.isEditable,
          headerTooltip: 'A Commentary',
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
      ],

    },
    { field: 'criticality', headerName: 'Criticality', editable: this.isEditable,headerTooltip: 'Criticality',
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
      pinned:'right',
      // flex:1,
      minWidth: 80,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        const saveDataFields = document.createElement('button');
        saveDataFields.title = 'Save';
        saveDataFields.style.border = 'none';
        saveDataFields.style.padding = '0px';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.style.background = 'transparent';

        const saveIcon = createElement(icons.Save, {
          color: '#008236',
          height: '14px',
          strokeWidth: 2
        });
        saveDataFields.appendChild(saveIcon);

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
        deleteDataFields.title = 'Delete';
        deleteDataFields.style.border = 'none';
        deleteDataFields.style.padding = '0px';
        deleteDataFields.style.cursor = 'pointer';
        deleteDataFields.style.background = 'transparent';

        const deleteIcon = createElement(icons.Trash2, {
          color: '#c10007',
          height: '14px',
          strokeWidth: 2
        });
        deleteDataFields.appendChild(deleteIcon);
    
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
    { field: 'entity_id', headerName: 'Entity ID', editable: false,headerTooltip: 'Entity ID', resizable: true,},
    { field: 'interface_name', headerName: 'Entity Name', editable: false, headerTooltip: 'Entity Name',resizable: true,},
    { field: 'entity_type', headerName: 'Entity Type', editable: false, headerTooltip: 'Entity Type',resizable: true,},

    { field: 'field_id', headerName: 'Field ID', editable: false, headerTooltip: 'Field ID',resizable: true,},
    { field: 'user_generated_id', headerName: 'Field No.', editable: false, headerTooltip: 'Field No.',resizable: true,},
    { field: 'field_name', headerName: 'Field Name', editable: this.isEditable, headerTooltip: 'Field Name', resizable: true,},
    { field: 'data_type', headerName: 'Data Type', editable: this.isEditable,headerTooltip: 'Data Type',resizable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
      },
    },
    { field: 'field_length', headerName: 'Length', editable: this.isEditable, headerTooltip: 'Length', },
    {
      headerName: 'DQA',
      headerClass: 'custom-parent-header',
      resizable: true,
      headerTooltip: 'DQA',
      children: [
        {
          headerName: 'C',
          field: 'dqa_c',
          editable: true,
          headerTooltip: 'C',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#e8000a',
            fontWeight: '600'
          },
        },
        {
          headerName: 'C Commentary',
          field: 'commentary_c',
          editable: true,
          headerTooltip: 'C Commentary',
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'T',
          field: 'dqa_t',
          editable: true,
          headerTooltip: 'T',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#3e63dd',
            fontWeight: '600'
          }
        },
        {
          headerName: 'T Commentary',
          field: 'commentary_t',
          editable: true,
          headerTooltip: 'T Commentary',
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
        {
          headerName: 'A',
          field: 'dqa_a',
          editable: true,
          headerTooltip: 'A',
          cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
          // width:65,
          // minWidth: 65,
          // maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: 'purple',
            fontWeight: '600'
          }
        },
        {
          headerName: 'A Commentary',
          field: 'commentary_a',
          editable: true,
          headerTooltip: 'A Commentary',
          width:100,
          minWidth: 100,
          maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
        },
      ],

    },
    { field: 'criticality', headerName: 'Criticality', editable: true,resizable: true,
      headerTooltip: 'criticality',
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
      minWidth: 80,
      maxWidth: 120, 
      pinned:'right',
      // flex:1,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        const saveDataFields = document.createElement('button');
        saveDataFields.title = 'Save';
        saveDataFields.style.border = 'none';
        saveDataFields.style.padding = '0px';
        saveDataFields.style.cursor = 'pointer';
        saveDataFields.style.background = 'transparent';

        const saveIcon = createElement(icons.Save, {
          color: '#008236',
          height: '14px',
          strokeWidth: 2
        });
        saveDataFields.appendChild(saveIcon);
    
        // Pass row data or node to save
        saveDataFields.addEventListener('click', () => {
          this.saveDatafields(params.node);
        });
    
        const deleteDataFields = document.createElement('button');
        deleteDataFields.title = 'Delete';
        deleteDataFields.style.border = 'none';
        deleteDataFields.style.padding = '0px';
        deleteDataFields.style.cursor = 'pointer';
        deleteDataFields.style.background = 'transparent';

        const deleteIcon = createElement(icons.Trash2, {
          color: '#c10007',
          height: '14px',
          strokeWidth: 2
        });
        deleteDataFields.appendChild(deleteIcon);
    
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
      pinned:'right', 
      // flex:1,
      minWidth: 80,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        // ==== SAVE ===
        const saveInterface = document.createElement('button');
        saveInterface.title = 'Save';
        saveInterface.style.border = 'none';
        saveInterface.style.padding = '0px';
        saveInterface.style.cursor = 'pointer';
        saveInterface.style.background = 'transparent';

        const saveIcon = createElement(icons.Save, {
          color: '#008236',
          height: '14px',
          strokeWidth: 2
        });
        saveInterface.appendChild(saveIcon);
    
        // Pass row data or node to save
        saveInterface.addEventListener('click', () => {
          this.saveInboundInterface(params.node, 'INBOUND');
        });
    
        // ==== DELETE ====
        const deleteInterface = document.createElement('button');
        deleteInterface.title = 'Delete';
        deleteInterface.style.border = 'none';
        deleteInterface.style.padding = '0px';
        deleteInterface.style.cursor = 'pointer';
        deleteInterface.style.background = 'transparent';

        const deleteIcon = createElement(icons.Trash2, {
          color: '#c10007',
          height: '14px',
          strokeWidth: 2
        });
        deleteInterface.appendChild(deleteIcon);
    
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
      pinned:'right',
      // flex:1,
      minWidth: 80,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
    
        const saveInterface = document.createElement('button');
        saveInterface.title = 'Save';
        saveInterface.style.border = 'none';
        saveInterface.style.padding = '0px';
        saveInterface.style.cursor = 'pointer';
        saveInterface.style.background = 'transparent';

        const saveIcon = createElement(icons.Save, {
          color: '#008236',
          height: '14px',
          strokeWidth: 2
        });
        saveInterface.appendChild(saveIcon);
    
        // Pass row data or node to save
        saveInterface.addEventListener('click', () => {
          this.saveInboundInterface(params.node, 'OUTBOUND');
        });
    
        const deleteInterface = document.createElement('button');
        deleteInterface.title = 'Delete';
        deleteInterface.style.border = 'none';
        deleteInterface.style.padding = '0px';
        deleteInterface.style.cursor = 'pointer';
        deleteInterface.style.background = 'transparent';

        const deleteIcon = createElement(icons.Trash2, {
          color: '#c10007',
          height: '14px',
          strokeWidth: 2
        });
        deleteInterface.appendChild(deleteIcon);
    
        deleteInterface.addEventListener('click', () => {
          this.deleteInboundInterface(params.node, 'OUTBOUND');
        });
    
        div.appendChild(saveInterface);
        div.appendChild(deleteInterface);
    
        return div;
      }
    },
  ];

  // defaultColDef = {
  //   flex: 1,
  //   resizable: true,
  //   filter:true,
  //   suppressSizeToFit: true
  // };
  
defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    suppressSizeToFit: true,
  };

  rowData: any;
  rowDataInboundDQA: any;
  rowDataoutboundDQA: any;
  rowDataInput: any;
  rowDataInbound: any;
  rowDataOutbound: any;
  rowDataOutboundTarget: any;
  rowDataCombined:any;


  cols = [
    { field: 'interface_id', header: 'Interface ID', editable: false },
    { field: 'interface_name', header: 'Interface Name', editable: false },
    { field: 'entity_type', header: 'Entity Type', editable: false },
    { field: 'field_id', header: 'Field ID', editable: false, },
    { field: 'user_generated_id', header: 'Field No.', editable: true },
    { field: 'field_name', header: 'Field Name', editable: this.isEditable, },
    { field: 'data_type', header: 'Data Type', editable: this.isEditable, dropdownValues: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME'] },
    { field: 'field_length', header: 'Field Length', editable: this.isEditable, },
    {
      field: 'dqa_c',
      header: 'C',
      editable: this.isEditable,
      type: 'dropdown',
      tooltip: 'C',
      style: { color: '#e8000a', fontWeight: 600 },
      dropdownValues: ['High', 'Medium', 'Low']
    },
    { field: 'commentary_c', header: 'C Commentary', editable: this.isEditable },
    {
      field: 'dqa_t',
      header: 'T',
      editable: this.isEditable,
      type: 'dropdown',
      tooltip: 'T',
      style: { color: '#3e63dd', fontWeight: 600 },
      dropdownValues: ['High', 'Medium', 'Low']
    },
    { field: 'commentary_t', header: 'T Commentary', editable: this.isEditable },
    {
      field: 'dqa_a',
      header: 'A',
      editable: this.isEditable,
      type: 'dropdown',
      tooltip: 'A',
      style: { color: 'purple', fontWeight: 600 },
      dropdownValues: ['High', 'Medium', 'Low']
    },
    { field: 'commentary_a', header: 'A Commentary', editable: this.isEditable }
  ];

  selectedColumns: any[] = [];
  globalFilterFields: string[] = [];

  
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }
  private focusedCell: CellFocusedEvent | null = null;

  onRowClick(event: any): void {
    // console.log(event.rowIndex);
    this.rowindex = event.rowIndex
    this.focusedCell = event;
    const rowNode = this.gridApi.getDisplayedRowAtIndex(this.rowindex);
 
  }

  addRow() {
    this.cdr.detectChanges();
    const newItem = {entity_type:'SYSTEM', fieldName: '', dataType: '', value: '', description: '' };
    this.rowDataInput = [...this.rowDataInput, newItem];
  }

  // addRow() {
  //   const selectedNode = this.gridApi.getSelectedNodes()[0]; // get selected row node
  //   const newItem = {
  //     entity_type: 'SYSTEM',
  //     fieldName: '',
  //     dataType: '',
  //     value: '',
  //     description: ''
  //   };
  
  //   if (selectedNode) {
  //     // Insert after selected row
  //     const selectedIndex = selectedNode.rowIndex;
  //     const updatedData = [...this.rowDataInput];
  //     updatedData.splice(selectedIndex + 1, 0, newItem); // insert new row after selection
  //     this.rowDataInput = updatedData;
  //   } else {
  //     // If no row selected, add to end
  //     this.rowDataInput = [...this.rowDataInput, newItem];
  //   }
  
  //   // Optional: refresh the grid display
  //   // this.gridApi.setRowData(this.rowDataInput);
  // }

  isCellEditable(col: any, row: any): boolean {
    if (row.entity_type !== 'SYSTEM') {
      return false;
    }
  
    return col.editable;
  }

  isCellEditableOutputDD(col: any, row: any):boolean {
    if (col.field == 'data_type' && row.entity_type !== 'SYSTEM') {
      return false;
    }
    return col.editable;

  }

  isCellEditableOutputInput(col: any, row: any):boolean {
    if (col.field == 'user_generated_id' || col.field == 'field_name' || col.field == 'field_length' && row.entity_type !== 'SYSTEM') {
      return false;
    }
    return col.editable;

  }

  isEditable(params: any): boolean {
    return params.entity_type === 'SYSTEM';
  }

  onRowValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  onDeleteRecord()
  {

  }

  ngOnInit(): void {

    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);

    console.log('Editing system with ID:', this.systemId);
    this.systemForm = this.fb.group({
      system_name:['', Validators.required],
      leanix_id: ['', Validators.required],
      description: ['', Validators.required],
      owner: ['', Validators.required],
      owner_email: ['', [Validators.required, Validators.email]],
      version_number: ['', Validators.required],
      status:['', Validators.required],
    
      // add other form controls as needed
    });
    this.systemId = Number(this.route.snapshot.paramMap.get('id'));
    this.isBacktolineage = Boolean(this.route.snapshot.paramMap.get('isBacktolineage'));
    if(this.isBacktolineage)
    {      
      this.BacktolineagePath=sessionStorage.getItem('BackTolineagePath')?.toString();
    }

    if(this.systemId>0)
    {
      this.addInbound('interfaces')

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

      // this.getDataFields();
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

      this.getUsecaseList();

    //   // Check if use case already selected and saved
      
    // this.savedUseCase = localStorage.getItem('selectedUseCaseSystem');
      
    // if (!this.savedUseCase) {
    //   // Open popup only if no use case saved
    //   setTimeout(() => {
    //     this.openUsecasePopup();
    //   }, 100);
    // } else {
    //   // Restore saved use case
    //   const { useCaseId, useCaseName } = JSON.parse(this.savedUseCase);
    //   this.useCaseId = useCaseId;
    //   this.useCaseName = useCaseName;
    // }
  }
  else{
    this.formLoaded = true; // triggers re-render
  }
      
}

ngAfterViewInit(): void {
  // 🔹 Patch only after view is fully initialized
  if (this.systemData) {
    this.isClone = true;
    this.originalVersion = this.systemData.version_number;
    this.prefillForm(this.systemData);
  }
}

resetRiskLevels()
{
  this.systemService.resetRiskLevel(this.systemId).subscribe(() => {
  
    this.toastNotificationService.success("Risk level reset Successfully.");
    this.is_modified_risk_level = false;
    this.resetRiskBtn = false;
    
    setTimeout(() => {
      this.loadInboundInterfaces(); // refresh
   
    }, 1000);
  });
}

resetFormForClone(): void {
  this.systemForm.reset();
  this.prefillForm(this.systemData);
  this.systemForm.enable();
}

prefillForm(data: any): void {
  this.systemForm.patchValue({
    system_name: data.system_name,
    leanix_id: data.leanix_id,
    description: data.description,
    owner: data.owner,
    owner_email: data.owner_email,
    version_number: data.version_number,
    status: data.status,
    
  });

 
}

checkVersionChange(currentVersion: string): void {
  if (this.isClone) {
    if (!currentVersion || currentVersion === this.originalVersion) {
      this.systemForm.get('version_number')?.setErrors({ versionUnchanged: true });
    } else {
      this.systemForm.get('version_number')?.setErrors(null);
    }
  }
}

  getUsecaseList() {
    this.usecaseService.getLineageUsecase('SYSTEM',this.systemId).subscribe({
      next: (usecases: any[]) => {
        // const usecaseEntities = usecases.map(data => ({
        //   ...data.useCaseEntity
        // }));
  
        // const useCaseIds = usecaseEntities.map(u => u.use_case_id);
        this.useCases = usecases;
      
      },
      error: err => {
        console.error('Error fetching usecases:', err);
      }
    });
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

        // if (this.gridApi) {
        //   this.gridApi.setRowData([]); // Clear first to ensure refresh
        //   this.gridApi.setRowData(this.rowData);
        // }
  
        this.cdr.detectChanges(); // trigger Angular change detection
       
      },
      error: (err: any) => {
        this.rowData=[];
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
    // this.cdr.detectChanges();
    this.getDataFields();
    this.loadInboundInterfaces();

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
    // this.cdr.detectChanges();
    this.getDataFields();
    this.loadInboundInterfaces();

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

   selectUseCase(view: string)
    {
      this.activeView = view;
      this.getUsecaseList();
      setTimeout(() => {
        this.openUsecasePopup();

      }, 100);
    }
    @ViewChild('useCasePopup') useCasePopup!: TemplateRef<any>;
    dialogRef!: MatDialogRef<any>;

  
    openUsecasePopup() {
      this.dialogRef = this.dialog.open(this.useCasePopup, {
        disableClose: false, // optional, prevent closing without selection
      });
    }
    
    confirmUseCase() {
      if (!this.useCaseModel) {
        alert('Please select a use case first.');
        return;
      }
    
      // Split the value into ID and Name
      const [useCaseId, useCaseName] = this.useCaseModel.toString().split('|');
    
      // Save them into separate variables
      this.useCaseId = parseInt(useCaseId);
      this.useCaseName = useCaseName;
    
      // console.log('Use Case ID:', this.useCaseId);
      // console.log('Use Case Name:', this.useCaseName);
    
      // ✅ Save to localStorage so popup doesn’t appear again
      localStorage.setItem(
        'selectedUseCaseSystem',
        JSON.stringify({
          useCaseId: this.useCaseId,
          useCaseName: this.useCaseName
        })
      );
    
      // ✅ Close the dialog
      this.dialogRef.close();
    }
  
  // ✅ Trigger update/save logic
 onUpdate(): void {
  console.log('Form data:', this.systemForm.value);

  if (!this.systemForm.valid) {
    this.systemForm.markAllAsTouched();
    return;
  }

  const formValue = this.systemForm.value;

  // Base payload structure
  const payload: any = {
    systemEntity: {
      system_name: formValue.system_name,
      leanix_id: formValue.leanix_id,
      description: formValue.description,
      owner: formValue.owner,
      owner_email: formValue.owner_email,
      version_number: formValue.version_number,
      status: formValue.status
    }
  };

  const isUpdate = this.systemId > 0;
  if (isUpdate) {
    payload.systemEntity.system_id = this.systemId;
  }
  else
  {
    if (this.isClone && this.systemForm.value.version_number === this.originalVersion) {
      this.toastNotificationService.error('Please change the version number before saving the cloned system.');
     
      return;
    }
  }

  // const request$ = isUpdate
  //   ? this.systemService.updateSystem(payload)
  //   : this.systemService.createSystem(payload);

  // request$.subscribe({
  //   next: (res) => {
  //     if (res) {
  //       const systemId = isUpdate ? this.systemId : res.systemEntity.system_id;
  //       const action = isUpdate ? 'Updated' : 'Created';
  //       this.toastNotificationService.success(`System ${action} Successfully. Your System ID is ${systemId}.`);

  //       if (!isUpdate) {
  //         this.router.navigate(['/systems/edit-system', systemId]);
  //       }
  //     }
  //   },
  //   error: (err) => {
  //     console.error('Error in system operation:', err);
  //     this.toastNotificationService.error('An error occurred while saving the system.');
  //   }
  // });


   // Choose appropriate API call
   let request$: Observable<any>;

   if (this.isClone) {
     // 🔁 Clone case
     request$ = this.systemService.cloneSystemDatafields(
       payload,
       'systems',
       this.paentInterfaceId
     );
   } else if (isUpdate) {
     // ✏️ Update case
     request$ = this.systemService.updateSystem(payload);
   } else {
     // 🆕 Create case
     request$ = this.systemService.createSystem(payload);
   }
   

 // ✅ Subscribe only once
request$.subscribe({
  next: (res: any) => {
    if (this.isClone) {
      // Handle Clone Success
      this.toastNotificationService.success(
        `System cloned successfully. Your System ID is ${res.systemEntity.system_id}`
      );
      this.toastNotificationService.success('Datafields cloned successfully.');
      this.router.navigate(['/systems/edit-system', res.systemEntity.system_id]);
      return;
    }

    // Handle Create/Update Success
    const systemID = isUpdate ? this.systemId : res.systemEntity.system_id;
    const action = isUpdate ? 'Updated' : 'Created';
    this.toastNotificationService.success(
      `System ${action} successfully. Your System ID is ${systemID}`
    );

    // 🔁 If you only need to clone *after* creating, handle it separately:
    // if (!isUpdate && !this.isClone) {
    //   this.systemService
    //     .cloneSystemDatafields(payload, 'systems', this.paentInterfaceId)
    //     .subscribe({
    //       next: (cloneRes) => {
    //         this.toastNotificationService.success('Datafields cloned successfully.');
    //         this.router.navigate(['/systems/edit-system', cloneRes.systemEntity.system_id]);
    //       },
    //       error: () =>
    //         this.toastNotificationService.error('Failed to clone datafields.')
    //     });
    // }
  },
  error: (err) => {
    const action = isUpdate
      ? 'update'
      : this.isClone
      ? 'clone'
      : 'create';
    this.toastNotificationService.error(`Failed to ${action} system.`);
    console.error('❌ API Error:', err);
  }
});
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
      } // Force refresh with setRowData
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
  this.dataFieldsModel.entity_id = this.systemId;
  this.dataFieldsModel.field_id = data.field_id;
  this.dataFieldsModel.user_generated_id = data.user_generated_id;
  this.dataFieldsModel.field_name = data.field_name;
  this.dataFieldsModel.dqa_c = data.dqa_c;
  this.dataFieldsModel.dqa_t = data.dqa_t;
  this.dataFieldsModel.dqa_a = data.dqa_a;
  this.dataFieldsModel.commentary_a = data.commentary_a;
  this.dataFieldsModel.commentary_t = data.commentary_t;
  this.dataFieldsModel.commentary_c = data.commentary_c;
  this.dataFieldsModel.data_type = data.data_type;
  this.dataFieldsModel.field_length = data.field_length;
  this.dataFieldsModel.criticality = data.criticality;
  this.dataFieldsModel.entity_type = data.entity_type;
  this.dataFieldsModel.usecaseid = this.useCaseId;
  // this.dataFieldsModel.entity_id = data.entity_id;
 
      // alert("Data field added Successfully.");
      if(!data.field_id)
      {
        this.datafieldsService.createDataFields(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Data field added Successfully.");
        setTimeout(() => {
          this.loadInboundInterfaces(); // refresh
  
        }, 1000);
      });
    }
      else
      {
        this.datafieldsService.updateInterface(this.dataFieldsModel).subscribe(() => {

          this.toastNotificationService.success("Data field updated Successfully.");
          setTimeout(() => {
            this.loadInboundInterfaces(); // refresh
    
          }, 1000);
        });
      }
  }

  deleteDAtaFields(data:any)
  {  
    this.datafieldsService.deleteDataFields(data.field_id, 'SYSTEM', this.systemId).subscribe(() => {
      // alert("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
      this.toastNotificationService.error("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.field_id);
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

    this.openLineagePopup();
    this.cdr.detectChanges();
  }

  openLineagePopup() {
    const dialogRef = this.dialog.open(CreateLineageComponent, {
      width: '94vw',       // adjust width
      height: '84vh',      // adjust height
      data: {
        inboundFields: this.inboundFields,
        outboundFields: this.outboundFields,
        systemId: this.systemId
      }
    });

      // 👇 you can also listen when it closes
  dialogRef.afterClosed().subscribe(result => {
    console.log('Lineage dialog closed', result);
  });
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
            this.toastNotificationService.error("Inbound Interface Deleted Successfully for System ID"+ this.systemId);
          }
          else
          {
            // alert("Outbound Interface Saved Successfully for System ID"+ this.systemId);
            this.toastNotificationService.error("Outbound Interface Deleted Successfully for System ID"+ this.systemId);
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

          this.is_modified_risk_level = interfaceDataFields[0].is_modified_risk_level;
          if(this.is_modified_risk_level == true)
          {
          this.resetRiskBtn = true; 
        }
  
          const parsedOutboundInterfaces = JSON.parse(interfaceDataFields[0]?.outbound_interfaces || '[]');

          // Assuming you have only one object in the array (as per your example)
          const rawData = interfaceDataFields[0]; // replace with your actual variable

          const inboundInterfaces = JSON.parse(rawData.inbound_interfaces || '[]');
          const outboundInterfaces = JSON.parse(rawData.outbound_interfaces || '[]');
          const systemFields = JSON.parse(rawData.system_fields || '[]');


          // Wrap system fields in an "interface-like" object so it matches inbound structure
          const systemAsInterface = {
            interface_id: rawData.system_id,
            interface_name: rawData.system_name,
            source: 'System',
            fields: systemFields.map((f: any) => ({
              ...f,
              entity_type: 'SYSTEM',
              interface_id: rawData.system_id,
              interface_name: rawData.system_name
            }))
          };

          const parsedInboundInterfacesforMapping = [systemAsInterface, ...inboundInterfaces];
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
            if (Array.isArray(intf?.fields) && intf.fields.length > 0) {
              intf.fields.forEach((field: any) => {
                combinedFields.push({
                  ...field,
                  interface_name: intf.interface_name,
                  interface_id: intf.interface_id,
                  source: 'Outbound'
                });
              });
            } else {
              console.warn(`No fields found for interface: ${intf.interface_name || '(Unnamed Interface)'}`);
            }
          });
    

        
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
  

          let combinedFieldsOut: any[] = [];

          outboundInterfaces.forEach((intf: any) => {
            // Proceed only if fields exist and are an array
            if (Array.isArray(intf?.fields) && intf.fields.length > 0) {
              intf.fields.forEach((field: any) => {
                combinedFieldsOut.push({
                  ...field,
                  interface_name: intf.interface_name,
                  interface_id: intf.interface_id,
                  source: 'Outbound'
                });
              });
            } else {
              console.warn(`No fields found for interface: ${intf.interface_name || '(Unnamed Interface)'}`);
            }
          });

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

          // Refresh grid
          if (this.gridApi) {
            // this.gridApi.setRowData([]);
            this.gridApi.setRowData(this.rowDataInput);
            // this.gridApi.setRowData(this.rowDataInbound);
            // this.gridApi.setRowData(this.rowDataOutbound);
          }


          this.inboundFields = [];
          this.outboundFields = [];
          this.combinedFields = [];


          // 🔄 Flatten inbound
        parsedInboundInterfacesforMapping.forEach((intf: any) => {
          if (intf?.fields && Array.isArray(intf.fields)) {
            intf.fields.forEach((field: any) => {
              if (field) { // handle null field objects too
                this.inboundFields.push({
                  interface: intf.interface_name,
                  fieldId: field.field_id,
                  entityType: field.entity_type,
                  fieldName: field.field_name,
                  dataType: field.data_type,
                  length: field.field_length,
                });
              }
            });
          }
        });

        // 🔄 Flatten outbound
        parsedOutboundInterfaces.forEach((intf: any) => {
          if (intf?.fields && Array.isArray(intf.fields)) {
            intf.fields.forEach((field: any) => {
              if (field) {
                this.outboundFields.push({
                  interface: intf.interface_name,
                  fieldId: field.field_id,
                  entityType: field.entity_type,
                  fieldName: field.field_name,
                  dataType: field.data_type,
                  length: field.field_length,
                });
              }
            });
          }
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
    
    // loadInboundInterfaces() {
  //   const interfaces$ = this.interfaceService.getInterface();
  //   const interfaceDataFields$ = this.interfaceService.getInboundData(this.systemId);
  //   const dqaRiskData$ = this.datafieldsService.getDataFieldsByIdWithUsecase(
  //     this.systemId,
  //     'SYSTEM',
  //     this.useCaseId
  //   );
  
  //   forkJoin([interfaces$, interfaceDataFields$, dqaRiskData$]).subscribe({
  //     next: ([interfaces, interfaceDataFields, dqaRiskData]: [any[], any[], any[]]) => {
  //       try {
  //         /** STEP 1️⃣ — Populate dropdown from getInterface() **/
  //         if (interfaces?.length > 0) {
  //           this.interfaceOptionList = interfaces.map(
  //             (item: { interfaceEntity: { interface_id: any; interface_name: any } }) =>
  //               `${item.interfaceEntity.interface_id} - ${item.interfaceEntity.interface_name}`
  //           );
  //         }
  
  //         /** STEP 2️⃣ — Parse inbound/outbound/system data **/
  //         const rawData = interfaceDataFields[0];
  //         const inboundInterfaces = JSON.parse(rawData.inbound_interfaces || '[]');
  //         const outboundInterfaces = JSON.parse(rawData.outbound_interfaces || '[]');
  //         const systemFields = JSON.parse(rawData.system_fields || '[]');
  
  //         /** STEP 3️⃣ — Combine system as interface for inbound **/
  //         const systemAsInterface = {
  //           interface_id: rawData.system_id,
  //           interface_name: rawData.system_name,
  //           source: 'System',
  //           fields: systemFields.map((f: any) => ({
  //             ...f,
  //             entity_type: 'SYSTEM',
  //             interface_id: rawData.system_id,
  //             interface_name: rawData.system_name
  //           }))
  //         };
  
  //         const parsedInboundInterfacesforMapping = [systemAsInterface, ...inboundInterfaces];
  
  //         /** STEP 4️⃣ — Merge inbound/outbound fields **/
  //         let combinedFields: any[] = [];
  
  //         // System
  //         systemFields.forEach((field: any) => {
  //           combinedFields.push({
  //             ...field,
  //             interface_name: rawData.system_name,
  //             interface_id: rawData.system_id,
  //             source: 'System'
  //           });
  //         });
  
  //         // Inbound
  //         inboundInterfaces.forEach((intf: any) => {
  //           intf.fields.forEach((field: any) => {
  //             combinedFields.push({
  //               ...field,
  //               interface_name: intf.interface_name,
  //               interface_id: intf.interface_id,
  //               source: 'Inbound'
  //             });
  //           });
  //         });
  
  //         // Outbound
  //         outboundInterfaces.forEach((intf: any) => {
  //           intf.fields.forEach((field: any) => {
  //             combinedFields.push({
  //               ...field,
  //               interface_name: intf.interface_name,
  //               interface_id: intf.interface_id,
  //               source: 'Outbound'
  //             });
  //           });
  //         });

  //                 this.outboundInterfaceList = outboundInterfaces;

  //                 this.rowData =[].concat(
  //                               ...outboundInterfaces.map((i: any) =>
  //                                 i.fields.map((field: any) => ({
  //                                   ...field,
  //                                   interface_name: i.interface_name,
  //                                   interface_id: i.interface_id
  //                                 }))
  //                               )
  //                             );
  
  //         /** STEP 5️⃣ — Merge DQA risk levels (from new API) **/
  //         combinedFields = combinedFields.map((field: any) => {
  //           const matchedRisk = dqaRiskData.find(
  //             (r: any) => r.field_id === field.field_id
  //           );
  //           if (matchedRisk) {
  //             return {
  //               ...field,
  //               dqa_a: matchedRisk.accuracy_risk,
  //               commentary_a: matchedRisk.accuracy_risk_comment,
  //               dqa_c: matchedRisk.completeness_risk,
  //               commentary_c: matchedRisk.completeness_risk_comment,
  //               dqa_t: matchedRisk.timeliness_risk,
  //               commentary_t: matchedRisk.timeliness_risk_comment
  //             };
  //           }
  //           return field;
  //         });
  
  //         /** STEP 6️⃣ — Bind to grid/UI **/
  //         this.rowDataInput = combinedFields;
  
  //         // Example binding to grid:
  //         if (this.gridApi) {
  //           this.gridApi.setRowData([]);
  //           this.gridApi.setRowData(this.rowDataInput);
  //         }
  
  //         this.cdr.detectChanges();
  //       } catch (e) {
  //         console.error('Error parsing interface data:', e);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Failed to load interface or inbound data:', err);
  //     }
  //   });
  // }

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
  
  onBack() {
    this.router.navigate(['/systems']);
  }
  onBackToLineage()
  {
     this.router.navigate(JSON.parse(this.BacktolineagePath));
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