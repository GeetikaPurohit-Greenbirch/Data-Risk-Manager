import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter, forkJoin, Observable } from 'rxjs';
import { SourceService } from '../../services/source.service';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { MatSelectChange } from '@angular/material/select';
import { createElement, icons } from 'lucide';


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
  statusOptions: string[] = ['NEW', 'DRAFT', 'READY_FOR_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
  serviceQualityOptions: string[] = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  sourceTypeOptions: string[] = ['SYSTEM', 'MANUAL_ENTRY']
  timeOptions: string[] = ["00:00:00", "02:00:00", "04:00:00", "06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];
  frequencyLimit = 1;
  scheduleLimitReached = false;
  formLoaded = false;
  isLoading = false;
  isBacktolineage=false;
  BacktolineagePath: any ="";

  sourceData: any;

  isClone = false;
  originalVersion = '';
  paentInterfaceId:any;

  // ✅ DataFields table data
  dataFields: any[] = [
    { fieldId: 1, fieldName: 'A', dataType: 'Num' },
    { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  ];

  // ✅ Table column names
  displayedColumns: string[] = ['fieldId', 'fieldName', 'fieldDesc', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  sourceId!: any;
  gridApi: any;
  gridColumnApi: any;
  // rowData: any;
  dataFieldsModel: Datafields = new Datafields();
  activeView!: string; // default view on load
  showGlobalQualityRisk = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastNotificationService: ToastnotificationService,
    private sourceService: SourceService,
    private datafieldsService: DatafieldsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { 

    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          const nav = this.router.getCurrentNavigation();
          const state = nav?.extras?.state as { clonedSource?: any };
          if (state?.clonedSource) {
            this.sourceData = state.clonedSource;
            this.isClone = true;
            this.originalVersion = this.sourceData.source_version_number;
            this.paentInterfaceId = this.sourceData.source_id;
            this.resetFormForClone();
          }
        });
        
  }

  columnDefsDQA: (ColDef | ColGroupDef)[] = [
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
            color: '#c10007',
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

  columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'field_id', headerName: 'Field ID', editable: false, headerTooltip: 'Field ID', },
    { field: 'user_generated_id', headerName: 'Field No.', editable: true, headerTooltip: 'Field No.', },
    { field: 'field_name', headerName: 'Field Name', editable: true, headerTooltip: 'Filed Name', },
    { field: 'field_description', headerName: 'Field Description', editable: true, headerTooltip: 'Field Description', },
    {
      field: 'data_type', headerName: 'Data Type', editable: true, headerTooltip: 'Data Type',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
      },
    },
    { field: 'field_length', headerName: 'Length', editable: true, headerTooltip: 'Length', },
    {
      headerName: 'DQA',
      resizable: true,
      headerTooltip: 'DQA',
      children: [
        {
          headerName: 'Completeness',
          field: 'dqa_c',
          editable: true,
          headerTooltip: 'Completeness',
          //  valueGetter: () => 'L', // Always returns 'L'
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ["High", "Medium", "Low"],
          },
          //  width:65,
          //  minWidth: 65,
          //  maxWidth: 65,
          resizable: true,
          suppressSizeToFit: true,
          cellStyle: {
            color: '#c10007',
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
          headerName: 'Timeliness',
          field: 'dqa_t',
          editable: true,
          headerTooltip: 'Timeliness',
          // valueGetter: () => 'L', // Always returns 'L'
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ["High", "Medium", "Low"],
            // values: ["H", "M", "L"],
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
          width: 100,
          minWidth: 100,
          maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,

        },
        {
          headerName: 'Accuracy',
          field: 'dqa_a',
          editable: true,
          headerTooltip: 'Accuracy',
          // valueGetter: () => 'L', // Always returns 'L'
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
          // width:100,
          // minWidth: 100,
          // maxWidth: 100,
          resizable: true,
          suppressSizeToFit: true,

        },
      ],

    },
    {
      field: 'criticality', headerName: 'Criticality', editable: true,
      cellEditor: 'agSelectCellEditor',
      headerTooltip: 'Criticality',
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

        deleteDataFields.addEventListener('click', () => {
          this.deleteDAtaFields(params.node);
        });

        div.appendChild(saveDataFields);
        div.appendChild(deleteDataFields);

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

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    suppressSizeToFit: true,
    editable: false,
  };

  rowData: any;
  rowDataDQA: any;

  // rowData = [
  //   { fieldId: '1', fieldName: 'Name', dataType: 'String', fieldLength: '50',  dqaC: 'L',
  //     dqaT: 'L',
  //     dqaA: 'L', criticality: 'HIGH' },
  // ];


  cols = [
    { field: 'field_id', header: 'Field ID', editable: false },
    { field: 'field_name', header: 'Field Name', editable: true },
    { field: 'entity_type', header: 'Entity Type', editable: true },
    // { field: 'field_id', header: 'Field ID', editable: false, },
    { field: 'user_generated_id', header: 'Field No.', editable: true },
    { field: 'field_name', header: 'Field Name', editable: true, },
    { field: 'data_type', header: 'Data Type', editable: true, dropdownValues: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME'] },
    { field: 'field_length', header: 'Field Length', editable: true, },
    {
      field: 'dqa_c',
      header: 'C',
      editable: true,
      type: 'dropdown',
      tooltip: 'C',
      style: { color: '#e8000a', fontWeight: 600 },
      dropdownValues: ['HIGH', 'MEDIUM', 'LOW']
    },
    { field: 'commentary_c', header: 'C Commentary', editable: true },
    {
      field: 'dqa_t',
      header: 'T',
      editable: true,
      type: 'dropdown',
      tooltip: 'T',
      style: { color: '#3e63dd', fontWeight: 600 },
      dropdownValues: ['HIGH', 'MEDIUM', 'LOW']
    },
    { field: 'commentary_t', header: 'T Commentary', editable: true },
    {
      field: 'dqa_a',
      header: 'A',
      editable: true,
      type: 'dropdown',
      tooltip: 'A',
      style: { color: 'purple', fontWeight: 600 },
      dropdownValues: ['HIGH', 'MEDIUM', 'LOW']
    },
    { field: 'commentary_a', header: 'A Commentary', editable: true }
  ];

  selectedColumns: any[] = [];
  globalFilterFields: string[] = [];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.getDataFields();
  }

  addRow() {
    const newItem = { fieldId: '', fieldName: '', fieldDesc: '', dataType: '', fieldLength: '', dqaC: '', dqaT: '', dqaA: '', criticality: '' };
    this.rowData = [...this.rowData, newItem];
  }

  onRowValueChanged(event: any) {
    console.log('Updated row:', event.data);
  }

  ngOnInit(): void {
    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);
    console.log('Editing source with ID:', this.sourceId);
    this.sourceForm = this.fb.group({
      source_name: ['', Validators.required],
      vendor: ['', Validators.required],
      quality_of_service: ['', Validators.required],
      frequency_of_update: ['', Validators.required],
      schedule_of_update: [[], Validators.required],
      methodology_of_transfer: ['', Validators.required],
      source_type: ['', Validators.required],
      source_version_number: ['', Validators.required],
      source_status: ['', Validators.required],
      source_owner: ['', Validators.required],
      source_owner_email: ['', [Validators.required, Validators.email]],
      // add other form controls as needed
    });
    this.sourceId = Number(this.route.snapshot.paramMap.get('id'));
    this.isBacktolineage = Boolean(this.route.snapshot.paramMap.get('isBacktolineage'));
    if(this.isBacktolineage)
    {      
      this.BacktolineagePath=sessionStorage.getItem('BackTolineagePath')?.toString();
    }
    if (this.sourceId > 0) {
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
    else {
      this.formLoaded = true; // triggers re-render
      this.generateTimeOptions();
      // Disable freq/schedule for certain service qualities
      this.sourceForm.get('quality_of_service')?.valueChanges.subscribe(value => {
        if (value === 'STREAMING' || value === 'AD_HOC') {
          this.sourceForm.get('frequency_of_update')?.disable({ emitEvent: false });
          this.sourceForm.get('schedule_of_update')?.disable({ emitEvent: false });
        } else {
          this.sourceForm.get('frequency_of_update')?.enable({ emitEvent: false });
          this.sourceForm.get('schedule_of_update')?.enable({ emitEvent: false });
        }
      });
    }

  }

  ngAfterViewInit(): void {
    // 🔹 Patch only after view is fully initialized
    if (this.sourceData) {
      this.isClone = true;
      this.originalVersion = this.sourceData.source_version_number;
      this.prefillForm(this.sourceData);
    }
  }

  resetFormForClone(): void {
    this.sourceForm.reset();
    this.prefillForm(this.sourceData);
    this.sourceForm.enable();
  }


  prefillForm(data: any): void {
    this.sourceForm.patchValue({
      source_name: data.source_name,
      vendor: data.vendor,
      quality_of_service: data.quality_of_service,
      frequency_of_update: data.frequency_of_update,
      schedule_of_update: data.schedule_of_update,
      methodology_of_transfer: data.methodology_of_transfer,
      source_type: data.source_type,
      source_version_number: data.source_version_number, // ✅ correct field name
      source_status: data.source_status,
      source_owner: data.source_owner,
      source_owner_email: data.source_owner_email,
    });

   
  }

  checkVersionChange(currentVersion: string): void {
    if (this.isClone) {
      if (!currentVersion || currentVersion === this.originalVersion) {
        this.sourceForm.get('source_version_number')?.setErrors({ versionUnchanged: true });
      } else {
        this.sourceForm.get('source_version_number')?.setErrors(null);
      }
    }
  }
  generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour.toString().padStart(2, '0') + ':00';
      this.timeOptions.push(time);
    }
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

  toggleFieldsBasedOnQoS(event: MatSelectChange): void {
    const value = event.value;
    if (value === 'STREAMING' || value === 'AD_HOC') {
      this.sourceForm.get('frequency_of_update')?.disable({ emitEvent: false });
      this.sourceForm.get('schedule_of_update')?.disable({ emitEvent: false });
    } else {
      this.sourceForm.get('frequency_of_update')?.enable({ emitEvent: false });
      this.sourceForm.get('schedule_of_update')?.enable({ emitEvent: false });
    }
  }

  getDataFields() {
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

  addDatafields(view: string) {
    this.activeView = view;
    this.showDataFieldsTable = true;
    this.showDataFields = true;
    this.showDataQuality = false;
    this.getDatafieldsDQA();
  }

  showDQA(view: string) {
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
  // onUpdate(): void {
  //   console.log('Form data:', this.sourceForm.value);

  //   // Extract form values
  //   const formValues = this.sourceForm.value;

  //   // If QoS is STREAMING or AD_HOC, nullify these fields
  //   const isStreamingOrAdHoc = formValues.quality_of_service === 'STREAMING' || formValues.quality_of_service === 'AD_HOC';


  //   // Submit or save logic here
  //   const payload = {
  //     sourceEntity: {
  //       // this.sourceModel.source_id = this.sourceForm.value.sourceId;
  //       source_id: this.sourceId,
  //       source_name: this.sourceForm.value.source_name,
  //       vendor: this.sourceForm.value.vendor,
  //       quality_of_service: this.sourceForm.value.quality_of_service,
  //       frequency_of_update: isStreamingOrAdHoc ? null : formValues.frequency_of_update,
  //       schedule_of_update: isStreamingOrAdHoc ? null : formValues.schedule_of_update,
  //       methodology_of_transfer: this.sourceForm.value.methodology_of_transfer,
  //       source_type: this.sourceForm.value.source_type,
  //       source_version_number: this.sourceForm.value.source_version_number,
  //       source_status: this.sourceForm.value.source_status,
  //       source_owner: this.sourceForm.value.source_owner,
  //       source_owner_email: this.sourceForm.value.source_owner_email
  //     }
  //   }
  //   this.sourceService.updateSource(payload).subscribe(res => {
  //     if (res) {
  //       // alert("Source Updated Successfully. Your Source ID is "+ this.sourceId);
  //       this.toastNotificationService.success("Source Updated Successfully. Your Source ID is " + this.sourceId);
  //       // window.location.reload();
  //     }
  //   })
  // }

  onUpdate(): void {
    console.log('Form data:', this.sourceForm.value);

    if (!this.sourceForm.valid) {
      this.sourceForm.markAllAsTouched();
      return;
    }

    const formValues = this.sourceForm.value;
    const isStreamingOrAdHoc = formValues.quality_of_service === 'STREAMING' || formValues.quality_of_service === 'AD_HOC';


    // Base payload structure
    const payload: any = {
      sourceEntity: {
        source_name: this.sourceForm.value.source_name,
        vendor: this.sourceForm.value.vendor,
        quality_of_service: this.sourceForm.value.quality_of_service,
        frequency_of_update: isStreamingOrAdHoc ? null : formValues.frequency_of_update,
        schedule_of_update: isStreamingOrAdHoc ? null : formValues.schedule_of_update,
        methodology_of_transfer: this.sourceForm.value.methodology_of_transfer,
        source_type: this.sourceForm.value.source_type,
        source_version_number: this.sourceForm.value.source_version_number,
        source_status: this.sourceForm.value.source_status,
        source_owner: this.sourceForm.value.source_owner,
        source_owner_email: this.sourceForm.value.source_owner_email
      }
    }

    const isUpdate = this.sourceId > 0;
    if (isUpdate) {
      payload.sourceEntity.source_id = this.sourceId;
    }
    else
    {
      if (this.isClone && this.sourceForm.value.source_version_number === this.originalVersion) {
        this.toastNotificationService.error('Please change the version number before saving the cloned source.');
       
        return;
      }
    }

    // const request$ = isUpdate
    //   ? this.sourceService.updateSource(payload)
    //   : this.sourceService.createSource(payload);

    // request$.subscribe({
    //   next: (res) => {
    //     if (res) {
    //       const sourceId = isUpdate ? this.sourceId : res.sourceEntity.source_id;
    //       const action = isUpdate ? 'Updated' : 'Created';
    //       this.toastNotificationService.success(`Source ${action} Successfully. Your Source ID is ${sourceId}.`);

    //       if (!isUpdate) {
    //         this.router.navigate(['/sources/edit-source', sourceId]);
    //       }
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error in source operation:', err);
    //     this.toastNotificationService.error('An error occurred while saving the source.');
    //   }
    // });

    // Choose appropriate API call
          let request$: Observable<any>;
        
           if (this.isClone) {
             // 🔁 Clone case
             request$ = this.sourceService.cloneSourceDatafields(
               payload,
               'sources',
               this.paentInterfaceId
             );
           } else if (isUpdate) {
             // ✏️ Update case
             request$ = this.sourceService.updateSource(payload);
           } else {
             // 🆕 Create case
             request$ = this.sourceService.createSource(payload);
           }
           
     // ✅ Subscribe only once
request$.subscribe({
  next: (res: any) => {
    if (this.isClone) {
      // Handle Clone Success
      this.toastNotificationService.success(
        `Source cloned successfully. Your Source ID is ${res.sourceEntity.source_id}`
      );
      this.toastNotificationService.success('Datafields cloned successfully.');
      this.router.navigate(['/sources/edit-source', res.sourceEntity.source_id]);
      return;
    }

    // Handle Create/Update Success
    const sourceID = isUpdate ? this.sourceId : res.sourceEntity.source_id;
    const action = isUpdate ? 'Updated' : 'Created';
    this.toastNotificationService.success(
      `Source ${action} successfully. Your Source ID is ${sourceID}`
    );
    

    // 🔁 If you only need to clone *after* creating, handle it separately:
    // if (!isUpdate && !this.isClone) {
    //   this.sourceService
    //     .cloneSourceDatafields(payload, 'sources', this.paentInterfaceId)
    //     .subscribe({
    //       next: (cloneRes) => {
    //         this.toastNotificationService.success('Datafields cloned successfully.');
    //         this.router.navigate(['/sources/edit-source', cloneRes.sourceEntity.source_id]);
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
    this.toastNotificationService.error(`Failed to ${action} source.`);
    console.error('❌ API Error:', err);
  }
});
  }



  getDatafieldsDQA() {
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


  saveDatafieldsDQA(data: any, interface_type: any) {
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
    if (!data.data.id) {
      this.datafieldsService.createGlobalRisk(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Global Risk Added Successfully.");
        setTimeout(() => {
          this.getDataFields(); // refresh

        }, 1000);
      });
    }
    else {
      this.datafieldsService.updateGlobalRisk(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Global Risk updated Successfully.");
        setTimeout(() => {
          this.getDataFields();

        }, 1000);
      });
    }

  }


  saveDatafields(data: any) {
    console.log(data, "Interface Data Fields");

    this.dataFieldsModel.field_id = data.field_id;
    this.dataFieldsModel.user_generated_id = data.user_generated_id;
    this.dataFieldsModel.field_name = data.field_name;
    this.dataFieldsModel.field_description = data.field_description;
    this.dataFieldsModel.dqa_c = data.dqa_c;
    this.dataFieldsModel.dqa_t = data.dqa_t;
    this.dataFieldsModel.dqa_a = data.dqa_a;
    this.dataFieldsModel.commentary_a = data.commentary_a;
    this.dataFieldsModel.commentary_t = data.commentary_t;
    this.dataFieldsModel.commentary_c = data.commentary_c;
    this.dataFieldsModel.data_type = data.data_type;
    this.dataFieldsModel.field_length = data.field_length;
    this.dataFieldsModel.criticality = data.criticality;
    this.dataFieldsModel.entity_type = 'SOURCE';
    this.dataFieldsModel.entity_id = this.sourceId;

    // alert("Data field added Successfully.");
    if (!data.field_id) {
      this.datafieldsService.createDataFields(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Data field added Successfully.");
        setTimeout(() => {
          this.getDataFields(); // refresh

        }, 1000);
      });
    }
    else {
      this.datafieldsService.updateInterface(this.dataFieldsModel).subscribe(() => {

        this.toastNotificationService.success("Data field updated Successfully.");
        setTimeout(() => {
          this.getDataFields(); // refresh

        }, 1000);
      });
    }


  }

  deleteDAtaFields(data: any) {
    this.datafieldsService.deleteDataFields(data.field_id, 'SOURCE', this.sourceId).subscribe(() => {
      // alert("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
      this.toastNotificationService.error("Datafields Deleted Successfully. Deleted datafiled ID is " + data.field_id);
      setTimeout(() => {
        this.getDataFields(); // refresh

      }, 1000);
    })
  }
  onBack() {
    this.router.navigate(['/sources']);
  }
  onBackToLineage()
  {
     this.router.navigate(JSON.parse(this.BacktolineagePath));
  }
}
