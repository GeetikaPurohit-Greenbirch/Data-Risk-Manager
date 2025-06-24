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
export class EditSystemComponent implements AfterViewInit{
 systemForm!: FormGroup;
  systemModel : SystemsModel = new SystemsModel();
  showDataFieldsTable = false;
  showDataFields = false;
  showInbound = false;
  showoutbound = false;
  showsystemMapping = false;
  // ✅ DataFields table data
  dataFields: any[] = [
    { fieldId: 1, fieldName: 'A', dataType: 'Num' },
    { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  ];

  @ViewChild('paperContainer', { static: false }) paperContainer!: ElementRef;

  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  private elementsMap: { [id: string]: joint.dia.Element } = {};
  
  inboundFields: any[] = [];
  outboundFields:any[] = [];
  links: any[] = []; // Store link data
  
 
  

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
        private interfaceService: InterfaceService,
        private targetService : TargetService,

  ) {}


  columnDefs:(ColDef | ColGroupDef)[]= [
    { field: 'field_id', headerName: 'Field ID', editable: false, },
    { field: 'entity_type', headerName: 'Entity Type', editable: false, },
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
          headerName: 'C Commentary',
          field: 'commentary_p',
          editable: true,
          width:100,
          minWidth: 100,
          maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,
         
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
        },
        {
          headerName: 'A Commentary',
          field: 'commentary_a',
          editable: true,
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
    
        deleteDataFields.addEventListener('click', () => {
          this.deleteDAtaFields(params.node);
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
    
        // const deleteDataFields = document.createElement('button');
        // deleteDataFields.className = 'fa fa-trash';
        // deleteDataFields.style.color = 'red';
        // deleteDataFields.style.border = '1px solid lightGrey';
        // deleteDataFields.style.borderRadius = '5px';
        // deleteDataFields.style.lineHeight = '22px';
        // deleteDataFields.style.height = '32px';
        // deleteDataFields.style.cursor = 'pointer';
        // deleteDataFields.title = 'Delete';
    
        // deleteDataFields.addEventListener('click', () => {
        //   // this.deleteDAtaFields(params.node);
        // });
    
        div.appendChild(saveInterface);
        // div.appendChild(deleteDataFields);
    
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
    
        // const deleteDataFields = document.createElement('button');
        // deleteDataFields.className = 'fa fa-trash';
        // deleteDataFields.style.color = 'red';
        // deleteDataFields.style.border = '1px solid lightGrey';
        // deleteDataFields.style.borderRadius = '5px';
        // deleteDataFields.style.lineHeight = '22px';
        // deleteDataFields.style.height = '32px';
        // deleteDataFields.style.cursor = 'pointer';
        // deleteDataFields.title = 'Delete';
    
        // deleteDataFields.addEventListener('click', () => {
        //   // this.deleteDAtaFields(params.node);
        // });
    
        div.appendChild(saveInterface);
        // div.appendChild(deleteDataFields);
    
        return div;
      }
    },
  ];

  // combinedColumnDefs: ColDef[] = [
  //   {
  //     field: 'source',
  //     headerName: 'Interface / Target',
  //     editable: true,
  //     cellEditor: 'agSelectCellEditor',
  //     cellEditorParams: () => {
  //       return {
  //         values: this.combinedOptions
  //       };
  //     }
  //   },
  //   {
  //     headerName: 'Actions',
  //     editable: false,
  //     filter: false,
  //     sortable: false,
  //     minWidth: 100,
  //     flex: 1,
  //     cellRenderer: (params: any) => {
  //       const div = document.createElement('div');
  //       div.className = 'model-cell-renderer';
  
  //       const saveBtn = document.createElement('button');
  //       saveBtn.className = 'fa fa-save';
  //       saveBtn.style.color = 'green';
  //       saveBtn.style.border = '1px solid lightGrey';
  //       saveBtn.style.borderRadius = '5px';
  //       saveBtn.style.lineHeight = '22px';
  //       saveBtn.style.height = '32px';
  //       saveBtn.style.cursor = 'pointer';
  //       saveBtn.title = 'Save';
  
  //       saveBtn.addEventListener('click', () => {
  //         this.saveInboundInterface(params.node);
  //       });
  
