import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InterfaceService } from '../../services/interface.service';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { Datafields } from 'src/app/features/shared-models/datafields.model';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { MatSelectChange } from '@angular/material/select';
import { createElement, icons } from 'lucide';

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
  interfaceTypeOptions = ['SYSTEM', 'MANUAL_ENTRY']
  statusOptions: string[] = ['NEW', 'DRAFT', 'READY_FOR_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
  serviceQualityOptions: string[] = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  timeOptions: string[] = ["00:00:00", "02:00:00", "04:00:00", "06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];
  formLoaded = false;
  isLoading: boolean = false;
  // ✅ Table column names
  displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  interfaceId!: any;
  gridApi: any;
  gridColumnApi: any;
  activeView!: string; // default view on load
  frequencyLimit = 1;
  scheduleLimitReached = false;

  // rowData: any;
  dataFieldsModel: Datafields = new Datafields();
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastNotificationService: ToastnotificationService,
    private interfaceService: InterfaceService,
    private datafieldsService: DatafieldsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }


  // columnDefs: (ColDef | ColGroupDef)[] = [
  //   { field: 'field_id', headerName: 'Field ID', editable: false, headerTooltip: 'Field ID', },
  //   { field: 'user_generated_id', headerName: 'Field No.', editable: true, headerTooltip: 'Field No.', },
  //   { field: 'field_name', headerName: 'Field Name', editable: true, headerTooltip: 'Field Name', },
  //   { field: 'field_description', headerName: 'Field Description', editable: true, headerTooltip: 'Field Description' },
  //   {
  //     field: 'data_type', headerName: 'Data Type', editable: true, headerTooltip: 'Data Type',
  //     cellEditor: 'agSelectCellEditor',
  //     cellEditorParams: {
  //       values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME']
  //     },
  //   },
  //   { field: 'field_length', headerName: 'Length', editable: true, headerTooltip: 'Length', },

  //   {
  //     field: 'criticality', headerName: 'Criticality', editable: true, headerTooltip: 'Criticality',
  //     cellEditor: 'agSelectCellEditor',
  //     cellEditorParams: {
  //       values: ["MAJOR", "MINOR", "INSIGNIFICANT", "CRITICAL"]
  //     },
  //   },
  //   {
  //     headerName: 'Actions',
  //     editable: false,
  //     filter: false,
  //     sortable: false,
  //     pinned: 'right',
  //     // flex: 1,
  //     minWidth: 80,
  //     maxWidth: 100,
  //     cellRenderer: (params: any) => {
  //       const div = document.createElement('div');
  //       div.className = 'model-cell-renderer';

  //       const saveDataFields = document.createElement('button');
  //       saveDataFields.title = 'Save';
  //       saveDataFields.style.border = 'none';
  //       saveDataFields.style.padding = '0px';
  //       saveDataFields.style.cursor = 'pointer';
  //       saveDataFields.style.background = 'transparent';

  //       const saveIcon = createElement(icons.Save, {
  //         color: '#008236',
  //         height: '14px',
  //         strokeWidth: 2
  //       });
  //       saveDataFields.appendChild(saveIcon);

  //       // Pass row data or node to save
  //       saveDataFields.addEventListener('click', () => {
  //         this.saveDatafields(params.node);
  //       });

  //       const deleteDataFields = document.createElement('button');
  //       deleteDataFields.title = 'Delete';
  //       deleteDataFields.style.border = 'none';
  //       deleteDataFields.style.padding = '0px';
  //       deleteDataFields.style.cursor = 'pointer';
  //       deleteDataFields.style.background = 'transparent';

  //       const deleteIcon = createElement(icons.Trash2, {
  //         color: '#c10007',
  //         height: '14px',
  //         strokeWidth: 2
  //       });
  //       deleteDataFields.appendChild(deleteIcon);

  //       deleteDataFields.addEventListener('click', () => {
  //         this.deleteDAtaFields(params.node);
  //       });

  //       div.appendChild(saveDataFields);
  //       div.appendChild(deleteDataFields);

  //       return div;
  //     }
  //   },
  // ];

  // defaultColDef: ColDef = {
  //   resizable: true,
  //   sortable: true,
  //   filter: true,
  //   suppressSizeToFit: true,
  //   editable: false,
  // };

  rowData: any;
  fieldDialog = false;
  fieldForm!: FormGroup;
  submitted = false;
  isEdit = false;
  selectedField: any;
  selectedColumns: any[] = [];
  globalFilterFields: string[] = [];

  cols = [
    { field: 'field_id', header: 'Field ID' },
    { field: 'user_generated_id', header: 'Field No.' },
    { field: 'field_name', header: 'Field Name' },
    { field: 'field_description', header: 'Field Description' },
    { field: 'data_type', header: 'Data Type' },
    { field: 'field_length', header: 'Length' },
    { field: 'criticality', header: 'Criticality' },
  ];

  dataTypeOptions = [
    { label: 'NUMERIC', value: 'NUMERIC' },
    { label: 'ALPHANUMERIC', value: 'ALPHANUMERIC' },
    { label: 'DATE_TIME', value: 'DATE_TIME' },
  ];

  criticalityOptions = [
    { label: 'MAJOR', value: 'MAJOR' },
    { label: 'MINOR', value: 'MINOR' },
    { label: 'INSIGNIFICANT', value: 'INSIGNIFICANT' },
    { label: 'CRITICAL', value: 'CRITICAL' },
  ];
  buildForm() {
    this.fieldForm = this.fb.group({
      field_id: [''],
      user_generated_id: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      field_name: ['', Validators.required],
      field_description: ['', Validators.required],
      data_type: ['', Validators.required],
      field_length: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      criticality: ['', Validators.required],
    });
  }



  // onGridReady(params: any) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   this.gridApi.sizeColumnsToFit();
  //   this.getDataFields();
  // }

  // addRow() {
  //   const newItem = { fieldId: '', fieldName: '', dataType: '', fieldLength: '', dqaC: '', dqaT: '', dqaA: '', criticality: '' };
  //   this.rowData = [...this.rowData, newItem];
  // }

  // onRowValueChanged(event: any) {
  //   console.log('Updated row:', event.data);
  // }

  ngOnInit(): void {
    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);
    //console.log('Editing interface with ID:', this.interfaceId);
    this.interfaceForm = this.fb.group({
      interface_name: ['', Validators.required],
      quality_of_service: ['', Validators.required],
      frequency_of_update: ['', Validators.required],
      schedule_of_update: ['', Validators.required],
      methodology_of_transfer: ['', Validators.required],
      interface_type: ['', Validators.required],
      interface_version_number: ['', Validators.required],
      interface_status: ['', Validators.required],
      interface_owner: ['', Validators.required],
      interface_owner_email: ['', [Validators.required, Validators.email]],
      // add other form controls as needed
    });
    this.interfaceId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.interfaceId > 0) {
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

      // setTimeout(() => {
      //   this.cdr.detectChanges(); // ensure UI updates  
      // }, 100);

      this.formLoaded = true; // triggers re-render

      // Watch for changes in quality_of_service
      this.interfaceForm.get('quality_of_service')?.valueChanges.subscribe(value => {
        this.toggleFieldsBasedOnQoS(value);
      });
      this.buildForm();
      this.getDataFields();
    }
    else {
      this.formLoaded = true; // triggers re-render
      this.generateTimeOptions();

      // Disable freq/schedule for certain service qualities
      this.interfaceForm.get('serviceQuality')?.valueChanges.subscribe(value => {
        if (value === 'STREAMING' || value === 'AD_HOC') {
          this.interfaceForm.get('frequencyUpdate')?.disable({ emitEvent: false });
          this.interfaceForm.get('updateSchedule')?.disable({ emitEvent: false });
        } else {
          this.interfaceForm.get('frequencyUpdate')?.enable({ emitEvent: false });
          this.interfaceForm.get('updateSchedule')?.enable({ emitEvent: false });
        }
      });
    }
  }

  generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      this.timeOptions.push(hour.toString().padStart(2, '0') + ':00');
    }
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

  getDataFields() {
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

  addDatafields(view: string) {
    this.activeView = view;
    this.showDataFieldsTable = true;
    this.showDataFields = true;
    this.showDataQuality = false;
  }

  showDQA(view: string) {
    this.activeView = view;
    this.showDataFieldsTable = true;
    this.showDataFields = false;
    this.showDataQuality = true;
  }

  // Handle changes in cell values
  // onCellValueChanged(event: any): void {
  //   console.log('Cell Value Changed:', event);
  // }


  // ✅ Add a new DataField row
  // addField(): void {
  //   const newId = this.dataFields.length + 1;
  //   const newField = {
  //     fieldId: newId,
  //     fieldName: '',
  //     dataType: ''
  //   };
  //   this.dataFields = [...this.dataFields, newField]; // Reassign array
  // }

  // ✅ Trigger update/save logic
  onUpdate(): void {
    console.log('Form data:', this.interfaceForm.value);

    if (this.interfaceForm.invalid) {
      this.interfaceForm.markAllAsTouched();
      return;
    }

    const formValues = this.interfaceForm.value;
    const isStreamingOrAdHoc =
      formValues.quality_of_service === 'STREAMING' ||
      formValues.quality_of_service === 'AD_HOC';

    // Base payload for both create and update
    const payload: any = {
      interfaceEntity: {
        interface_name: formValues.interface_name,
        quality_of_service: formValues.quality_of_service,
        frequency_of_update: isStreamingOrAdHoc ? null : formValues.frequency_of_update,
        schedule_of_update: isStreamingOrAdHoc ? null : formValues.schedule_of_update,
        methodology_of_transfer: formValues.methodology_of_transfer,
        interface_type: formValues.interface_type,
        interface_version_number: formValues.interface_version_number,
        interface_status: formValues.interface_status,
        interface_owner: formValues.interface_owner,
        interface_owner_email: formValues.interface_owner_email
      }
    };

    const isUpdate = this.interfaceId > 0;
    if (isUpdate) {
      payload.interfaceEntity.interface_id = this.interfaceId;
    }

    // Choose appropriate API call
    const request$ = isUpdate
      ? this.interfaceService.updateInterface(payload)
      : this.interfaceService.createInterface(payload);

    request$.subscribe({
      next: (res: any) => {
        const interfaceId = isUpdate ? this.interfaceId : res.interfaceEntity.interface_id;
        const action = isUpdate ? 'Updated' : 'Created';

        this.toastNotificationService.success(`Interface ${action} Successfully. Your Interface ID is ${interfaceId}`);

        if (!isUpdate) {
          this.router.navigate(['/interfaces/edit-interface', interfaceId]);
        }
      },
      error: () => {
        const action = isUpdate ? 'update' : 'create';
        this.toastNotificationService.error(`Failed to ${action} interface.`);
      }
    });
  }




  // deleteDAtaFields(data: any) {
  //   this.datafieldsService.deleteDataFields(data.field_id, 'INTERFACE', this.interfaceId).subscribe(() => {
  //     // alert("Datafields Deleted Successfully. Deleted datafiled ID is "+ data.data.field_id);
  //     this.toastNotificationService.error("Datafields Deleted Successfully. Deleted datafiled ID is " + data.field_id);
  //     setTimeout(() => {
  //       this.getDataFields(); // refresh

  //     }, 1000);
  //   })
  // }
  onBack() {
    this.router.navigate(['/interfaces']);
  }

  openNew() {
    this.isEdit = false;
    this.fieldDialog = true;
    this.submitted = false;
  }

  editField(field: any) {
    this.isEdit = true;
    this.selectedRow = field;
    this.fieldForm.patchValue(field);
    this.fieldDialog = true;
  }

  saveField() {
    this.submitted = true;
    if (this.fieldForm.invalid) return;

    this.saveDatafields(this.fieldForm.value);
  }

  saveDatafields(data: any) {
    console.log(data, "Interface Data Fields");

    this.dataFieldsModel.field_id = data.field_id;
    this.dataFieldsModel.user_generated_id = data.user_generated_id;
    this.dataFieldsModel.field_name = data.field_name;
    this.dataFieldsModel.field_description = data.field_description;
    this.dataFieldsModel.data_type = data.data_type;
    this.dataFieldsModel.field_length = data.field_length;
    this.dataFieldsModel.criticality = data.criticality;
    this.dataFieldsModel.entity_type = 'INTERFACE';
    this.dataFieldsModel.entity_id = this.interfaceId;

    if (!data.field_id && !this.isEdit && !this.selectedRow) {
      this.datafieldsService.createDataFields(this.dataFieldsModel).subscribe((res) => {
        if (res != null) {
          data.field_id=res.field_id;
          this.rowData.push(data);
          this.toastNotificationService.success("Data field added Successfully.");
          this.fieldDialog = false;
        }
      });
    }
    else {
      this.datafieldsService.updateInterface(this.dataFieldsModel).subscribe(() => {
        Object.assign(this.selectedRow, data);
        this.toastNotificationService.success("Data field updated Successfully.");
        this.fieldDialog = false;
      });
    }
  }


  hideDialog() {
    this.fieldDialog = false;
    this.submitted = false;
  }
  showDeleteDialog = false;
  selectedRow: any;

  confirmDelete(row: any) {
    this.selectedRow = row;
    this.showDeleteDialog = true;
  }

  deleteRow() {
    this.datafieldsService.deleteDataFields(this.selectedRow.field_id, 'INTERFACE', this.interfaceId).subscribe(() => {
      this.toastNotificationService.error("Data fields Deleted Successfully.");
      this.rowData = this.rowData.filter((r: any) => r.field_id !== this.selectedRow.field_id);
      this.showDeleteDialog = false;
    })
  }
    // called by p-multiSelect (onChange)
  onColumnsChange(event: any) {
    // event.value contains selected column objects
    this.selectedColumns = event.value;
    this.globalFilterFields = this.selectedColumns.map((c: any) => c.field);
  }

  // called from input (so we don't rely on template dt variable usage)
  onGlobalFilter(value: string, dt: any) {
    // sanitize input and call table API
    const q = (value || '').trim();
    dt.filterGlobal(q, 'contains');
  }
}
