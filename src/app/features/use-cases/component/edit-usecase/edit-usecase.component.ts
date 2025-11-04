import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
// All Community Features
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { filter } from 'rxjs';
import { UsecaseService } from '../../services/usecase.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { LineageService } from 'src/app/features/graph-embedded/services/lineage.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-edit-usecase',
  // standalone: true,
  // imports: [],
  templateUrl: './edit-usecase.component.html',
  styleUrl: './edit-usecase.component.scss'
})
export class EditUsecaseComponent {
  usecaseForm!: FormGroup;
  showDataFields = false;
  lineage_json: any;

  // ✅ DataFields table data
  dataFields: any[] = [
    { fieldId: 1, fieldName: 'A', dataType: 'Num' },
    { fieldId: 2, fieldName: 'B', dataType: 'Alpha' }
  ];

  // ✅ Table column names
  statusOptions: string[] = ['NEW',
    'DRAFT',
    'READY_FOR_REVIEW',
    'IN_REVIEW',
    'APPROVED_READY_FOR_PRODUCTION',
    'APPROVED_IN_PRODUCTION',
    'NEEDS_REVIEW',
    'EXPIRED',
    'REJECTED'];
  displayedColumns: string[] = ['fieldId', 'fieldName', 'dataType', 'fieldLength', 'riskLevel', 'criticality', 'actions'];
  usecaseId!: any;
  useCaseName = '';
  lineageName = '';
  gridApi: any;
  gridColumnApi: any;
  formLoaded = false;
  activeView!: string; // default view on load

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private usecaseService: UsecaseService,
    private toastNotificationService: ToastnotificationService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private lineageService: LineageService,

  ) { }


  columnDefs: ColDef[] = [
    { field: 'fieldName', headerName: 'Field Name', editable: true },
    { field: 'dataType', headerName: 'Data Type', editable: true },
    { field: 'value', headerName: 'Value', editable: true },
    { field: 'description', headerName: 'Description', editable: true },
    {
      headerName: 'Actions',
      editable: false,
      filter: false,
      sortable: false,
      minWidth: 80,
      maxWidth: 120,
      // flex: 1,
      pinned:'right',
      cellRenderer: (params: any) => {
        const value = params.value || '';

        const div = document.createElement('div');
        div.className = 'model-cell-renderer';
        const buttonar = document.createElement('button');
        buttonar.className = 'fa fa-trash';
        // buttonar.style.marginRight = '5px';
        buttonar.style.border = '1px solid lightGrey';
        buttonar.style.borderRadius = '5px';
        buttonar.style.lineHeight = '22px';
        buttonar.style.height = '32px';
        buttonar.innerHTML = '';
        buttonar.addEventListener('click', () => {
          this.onDeleteRecord();
        });

        // div.appendChild(buttonwip);
        div.appendChild(buttonar);

        return div;
      }
    },
  ];

  defaultColDef = {
    flex: 1,
    resizable: true,
    filter: true,
  };

  rowData = [
    { fieldName: 'Name', dataType: 'String', value: 'John Doe', description: 'User full name' },
    { fieldName: 'Age', dataType: 'Number', value: 30, description: 'User age' }
  ];


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
    console.log('Editing usecase with ID:', this.usecaseId);
    this.usecaseForm = this.fb.group({
      use_case_name: [''],
      use_case_description: [''],
      use_case_owner: [''],
      use_case_owner_email: [''],
      status: [''],
      version: [''],
      last_review_date: [null],
      reviewed_by: [''],
      next_review_date: [null],
      reviewer: [''],
    });

    // 🧹 Clear any stale Angular Material overlays
    this.usecaseId = Number(this.route.snapshot.paramMap.get('id'));

    // Step 2: Fetch data from API and patch to form
    this.usecaseService.getUsecaseById(this.usecaseId).subscribe({
      next: (res: any) => {
        const data = res.useCaseEntity;
        this.useCaseName = data.use_case_name;
        this.usecaseForm.patchValue({
          ...data,
          last_review_date: data.last_review_date ? new Date(data.last_review_date) : null,
          next_review_date: data.next_review_date ? new Date(data.next_review_date) : null
        });

        setTimeout(() => {
          this.cdr.detectChanges(); // ensure UI updates  
        }, 100);

        this.formLoaded = true; // triggers re-render

      },
      error: (err: any) => {
        console.error('Failed to load usecase:', err);
      }
    });

  }

  setActiveView(view: string) {
    this.activeView = view;
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
    //console.log('Form data:', this.usecaseForm.value);
    // Submit or save logic here
    const payload = {
      useCaseEntity: {
        use_case_id: this.usecaseId,
        use_case_name: this.usecaseForm.value.use_case_name,
        use_case_description: this.usecaseForm.value.use_case_description,
        use_case_owner: this.usecaseForm.value.use_case_owner,
        use_case_owner_email: this.usecaseForm.value.use_case_owner_email,
        version: this.usecaseForm.value.version,
        status: this.usecaseForm.value.status,
        last_review_date: this.usecaseForm.value.last_review_date,
        reviewed_by: this.usecaseForm.value.reviewed_by,
        next_review_date: this.usecaseForm.value.next_review_date,
        reviewer: this.usecaseForm.value.reviewer

      }
    }
    this.usecaseService.updateUseCase(payload).subscribe(res => {
      if (res) {
        // alert("Interface Updated Successfully. Your Interface ID is "+ this.interfaceId);
        this.toastNotificationService.success("Usecase Updated Successfully.");
        // window.location.reload();
      }
    })
  }

  saveDatafields(data: any) {

  }

  deleteDAtaFields(data: any, id: number) {

  }


  existingLineage(view: string) {
    this.activeView = view;

    this.usecaseService.navigateToLineage(this.usecaseId).subscribe({
      next: (response) => {
        this.lineage_json = Array.isArray(response) ? response[0] : response;
        if (this.lineage_json.lineage_json !== "{}") {
          const lineage = Array.isArray(response) ? response[0] : response;
          if (lineage) {
            this.router.navigate(['/graph-embedded/edit-lineage', this.usecaseId, lineage.id]);
          }
        }
        else {
          this.toastNotificationService.error("No lineage found for useCaseId : " + this.usecaseId);
          // setTimeout(() => {
          //   this.getUsecaseList(); // refresh
          // }, 1000);
        }
      },
      error: (err) => {
        console.error("Failed to fetch lineageId:", err);
      }
    });
    // this.router.navigate(['/graph-embedded/edit-lineage/', this.usecaseId, this.usecaseForm.value.lineageId]);

  }
  newLineage(view: string) {
    this.activeView = view;

    this.openLineagePopup();
  }
  @ViewChild('lineagePopup') lineagePopup!: TemplateRef<any>;


  openLineagePopup() {
    const dialogRef = this.dialog.open(this.lineagePopup);

    dialogRef.afterClosed().subscribe(result => {
      this.lineageName = '';
    });
  }


  //   saveLineage() {
  //     // this.existingLineage('existing');
  //     this.usecaseService.navigateToLineage(this.usecaseId).subscribe({
  //       next: (response) => {
  //         this.lineage_json = Array.isArray(response) ? response[0] : response;

  //     const payload = {
  //       use_case_id: this.usecaseId,
  //       lineage_name: this.lineageName,
  //       lineage_json: this.lineage_json.lineage_json
  //     };

  //     if(this.lineage_json.lineage_json == '{}')
  //     {
  //     this.lineageService.createLineage(payload).subscribe({
  //       next: (res) => {
  //         console.log('Lineage created:', res);
  //         this.dialog.closeAll();
  //         this.router.navigate(['/graph-embedded']); // redirect to graph with lineage id
  //       },
  //       error: (err) => {
  //         console.error('Error creating lineage:', err);
  //       }

  //     });
  //   }
  //   else
  //   {

  //     const payload = {};
  //     this.lineageService.updateLineage(payload,this.usecaseId,this.lineageName).subscribe({
  //       next: (res) => {
  //         console.log('Lineage created:', res);
  //         this.dialog.closeAll();
  //         this.router.navigate(['/graph-embedded']); // redirect to graph with lineage id
  //       },
  //       error: (err) => {
  //         console.error('Error creating lineage:', err);
  //       }

  //     });
  //   }
  //   }
  // })}



  private isEmptyLineage(value: any): boolean {
    // Accepts string or object and treats {}, empty string, null/undefined as empty
    if (value == null) return true;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' || trimmed === '{}' || trimmed === '[]';
    }
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    return false;
  }

  saveLineage() {
    this.usecaseService.navigateToLineage(this.usecaseId).pipe(
      // Normalize response shape (array vs object)
      map((resp: any) => Array.isArray(resp) ? resp[0] : resp),

      // Decide create vs update based on response content
      switchMap((resp: any) => {
        const existingLineageJsonRaw =
          resp?.lineage_json?.lineage_json ?? // case: nested object with lineage_json.lineage_json (string)
          resp?.lineage_json ??               // case: lineage_json is directly the string/object
          null;

        const shouldCreate = !resp || this.isEmptyLineage(existingLineageJsonRaw);

        // Build payload. If we’re creating because nothing exists, send "{}" as a minimal body.
        const payload = {
          use_case_id: this.usecaseId,
          lineage_name: this.lineageName,
          lineage_json: shouldCreate
            ? '{}' // create with a blank body if none exists
            : existingLineageJsonRaw
        };

        if (shouldCreate) {
          return this.lineageService.createLineage(payload).pipe(
            tap(() => console.log('Lineage created (no existing or empty).'))
          );
        } else {
          return this.lineageService.updateLineage(payload, this.usecaseId, this.lineageName).pipe(
            tap(() => console.log('Lineage updated (existing & non-empty).'))
          );
        }
      }),

      // If the initial fetch FAILED, we create
      catchError((err) => {
        console.error('Fetch lineage failed, creating instead:', err);
        const fallbackPayload = {
          use_case_id: this.usecaseId,
          lineage_name: this.lineageName,
          lineage_json: '{}'
        };
        return this.lineageService.createLineage(fallbackPayload).pipe(
          tap(() => console.log('Lineage created (fallback after fetch failure).'))
        );
      })
    )
      .subscribe({
        next: () => {
          this.dialog.closeAll();
          this.router.navigate(['/graph-embedded']);
        },
        error: (err) => {
          console.error('Final error in saveLineage flow:', err);
        }
      });
  }

  onBack() {
    this.router.navigate(['/use-cases']);
  }
}
