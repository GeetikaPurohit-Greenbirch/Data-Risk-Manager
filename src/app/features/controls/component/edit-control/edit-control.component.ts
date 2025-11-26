import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { createElement, icons } from 'lucide';

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
  statusOptions = ['NEW',
    'DRAFT',
    'READY_FOR_REVIEW',
    'RISK_ASSESSMENT',
    'APPROVED',
    'REJECTED',
    'IN_DEV',
    'IN_TEST',
    'READY_FOR_PRODUCTION',
    'IN_PRODUCTION',
    'ARCHIVED'];
  applicationStatusOptions = ['TARGET', 'PLANNED', 'COMMITTED', 'DELAYED'];
  filteredAttachToIdOptions: { id: number, name: string }[] = [];
  attachTo!: string;
  attachToId!: number;
  activeView!: string; // default view on load
  formLoaded = false;
  dataFieldsModel: Datafields = new Datafields();
  isBacktolineage=false;
  BacktolineagePath: any ="";
  showGlobalQualityRisk = false;
  rowDataDQA: any;

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
    private router: Router,
  ) { }


  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'field_id', headerName: 'Field ID', editable: false, headerTooltip: 'Field ID' },
    { field: 'field_name', headerName: 'Field Name', editable: false, headerTooltip: 'Field Name' },
    { field: 'entity_id', headerName: 'Entity ID', editable: false, headerTooltip: 'Entity ID' },
    // { field: 'interface_name', headerName: 'Entity Name', editable: false, },
    { field: 'entity_type', headerName: 'Entity Type', editable: false, headerTooltip: 'Entity Type' },
    { field: 'field_length', headerName: 'Field Length', editable: false, headerTooltip: 'Field Length' },
    { field: 'field_description', headerName: 'Field Description', editable: false, headerTooltip: 'Field Description' },


    // { field: 'data_type', headerName: 'Data Type', editable: true,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: {
    //     values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
    //   },
    // },
    // {
    //   headerName: 'Before Control Completeness',
    //   field: 'dqa_c',
    //   editable: false,
    //   // valueGetter: () => 'L', // Always returns 'L'
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: {
    //     values: ["H", "M", "L"],
    //   },
    //   // width:65,
    //   // minWidth: 65,
    //   // maxWidth: 65,
    //   resizable: true,
    //   suppressSizeToFit: true,
    //   cellStyle: {
    //     color: 'red',
    //     fontWeight: 'bold'
    //   },
    // },
    // { field: 'commentary_p', headerName: 'Completeness Commentary', editable: false },
    {
      field: 'post_control_dqa_c', headerName: 'After Control Completeness', editable: true, headerTooltip: 'Post Control Completeness',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
      cellStyle: {
        color: 'red',
        fontWeight: '600'
      },
    },
    // {
    //   headerName: 'Before Control Timeliness',
    //   field: 'dqa_t',
    //   editable: false,
    //   // valueGetter: () => 'L', // Always returns 'L'
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: {
    //     values: ["H", "M", "L"],
    //   },
    //   // width:65,
    //   // minWidth: 65,
    //   // maxWidth: 65,
    //   resizable: true,
    //   suppressSizeToFit: true,
    //   cellStyle: {
    //     color: 'blue',
    //     fontWeight: 'bold'
    //   }
    // },
    // { field: 'commentary_t', headerName: 'Timeliness Commentary', editable: false },
    {
      field: 'post_control_dqa_t', headerName: 'After Control Timeliness', editable: true, headerTooltip: 'Post Control Timliness',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
      cellStyle: {
        color: 'blue',
        fontWeight: '600'
      },
    },
    // {
    //   headerName: 'After Control Accuracy',
    //   field: 'dqa_a',
    //   editable: false,
    //   // valueGetter: () => 'L', // Always returns 'L'
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: {
    //     values: ["H", "M", "L"],
    //   },
    //   // width:65,
    //   // minWidth: 65,
    //   // maxWidth: 65,
    //   resizable: true,
    //   suppressSizeToFit: true,
    //   cellStyle: {
    //     color: 'purple',
    //     fontWeight: 'bold'
    //   }
    // },
    // { field: 'commentary_a', headerName: 'Accuracy Commentary', editable: false },
    {
      field: 'post_control_dqa_a', headerName: 'After Control Accuracy', editable: true, headerTooltip: 'Post Control Accuracy',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["High", "Medium", "Low"],
      },
      cellStyle: {
        color: 'purple',
        fontWeight: '600'
      },
    },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 80,
      maxWidth: 100,
      // flex: 1,
      pinned: 'right',
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
        deleteDataFields.className = 'fa fa-trash';
        deleteDataFields.style.color = 'red';
        deleteDataFields.style.border = '1px solid lightGrey';
        deleteDataFields.style.borderRadius = '5px';
        deleteDataFields.style.lineHeight = '20px';
        deleteDataFields.style.height = '24px';
        deleteDataFields.style.cursor = 'pointer';
        deleteDataFields.title = 'Delete';

        deleteDataFields.addEventListener('click', () => {
          // this.deleteDAtaFields(params.node);
        });

        div.appendChild(saveDataFields);
        // div.appendChild(deleteDataFields);

        return div;
      }
    },
  ];

  // defaultColDef = {
  //   flex: 1,
  //   resizable: true,
  //   filter: true,
  //   suppressSizeToFit: true
  // };

  columnDefsDQA: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'DQA',
      headerClass: 'custom-parent-header',
      resizable: true,
      headerTooltip: 'DQA',
      children: [
        {
          headerName: 'After Control Completeness',
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
            color: '#c10007',
            fontWeight: '600'
          },
        },
               {
          headerName: 'After Control Timeliness',
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
          headerName: 'After Control Accuracy',
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
        
      ],
    },

    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 80,
      maxWidth: 100,
      // flex: 1,
      pinned: 'right',
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
  ]

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    suppressSizeToFit: true,
    editable: false,
  };

  rowData: any;

  cols = [
    { field: 'field_id', header: 'Field ID', editable: false },
    { field: 'field_name', header: 'Field Name', editable: false },
    { field: 'entity_id', header: 'Entity ID', editable: false },
    { field: 'entity_type', header: 'Entity Type', editable: false },
    { field: 'field_length', header: 'Field Length', editable: false, },
    { field: 'field_description', header: 'Field Description', editable: false, },
    {
      field: 'post_control_dqa_c',
      header: 'After Control Completeness',
      editable: true,
      type: 'dropdown',
      tooltip: 'C',
      style: { color: '#e8000a', fontWeight: 600 },
      dropdownValues: ['High', 'Medium', 'Low']
    },
    {
      field: 'post_control_dqa_t',
      header: 'After Control Timeliness',
      editable: true,
      type: 'dropdown',
      tooltip: 'T',
      style: { color: '#3e63dd', fontWeight: 600 },
      dropdownValues: ['High', 'Medium', 'Low']
    },
    {
      field: 'post_control_dqa_a',
      header: 'After Control Accuracy',
      editable: true,
      type: 'dropdown',
      tooltip: 'A',
      style: { color: 'purple', fontWeight: 600 },
      dropdownValues: ['High', 'Medium', 'Low']
    },
  ];

  selectedColumns: any[] = [];
  globalFilterFields: string[] = [];

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

  onDeleteRecord() {

  }


  ngOnInit(): void {
    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);
    console.log('Editing control with ID:', this.controlId);
    this.controlForm = this.fb.group({
      control_name: ['', Validators.required],
      control_description: ['', Validators.required],
      attach_to: ['', Validators.required],
      attach_to_id: ['', Validators.required],
      control_owner: ['', Validators.required],
      control_owner_email: ['', [Validators.required, Validators.email]],
      version_number: ['', Validators.required],
      status: ['', Validators.required],
      application_date: ['', Validators.required],
      application_date_status: ['', Validators.required],
    });
    this.controlId = Number(this.route.snapshot.paramMap.get('id'));
    this.isBacktolineage = Boolean(this.route.snapshot.paramMap.get('isBacktolineage'));
    if(this.isBacktolineage)
    {      
      this.BacktolineagePath=sessionStorage.getItem('BackTolineagePath')?.toString();
    }

    if (this.controlId > 0) {
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
          this.getControlsDatafields('datafields');
        },
        error: (err: any) => {
          console.error('Failed to load control:', err);
        }
      });

      setTimeout(() => {
        this.cdr.detectChanges(); // ensure UI updates  
      }, 100);

      this.formLoaded = true; // triggers re-render
    }
    else {
      this.formLoaded = true; // triggers re-render
    }

    this.rowDataDQA = [{}];
  }

  onBackToLineage()
  {
     this.router.navigate(JSON.parse(this.BacktolineagePath));
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

  addDatafields(view: string) {
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
    this.getDatafieldsDQA();
  }

  getDataFields() {
    this.datafieldsService.getDataFieldsById(this.attachToId, this.attachTo).subscribe({
      next: (res: any) => {
        this.rowData = [...res]; // triggers change
        if (this.gridApi) {
          this.gridApi.setRowData([]); // Clear first to ensure refresh
          this.gridApi.setRowData(this.rowData);
        }

        this.cdr.detectChanges(); // trigger Angular change detection

        error: (err: any) => {
          console.error('Failed to load control:', err);
        }
      }
      // Force refresh with setRowData

    });
  }

  getDatafieldsDQA() {
    this.datafieldsService.getDataFieldsDQA(this.controlId, 'CONTROL').subscribe({
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


  saveDatafieldsDQA(data: any, interface_type: any) {
    console.log(data, "Control Data Fields DQA");
    this.dataFieldsModel.id = data.data.id;
    this.dataFieldsModel.allow_risk_update = this.showGlobalQualityRisk;
    this.dataFieldsModel.entity_id = [this.controlId];
    this.dataFieldsModel.entity_type = "CONTROL";
    this.dataFieldsModel.default_dqa_t = data.data.default_dqa_t;
    this.dataFieldsModel.default_dqa_a = data.data.default_dqa_a;
    this.dataFieldsModel.default_dqa_c = data.data.default_dqa_c;
    this.dataFieldsModel.default_commentary_t = "";
    this.dataFieldsModel.default_commentary_a = "";
    this.dataFieldsModel.default_commentary_c = "";

    // alert("Data field added Successfully.");
    if (!data.data.id) {
      this.datafieldsService.createGlobalRisk(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Global Risk Added Successfully.");
        setTimeout(() => {
          this.getControlsDatafields('datafields'); // refresh

        }, 1000);
      });
    }
    else {
      this.datafieldsService.updateGlobalRisk(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Global Risk updated Successfully.");
        setTimeout(() => {
          this.getControlsDatafields('datafields');

        }, 1000);
      });
    }

  }


  interfaceOptionList: string[] = [];

  getControlsDatafields(view: string) {
    this.activeView = view;
    this.showDataFields = true;

    this.datafieldsService.getControlsDatafields(this.controlId).subscribe({
      next: (res: any) => {
        this.rowData = [...res]; // triggers change
        if (this.gridApi) {
          this.gridApi.setRowData([]); // Clear first to ensure refresh
          this.gridApi.setRowData(this.rowData);
        }

        this.cdr.detectChanges(); // trigger Angular change detection

        error: (err: any) => {
          console.error('Failed to load Controls:', err);
        }
      }
      // Force refresh with setRowData

    });

  }

  loadInboundInterfaces(view: string) {
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
          if (rawData == undefined) {
            this.rowData = [];
          }
          else {
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

    if (this.controlForm.invalid) {
      this.controlForm.markAllAsTouched();
      return;
    }

    const formValues = this.controlForm.value;

    // Base payload for both create and update
    const payload: any = {
      controlEntity: {
        control_name: formValues.control_name,
        control_description: formValues.control_description,
        attach_to: formValues.attach_to,
        attach_to_id: formValues.attach_to_id,
        control_owner: formValues.control_owner,
        control_owner_email: formValues.control_owner_email,
        version_number: formValues.version_number,
        status: formValues.status,
        application_date: formValues.application_date,
        application_date_status: formValues.application_date_status,

      }
    }


    const isUpdate = this.controlId > 0;
    if (isUpdate) {
      payload.controlEntity.control_id = this.controlId;
    }

    // Choose appropriate API call
    const request$ = isUpdate
      ? this.controlService.updateControl(payload)
      : this.controlService.createControl(payload);

    request$.subscribe({
      next: (res: any) => {
        const controlId = isUpdate ? this.controlId : res.controlEntity.control_id;
        const action = isUpdate ? 'Updated' : 'Created';

        this.toastNotificationService.success(`Control ${action} Successfully. Your Control ID is ${controlId}`);

        if (!isUpdate) {
          this.router.navigate(['/controls/edit-control', controlId]);
        }
      },
      error: () => {
        const action = isUpdate ? 'update' : 'create';
        this.toastNotificationService.error(`Failed to ${action} control.`);
      }
    });
  }


  saveDatafields(data: any) {
    console.log(data, "Control Data Fields");

    this.dataFieldsModel.id = data.pcrc_id;
    this.dataFieldsModel.control_id = this.controlId;
    this.dataFieldsModel.field_id = data.field_id;
    // this.dataFieldsModel.field_description = data.field_description;
    this.dataFieldsModel.post_control_timeliness = data.post_control_dqa_t;
    this.dataFieldsModel.post_control_accuracy = data.post_control_dqa_a;
    this.dataFieldsModel.post_control_completeness = data.post_control_dqa_c;

    this.datafieldsService.updateControlsDatafields(this.dataFieldsModel).subscribe(() => {

      this.toastNotificationService.success("Data field updated Successfully.");
      setTimeout(() => {
        this.getControlsDatafields('datafields'); // refresh

      }, 1000);
    });
  }

  deleteDAtaFields(data: any, id: number) {

  }
  onBack() {
    this.router.navigate(['/controls']);
  }
}
