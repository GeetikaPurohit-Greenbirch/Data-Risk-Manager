import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { HttpClient } from '@angular/common/http';
import { UsecaseService } from 'src/app/features/use-cases/services/usecase.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createElement, icons } from 'lucide';

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
  targetUseCaseForm!: FormGroup;
  showDataFields = true;
  loader=false;
  //showDataQuality = false;
  //showDataFieldsTable = true;
  targetTypeOptions = ['SYSTEM', 'FILE', 'DISPLAY', 'PRINTER']
  statusOptions: string[] = ['NEW', 'DRAFT', 'READY_FOR_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
  timeOptions: string[] = ["00:00:00", "02:00:00", "04:00:00", "06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];
  serviceQualityOptions: string[] = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  frequencyLimit = 1;
  scheduleLimitReached = false;
  formLoaded = false;
  showReport = false;
  selectedUseCaseId: string | null = null;
  useCaseId!: number;
  useCaseName = '';
  public rowindex = 0;
  public savedUseCase: string | null = null;
  useCaseModel!: number;
  @ViewChild('useCasePopup') useCasePopup!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  showDialog = false;
  isEditMode = false;
  formGroup!: FormGroup;
  currentRow: any = null;
  useCases: any[] = [];
  isBacktolineage=false;
  BacktolineagePath: any ="";

  // ✅ DataFields table data
  // dataFields: any[] = [
  //   { fieldId: 1, fieldName: 'A', dataType: 'Num' },
  //   { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  // ];

  // ✅ Table column names
  //displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  targetId!: any;
  gridApi: any;
  gridColumnApi: any;
  // rowData: any;
  dataFieldsModel: Datafields = new Datafields();
  activeView!: string; // default view on load
  // report builder visibility/position
  reportVisible = false;
  reportPosition = { x: 200, y: 120 };
  options: any;

  rowData: any;

  cols = [
    // { field: 'field_id', header: 'Field ID', editable: false },
    { field: 'field_no', header: 'Field No.', editable: false },
    { field: 'field_name', header: 'Field Name', editable: false },
    { field: 'field_description', header: 'Field Description', editable: false },
    { field: 'field_length', header: 'Length', editable: false },
    { field: 'data_type', header: 'Data Type', editable: false },
    { field: 'criticality', header: 'Criticality', editable: false }

  ];
  // Dropdown options
  dataTypes = [
    { label: 'Select', value: '' },
    { label: 'NUMERIC', value: 'NUMERIC' },
    { label: 'ALPHANUMERIC', value: 'ALPHANUMERIC' },
    { label: 'DATE TIME', value: 'DATE_TIME' },
  ];

  criticalityOptions = [
    { label: 'Select', value: '' },
    { label: 'MAJOR', value: 'MAJOR' },
    { label: 'MINOR', value: 'MINOR' },
    { label: 'INSIGNIFICANT', value: 'INSIGNIFICANT' },
    { label: 'CRITICAL', value: 'CRITICAL' },
  ];

  selectedColumns: any[] = [];
  globalFilterFields: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pdfService: PdfService,
    private fb: FormBuilder,
    private toastNotificationService: ToastnotificationService,
    private targetService: TargetService,
    private datafieldsService: DatafieldsService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private usecaseService: UsecaseService,
    private router: Router,

  ) { }


  // columnDefs: (ColDef | ColGroupDef)[] = [
  //   { field: 'field_id', headerName: 'Field ID', editable: false, headerTooltip: 'Field ID' },
  //   { field: 'field_no', headerName: 'Field No.', editable: true, headerTooltip: 'Field No.' },
  //   { field: 'field_name', headerName: 'Field Name', editable: true, headerTooltip: 'Field Name' },
  //   { field: 'field_description', headerName: 'Field Description', editable: true, headerTooltip: 'Field Description' },
  //   {
  //     field: 'data_type', headerName: 'Data Type', editable: true,
  //     cellEditor: 'agSelectCellEditor',
  //     cellEditorParams: { values: ['NUMERIC', 'ALPHANUMERIC', 'DATE_TIME'] },
  //     headerTooltip: 'Data Type'
  //   },
  //   { field: 'field_length', headerName: 'Length', editable: true, headerTooltip: 'Length' },
  //   // {
  //   //   headerName: 'DQA',
  //   //   field: 'dqa',
  //   //   resizable: true,
  //   //   headerTooltip: 'DQA',
  //   //   children: [
  //   //     { headerName: 'Completeness', field: 'dqa_c', editable: false, headerTooltip: 'Completeness', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ["H", "M", "L"] } },
  //   //     { headerName: 'Timeliness', field: 'dqa_t', editable: false, headerTooltip: 'Timeliness', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ["H", "M", "L"] } },
  //   //     { headerName: 'Accuracy', field: 'dqa_a', editable: false, headerTooltip: 'Accuracy', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ["H", "M", "L"] } }
  //   //   ]
  //   // },
  //   {
  //     field: 'criticality', headerName: 'Criticality', editable: true, headerTooltip: 'Criticality', cellEditor: 'agSelectCellEditor',
  //     cellEditorParams: { values: ["MAJOR", "MINOR", "INSIGNIFICANT", "CRITICAL"] }
  //   },

  //   {
  //     headerName: 'Actions',
  //     editable: false,
  //     filter: false,
  //     sortable: false,
  //     minWidth: 100,
  //     flex: 1,
  //     headerTooltip: 'Actions',
  //     cellRenderer: (params: any) => {
  //       const div = document.createElement('div');
  //       div.className = 'model-cell-renderer';

  //       const saveDataFields = document.createElement('button');
  //       saveDataFields.className = 'fa fa-save';
  //       saveDataFields.style.color = 'green';
  //       saveDataFields.style.border = '1px solid lightGrey';
  //       saveDataFields.style.borderRadius = '5px';
  //       saveDataFields.style.lineHeight = '20px';
  //       saveDataFields.style.height = '24px';
  //       saveDataFields.style.cursor = 'pointer';
  //       saveDataFields.title = 'Save';

  //       // Pass row data or node to save
  //       saveDataFields.addEventListener('click', () => {
  //         this.saveDatafields(params.node);
  //       });

  //       const deleteDataFields = document.createElement('button');
  //       deleteDataFields.className = 'fa fa-trash';
  //       deleteDataFields.style.color = 'red';
  //       deleteDataFields.style.border = '1px solid lightGrey';
  //       deleteDataFields.style.borderRadius = '5px';
  //       deleteDataFields.style.lineHeight = '20px';
  //       deleteDataFields.style.height = '24px';
  //       deleteDataFields.style.cursor = 'pointer';
  //       deleteDataFields.title = 'Delete';

  //       deleteDataFields.addEventListener('click', () => {
  //         this.deleteDAtaFields(params.node);
  //       });

  //       div.appendChild(saveDataFields);
  //       div.appendChild(deleteDataFields);

  //       return div;
  //     }
  //   },
  // ];

  // defaultColDef = {
  //   flex: 1,
  //   resizable: true,
  //   sortable: true,
  //   filter: true,
  //   suppressSizeToFit: true
  // };




  // onGridReady(params: any) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   this.gridApi.sizeColumnsToFit();
  //   this.getDataFields();
  // }


  // onHeaderCellClicked(event: any) {
  //   // event.column.getColDef().headerName gives the header text
  //   const clickedHeader = event?.column?.getColDef()?.headerName;
  //   if (clickedHeader === 'DQA') {
  //     // position the floating panel near mouse
  //     const mouseEvent = event.event as MouseEvent;
  //     const offsetX = 10; // small offset so it doesn't cover cursor
  //     const offsetY = 10;
  //     this.reportPosition = { x: mouseEvent.clientX + offsetX, y: mouseEvent.clientY + offsetY };
  //     this.reportVisible = true;
  //   }
  // }

  // selectedUseCaseId: string | null = null;

  openTab(tab: string) {
    if (tab == 'DataFields') {
      this.activeView = tab;
      this.showDataFields = true;
      this.showReport = false;
      this.selectedColumns = [...this.cols]; // Initially show all columns
      this.globalFilterFields = this.cols.map(c => c.field);
      this.getDataFields();
    }
    else if (tab == 'DQAReport') {
      this.activeView = tab;
      this.showDataFields = false;
      this.showReport = true;
      this.reportVisible = true;
      this.reportPosition = { x: 150, y: 100 };
    }

  }

  closeReportBuilder() {
    this.reportVisible = false;
    this.showReport = false;
  }

  onBuildReport(payload: any) {
    console.log('Report payload:', payload);

    this.targetService.downloadSampleReport(this.useCaseId, payload).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        console.error('Error downloading report:', err);
      }
    });
  }

  onCloseBuilder() {
    this.reportVisible = false;
    this.showReport = false;
    this.openTab('DataFileds');
  }

  // addRow() {
  //   const newItem = { fieldId: '', fieldNo: '', fieldName: '', description: '', dataType: '', fieldLength: '', criticality: '' };
  //   this.rowData = [...this.rowData, newItem];
  // }

  // onRowValueChanged(event: any) {
  //   console.log('Updated row:', event.data);
  // }

  ngOnInit(): void {

    this.selectedColumns = [...this.cols]; // Initially show all columns
    this.globalFilterFields = this.cols.map(c => c.field);

    console.log('Editing target with ID:', this.targetId);
    this.targetUseCaseForm = this.fb.group({
      selectedUseCaseId: [''],
    });
    this.targetForm = this.fb.group({
      target_name: ['', Validators.required],
      quality_of_service: ['', Validators.required],
      frequency_of_update: [1, Validators.required],
      schedule_of_update: [[], Validators.required],
      methodology_of_transfer: ['', Validators.required],
      target_type: ['', Validators.required],
      target_version_number: ['', Validators.required],
      target_status: ['', Validators.required],
      target_owner: ['', Validators.required],
      target_owner_email: ['', [Validators.required, Validators.email]],
      target_entity: ['', Validators.required],
      // add other form controls as needed
    });
    this.targetId = Number(this.route.snapshot.paramMap.get('id'));

    this.isBacktolineage = Boolean(this.route.snapshot.paramMap.get('isBacktolineage'));
    if(this.isBacktolineage)
    {      
      this.BacktolineagePath=sessionStorage.getItem('BackTolineagePath')?.toString();
    }

    if (this.targetId > 0) {
      this.loader=true;
      // Step 2: Fetch data from API and patch to form
      this.targetService.getTargetById(this.targetId).subscribe({
        next: (res: any) => {
          const data = res.targetEntity;
          this.targetForm.patchValue(data);
          this.toggleFieldsBasedOnQoS(data.quality_of_service);
          this.loader=false;
        },
        error: (err: any) => {
          console.error('Failed to load target:', err);
           this.loader=false;
        }
       
      });
      // this.generateTimeOptions();

      // setTimeout(() => {
      //   this.cdr.detectChanges(); // ensure UI updates  
      // }, 100);

      this.formLoaded = true; // triggers re-render


      // Watch for changes in quality_of_service
      this.targetForm.get('quality_of_service')?.valueChanges.subscribe(value => {
        this.toggleFieldsBasedOnQoS(value);
      });
      //  this.getDataFields();
     

      // Check if use case already selected and saved

      this.savedUseCase = localStorage.getItem('selectedUseCaseTarget');

      if (!this.savedUseCase) {
         this.getUsecaseList();
        // Open popup only if no use case saved
        setTimeout(() => {
          this.openUsecasePopup();
        }, 100);
      } else {
        // Restore saved use case
        const { useCaseId, useCaseName } = JSON.parse(this.savedUseCase);
        this.useCaseId = useCaseId;
        this.useCaseName = useCaseName;
      }
      this.openTab('DataFields');
      this.createForm();
    }
    else {
      this.formLoaded = true; // triggers re-render
      this.generateTimeOptions();
      // Watch for changes in serviceQuality
      this.targetForm.get('serviceQuality')?.valueChanges.subscribe(value => {
        if (value === 'STREAMING' || value === 'AD_HOC') {
          this.targetForm.get('frequencyUpdate')?.disable({ emitEvent: false });
          this.targetForm.get('updateSchedule')?.disable({ emitEvent: false });
        } else {
          this.targetForm.get('frequencyUpdate')?.enable({ emitEvent: false });
          this.targetForm.get('updateSchedule')?.enable({ emitEvent: false });
        }
      });
    }
  }

  generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour.toString().padStart(2, '0') + ':00';
      this.timeOptions.push(time);
    }
  }
  selectUseCase(view: string) {
    //this.activeView = view;
    this.getUsecaseList();
    setTimeout(() => {
      this.openUsecasePopup();
    }, 100);
  }




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

    console.log('Use Case ID:', this.useCaseId);
    console.log('Use Case Name:', this.useCaseName);

    // ✅ Save to localStorage so popup doesn’t appear again
    localStorage.setItem(
      'selectedUseCaseTarget',
      JSON.stringify({
        useCaseId: this.useCaseId,
        useCaseName: this.useCaseName
      })
    );

    // ✅ Close the dialog
    this.dialogRef.close();
  }

  getUsecaseList() {
    this.usecaseService.getLineageUsecase('TARGET', this.targetId).subscribe({
      next: (usecases: any[]) => {

        this.useCases = usecases;
        // ✅ Extract all use case IDs from API response
        const apiUseCaseIds = this.useCases.map(u => u.use_case_id);

        // ✅ Check if there's a stored use case in localStorage
        const storedUseCase = JSON.parse(localStorage.getItem('selectedUseCaseTarget') || 'null');

        if (storedUseCase) {
          const storedUseCaseId = storedUseCase.useCaseId;

          // ✅ If stored use case ID is NOT found in API response, remove it
          if (!apiUseCaseIds.includes(storedUseCaseId)) {
            console.warn(`Use case ID ${storedUseCaseId} not found in API response. Removing from localStorage.`);
            localStorage.removeItem('selectedUseCaseTarget');
          }
        }
      },
      error: err => {
        console.error('Error fetching usecases:', err);
      }
    });
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


  getDataFields() {
    this.datafieldsService.getDataFieldsByIdWithUsecase(this.targetId, 'TARGET', this.useCaseId).subscribe({
      next: (res: any) => {        
        if (res!=null && res.length>0) {
          this.rowData = [...res]; // triggers change
        }      
      },
      error: (err: any) => {
        this.rowData = [];
        console.error('Failed to load target:', err);
      }
    });
  }
  // Force refresh with setRowData



  // addDatafields(view: string) {
  //   this.activeView = view;
  //   this.showDataFieldsTable = true;
  //   this.showDataFields = true;
  //   this.showReport = false;
  //   this.getDataFields();
  // }

  // showDQA(view: string) {
  //   this.activeView = view;
  //   this.showDataFieldsTable = true;
  //   this.showDataFields = false;
  //   this.showReport = true;
  // }

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
    console.log('Form data:', this.targetForm.value);

    if (!this.targetForm.valid) {
      this.targetForm.markAllAsTouched();
      return;
    }

    const formValues = this.targetForm.value;
    const isStreamingOrAdHoc = formValues.quality_of_service === 'STREAMING' || formValues.quality_of_service === 'AD_HOC';


    // Base payload structure
    const payload: any = {
      targetEntity: {

        target_name: this.targetForm.value.target_name,
        quality_of_service: this.targetForm.value.quality_of_service,
        frequency_of_update: isStreamingOrAdHoc ? null : formValues.frequency_of_update,
        schedule_of_update: isStreamingOrAdHoc ? null : formValues.schedule_of_update,
        methodology_of_transfer: this.targetForm.value.methodology_of_transfer,
        target_type: this.targetForm.value.target_type,
        target_version_number: this.targetForm.value.target_version_number,
        target_status: this.targetForm.value.target_status,
        target_owner: this.targetForm.value.target_owner,
        target_owner_email: this.targetForm.value.target_owner_email,
        target_entity: this.targetForm.value.target_entity
      }
    }

    const isUpdate = this.targetId > 0;
    if (isUpdate) {
      payload.targetEntity.target_id = this.targetId;
    }

    const request$ = isUpdate
      ? this.targetService.updateTarget(payload)
      : this.targetService.createTarget(payload);

    request$.subscribe({
      next: (res) => {
        if (res) {
          const targetId = isUpdate ? this.targetId : res.targetEntity.target_id;
          const action = isUpdate ? 'Updated' : 'Created';
          this.toastNotificationService.success(`Target ${action} Successfully. Your Source ID is ${targetId}.`);

          if (!isUpdate) {
            this.router.navigate(['/targets/edit-target', targetId]);
          }
        }
      },
      error: (err) => {
        console.error('Error in source operation:', err);
        this.toastNotificationService.error('An error occurred while saving the source.');
      }
    });
  }
  onBack() {
    this.router.navigate(['/targets']);
  }

  onBackToLineage()
  {
     this.router.navigate(JSON.parse(this.BacktolineagePath));
  }

  createForm() {
    this.formGroup = this.fb.group({
      field_id: [''],
      field_no: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      field_name: ['', Validators.required],
      field_description: ['', Validators.required],
      field_length: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      data_type: ['', Validators.required],
      criticality: ['', Validators.required],
    });
  }

  openAddDialog() {
    this.isEditMode = false;
    //this.formGroup.reset();
    this.showDialog = true;
  }

  openEditDialog(rowData: any) {
    this.isEditMode = true;
    this.currentRow = rowData;
    this.formGroup.patchValue(rowData);
    this.showDialog = true;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.saveDatafields(this.formGroup.value);
  }
  saveDatafields(data: any) {
    //console.log(data, "Target Data Fields");

    this.dataFieldsModel.field_id = data.field_id;
    this.dataFieldsModel.user_generated_id = data.field_no;
    this.dataFieldsModel.field_name = data.field_name;
    this.dataFieldsModel.field_description = data.field_description;

   
    this.dataFieldsModel.data_type = data.data_type;
    this.dataFieldsModel.field_length = data.field_length;
    this.dataFieldsModel.criticality = data.criticality;
    this.dataFieldsModel.entity_type = 'TARGET';
    this.dataFieldsModel.entity_id = this.targetId;
    this.dataFieldsModel.usecaseid = this.useCaseId;


    if (!data.field_id && !this.isEditMode && !this.currentRow) {
      this.datafieldsService.createDataFields(this.dataFieldsModel).subscribe((res) => {
        if (res!=null) {
          data.field_id=res.field_id;
          this.rowData.push(data);
          this.toastNotificationService.success("Data field added Successfully.");         
          this.showDialog = false;
        }
      });
    }
    else {
      this.datafieldsService.updateInterface(this.dataFieldsModel).subscribe(() => {
        Object.assign(this.currentRow, this.formGroup.value);
        this.toastNotificationService.success("Data field updated Successfully.");       
        this.showDialog = false;
      });
    }
  }

  showDeleteDialog = false;
  selectedRow: any;

  confirmDelete(row: any) {
    this.selectedRow = row;
    this.showDeleteDialog = true;
  }

  deleteRow() {    
    this.datafieldsService.deleteDataFields(this.selectedRow.field_id, 'TARGET', this.targetId).subscribe(() => {      
      this.toastNotificationService.error("Data fields Deleted Successfully.");    
      this.rowData = this.rowData.filter((r:any) => r.field_id !== this.selectedRow.field_id); 
        this.showDeleteDialog = false; 
    })
  }
  
}