  //       div.appendChild(saveBtn);
  //       return div;
  //     }
  //   }
  // ];
  
  // outBoundTargetColumnDefs:(ColDef)[]= [
  //   { field: 'target', headerName: 'Target', editable: true,
  //     cellEditor: 'agSelectCellEditor',
  //   cellEditorParams: (params: any) => {
  //     return {
  //       values: this.targetOptionList
  //     };
  //   }
  //   },
  //   {
  //     headerName: 'Actions',
  //     editable: false,
  //     filter: false,
  //     sortable: false,
  //     minWidth: 100, 
  //     flex:1,
  //     cellRenderer: (params: any) => {
  //       const div = document.createElement('div');
  //       div.className = 'model-cell-renderer';
    
  //       const saveInterface = document.createElement('button');
  //       saveInterface.className = 'fa fa-save';
  //       saveInterface.style.color = 'green';
  //       saveInterface.style.border = '1px solid lightGrey';
  //       saveInterface.style.borderRadius = '5px';
  //       saveInterface.style.lineHeight = '22px';
  //       saveInterface.style.height = '32px';
  //       saveInterface.style.cursor = 'pointer';
  //       saveInterface.title = 'Save';
    
  //       // Pass row data or node to save
  //       saveInterface.addEventListener('click', () => {
  //         this.saveInboundInterface(params.node);
  //       });
    
  //       // const deleteDataFields = document.createElement('button');
  //       // deleteDataFields.className = 'fa fa-trash';
  //       // deleteDataFields.style.color = 'red';
  //       // deleteDataFields.style.border = '1px solid lightGrey';
  //       // deleteDataFields.style.borderRadius = '5px';
  //       // deleteDataFields.style.lineHeight = '22px';
  //       // deleteDataFields.style.height = '32px';
  //       // deleteDataFields.style.cursor = 'pointer';
  //       // deleteDataFields.title = 'Delete';
    
  //       // deleteDataFields.addEventListener('click', () => {
  //       //   // this.deleteDAtaFields(params.node);
  //       // });
    
  //       div.appendChild(saveInterface);
  //       // div.appendChild(deleteDataFields);
    
  //       return div;
  //     }
  //   },
  // ];

  defaultColDef = {
    flex: 1,
    resizable: true,
    filter:true,
    suppressSizeToFit: true
  };

  rowData: any;
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
    const newItem = { fieldName: '', dataType: '', value: '', description: '' };
    this.rowData = [...this.rowData, newItem];
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
      this.getDataFields();
      // this.getInboundInterface();
      this.loadInboundInterfaces();
      this.rowDataInbound = [{}];
      this.rowDataOutbound = [{}]; // Initialize with one blank row
      this.getOutboundTarget();
      this.rowDataOutboundTarget = [{}];
      this.loadDropdownOptions();
      this.rowDataCombined = [{}];
      // this.getInboundInterfaceData();

  }


  ngAfterViewInit(): void {
    this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
  
    this.paper = new joint.dia.Paper({
      el: this.paperContainer.nativeElement,
      model: this.graph,
      width: 1000,
      height: 600,
      gridSize: 10,
      // interactive: true,
      interactive: (cellView) => {
        const cell = cellView.model;
    
        // ✅ Check for custom tag
        if (cell.get('customType') === 'inbound') {
          return { elementMove: false }; // disable movement
        }
    
        return true; // allow interaction for all others
      },
      linkPinning: false,
      snapLinks: { radius: 75 },
      defaultConnector: { name: 'rounded' },
      defaultConnectionPoint: { name: 'boundary' },
      defaultLink: () =>
        new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#5c9ded',
              strokeWidth: 2,
              targetMarker: {
                type: 'path',
                d: 'M 10 -5 0 0 10 5 z',
              },
            },
          },
        }),
    });
  
    this.renderFields();
  
    // 🔗 Listen for link creation
    this.paper.on('link:connect', (linkView: any) => {
      const sourceId = linkView.model.get('source').id;
      const targetId = linkView.model.get('target').id;
  
      const sourceElement = this.graph.getCell(sourceId) as joint.dia.Element;
      const targetElement = this.graph.getCell(targetId) as joint.dia.Element;
  
      const from = sourceElement?.attributes?.attrs?.['label']?.text;
      const to = targetElement?.attributes?.attrs?.['label']?.text;
  
      if (from && to) {
        this.links.push({ from, to });
        console.log('🔗 New mapping:', from, '→', to);
      }
    });
  
    // 🧹 Optional: delete link on double click
    this.paper.on('link:pointerdblclick', (linkView: any) => {
      linkView.model.remove();
    });
  }
  
  renderFields(): void {
    const leftX = 50;
    const rightX = 800;
    const startY = 50;
    const spacing = 80;

    this.graph.clear(); // clear previous elements
    this.elementsMap = {}; // reset map
    this.links = []; // clear saved links
  
  
    this.inboundFields.forEach((field, i) => {
      const label = `${field.interface} | ${field.fieldName}`;
      const rect = new joint.shapes.standard.Rectangle({
        position: { x: leftX, y: startY + i * spacing },
        size: { width: 150, height: 40 },
        attrs: {
          body: { fill: '#d1e8ff', stroke: '#333' },
          label: { text: label, fill: '#000' },
        },
        ports: {
          groups: {
            out: {
              position: 'right',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#000',
                  fill: '#fff',
                },
              },
            },
          },
          items: [{ id: 'out', group: 'out' }],
        },
      });

      // ✅ Tag this element as inbound
      rect.set('customType', 'inbound');

      rect.addTo(this.graph);
      this.elementsMap['in-' + i] = rect;
    });
  
    this.outboundFields.forEach((field, i) => {
      const label = `${field.interface} | ${field.fieldName}`;
      const rect = new joint.shapes.standard.Rectangle({
        position: { x: rightX, y: startY + i * spacing },
        size: { width: 150, height: 40 },
        attrs: {
          body: { fill: '#d1ffd1', stroke: '#333' },
          label: { text: label, fill: '#000' },
        },
        ports: {
          groups: {
            in: {
              position: 'left',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#000',
                  fill: '#fff',
                },
              },
            },
          },
          items: [{ id: 'in', group: 'in' }],
        },
      });
      rect.addTo(this.graph);
      this.elementsMap['out-' + i] = rect;
    });
  }
  
  saveMappings(): void {
    console.log('💾 Saved Mappings:', this.links);
    alert('Mappings saved. '+  this.links[0].from +' - '+ this.links[0].to +' || '+ this.links[1].from +' - '+ this.links[1].to+' || '+ this.links[2].from +' - '+ this.links[2].to+' || '+ this.links[3].from +' - '+ this.links[3].to+' || '+ this.links[4].from +'-'+ this.links[4].to);
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

  addDatafields()
  {
    this.showDataFieldsTable = true;
    this.showDataFields = true;
    this.showInbound = false;
    this.showoutbound = false;
    this.showsystemMapping = false;
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

  this.dataFieldsModel.field_id = data.data.field_id;
  this.dataFieldsModel.field_name = data.data.field_name;
  this.dataFieldsModel.dqa_c = "L";
  this.dataFieldsModel.dqa_t = "L";
  this.dataFieldsModel.dqa_a = "L";
  this.dataFieldsModel.commentary_a = data.data.commentary_a;
  this.dataFieldsModel.commentary_t = data.data.commentary_t;
  this.dataFieldsModel.commentary_p = data.data.commentary_p;
  this.dataFieldsModel.data_type = data.data.data_type;
  this.dataFieldsModel.field_length = data.data.field_length;
  this.dataFieldsModel.criticality = data.data.criticality;
  this.dataFieldsModel.entity_type = 'SYSTEM';
  this.dataFieldsModel.entity_id = this.systemId;
 
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
      this.toastNotificationService.success("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
      setTimeout(() => {
        this.getDataFields(); // refresh

      }, 1000);
  })
  }

  addInbound()
  {
    this.showDataFieldsTable = true;
    this.showDataFields = false;
    this.showInbound = true;
    this.showoutbound = false;
    this.showsystemMapping = false;
    // this.getInboundInterfaceData();
  }

  addOutBound()
  {
    this.showDataFieldsTable = true;
    this.showDataFields = false;
    this.showInbound = false;
    this.showoutbound = true;
    this.showsystemMapping = false;
  }

  sysMapping()
  {
    this.showDataFieldsTable = true;
    this.showDataFields = false;
    this.showInbound = false;
    this.showoutbound = false;
    this.showsystemMapping = true;
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
   
      this.interfaceService.saveInboundInterface(payload).subscribe(res => {
        if(res)
        {
          // const response = JSON.stringify(res)
          // this.rowDataInbound = response
          if(interface_type === 'INBOUND')
          {
            alert("Inbound Interface Saved Successfully for System ID"+ this.systemId);
            this.toastNotificationService.success("Inbound Interface Saved Successfully for System ID"+ this.systemId);
          }
          else
          {
            alert("Outbound Interface Saved Successfully for System ID"+ this.systemId);
            this.toastNotificationService.success("Outbound Interface Saved Successfully for System ID"+ this.systemId);
          }
        }
      })
  }


  // getInboundInterfaceData() {
  //   this.interfaceService.getInboundData(this.systemId).subscribe({
  //     next: (res: any) => {
  //       try {
  //         const parsedInboundInterfaces = JSON.parse(res[0]?.inbound_interfaces || '[]');
  
  //         // ✅ Set dropdown values
  //         this.interfaceOptionList = parsedInboundInterfaces.map((item: any) => {
  //           return `${item.interface_id} - ${item.interface_name}`;
  //         });
  
  //         // ✅ Flatten interface fields (if needed to show in rowDataInbound)
  //         this.rowDataInbound = parsedInboundInterfaces.flatMap((item: any) =>
  //           item.fields.map((field: any) => ({
  //             ...field,
  //             interface: `${item.interface_id} - ${item.interface_name}` // optional if you want to show in grid
  //           }))
  //         );
          
  //         // this.rowDataOutbound = parsedOutboundInterfaces;
  
  //         // ✅ Refresh grid
  //         if (this.gridApi) {
  //           this.gridApi.setRowData([]); // clear first
  //           this.gridApi.setRowData(this.rowDataInbound);
  //         }
  
  //         this.cdr.detectChanges(); // trigger change detection
  //       } catch (e) {
  //         console.error('Error parsing interface data:', e);
  //       }
  //     },
  //     error: (err: any) => {
  //       console.error('Failed to load interface:', err);
  //     }
  //   });
  // }
  

  loadInboundInterfaces() {
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
            this.rowDataInbound = parsedInboundInterfaces.flatMap((item: any) =>
              item.fields.map((field: any) => ({
                ...field,
                interface: `${item.interface_id} - ${item.interface_name}`
              }))
            );
          } else {
            // Fallback: show one blank row if no data
            this.rowDataInbound = [{}];
          }
  
          const parsedOutboundInterfaces = JSON.parse(interfaceDataFields[0]?.outbound_interfaces || '[]');

          // Assuming you have only one object in the array (as per your example)
          const rawData = interfaceDataFields[0]; // replace with your actual variable

          const inboundInterfaces = JSON.parse(rawData.inbound_interfaces || '[]');
          const systemFields = JSON.parse(rawData.system_fields || '[]');

          let combinedFields: any[] = [];

          // From system_fields
          systemFields.forEach((field: any) => {
            combinedFields.push({
              ...field,
              interface_name: rawData.system_name,
              source: 'System'
            });
          });

          // From inbound_interfaces
          inboundInterfaces.forEach((intf: any) => {
            intf.fields.forEach((field: any) => {
              combinedFields.push({
                ...field,
                interface_name: intf.interface_name,
                source: 'Inbound'
              });
            });
          });

          this.rowData = combinedFields;

          if (parsedOutboundInterfaces?.length > 0) {
            this.rowDataOutbound = parsedOutboundInterfaces.flatMap((item: any) =>
              item.fields.map((field: any) => ({
                ...field,
                interface: `${item.interface_id} - ${item.interface_name}`
              }))
            );
          } else {
            // Fallback: show one blank row if no data
            this.rowDataOutbound = [{}];
          }
  
          // Refresh grid
          if (this.gridApi) {
            this.gridApi.setRowData([]);
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
              fieldName: field.field_name,
              dataType: field.data_type,
              length: field.field_length,
            });
          });
        });

          // 🔄 Now render fields on the diagram

        this.renderFields();
  
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