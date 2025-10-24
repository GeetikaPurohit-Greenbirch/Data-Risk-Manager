import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsecaseService } from '../../services/usecase.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { MatDialog } from '@angular/material/dialog';
import { LineageService } from 'src/app/features/graph-embedded/services/lineage.service';
import { catchError, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-create-use-case',
  // standalone: true,
  // imports: [],
  templateUrl: './create-use-case.component.html',
  styleUrl: './create-use-case.component.scss',
})

export class CreateUseCaseComponent {
  usecaseForm!: FormGroup;
  statusOptions = ['NEW',
    'DRAFT',
    'READY_FOR_REVIEW',
    'IN_REVIEW',
    'APPROVED_READY_FOR_PRODUCTION',
    'APPROVED_IN_PRODUCTION',
    'NEEDS_REVIEW',
    'EXPIRED',
    'REJECTED'];
  accuracyRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  timlinessRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  activeView!: string; // default view on load
  @ViewChild('lineagePopup') lineagePopup!: TemplateRef<any>;
  usecaseId!: any;
  lineage_json: any;
  lineageName = "";
  useCaseName="";
  pageTitle: string = 'Create Use Case';

  constructor(private fb: FormBuilder,
    private usecaseService: UsecaseService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
    private dialog: MatDialog,
    private lineageService: LineageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.usecaseForm = this.fb.group({
    //   usecaseName: ['', Validators.required],
    //   description: ['', Validators.required],
    //   owner: ['', Validators.required],
    //   ownerEmail: ['', [Validators.required, Validators.email]],
    //   version: ['', Validators.required],
    //   status: ['', Validators.required],
    //   lastreviewdate: [''],
    //   reviewedby: [''],
    //   nextreviewdate: [''],
    //   reviewer: ['']
    // });
    this.usecaseForm = this.fb.group({
      use_case_name: ['', Validators.required],
      use_case_description: ['', Validators.required],
      use_case_owner: ['', Validators.required],
      use_case_owner_email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      version: ['', Validators.required],
      last_review_date: [null],
      reviewed_by: [''],
      next_review_date: [null],
      reviewer: [''],
    });

    // 👇 Watch status and apply validators conditionally
    this.usecaseForm.get('status')?.valueChanges.subscribe(status => {
      const requiresReview =
        status === 'APPROVED_READY_FOR_PRODUCTION' ||
        status === 'APPROVED_IN_PRODUCTION';

      const controls = ['lastreviewdate', 'reviewedby', 'nextreviewdate', 'reviewer'];

      controls.forEach(ctrlName => {
        const control = this.usecaseForm.get(ctrlName);
        if (requiresReview) {
          control?.setValidators(Validators.required);
        } else {
          control?.clearValidators();
        }
        control?.updateValueAndValidity({ emitEvent: false });
      });
    });

    this.usecaseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.usecaseId > 0) {
      this.bindUseCaseData(this.usecaseId);
      this.pageTitle = 'Edit Use Case';
    }
  }

  bindUseCaseData(usecaseId: number) {
    this.usecaseService.getUsecaseById(usecaseId).subscribe({
      next: (res: any) => {
        const data = res.useCaseEntity;
        console.log("usecasedetail:", data);
        this.useCaseName = data.use_case_name;
        this.usecaseForm.patchValue({
          ...data,
          last_review_date: data.last_review_date ? new Date(data.last_review_date) : null,
          next_review_date: data.next_review_date ? new Date(data.next_review_date) : null
        });      
      },
      error: (err: any) => {
        console.error('Failed to load usecase:', err);
      }
    });
  }

  onSubmit() {
    if (this.usecaseForm.valid) {
      console.log('UseCase Data:', this.usecaseForm.value);

      const payload = {
        useCaseEntity: {
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
      if (this.usecaseId > 0) {
        this.usecaseService.updateUseCase(payload).subscribe(res => {
          if (res) {
            this.toastNotificationService.success("Usecase Updated Successfully.");
            this.onBack();
          }
        })
      }
      else {
        this.usecaseService.createUsecase(payload).subscribe(res => {
          if (res) {
            this.toastNotificationService.success("UseCase Created Successfully. Your UseCase ID is " + res.useCaseEntity.use_case_id);
            //this.router.navigate(['/use-cases/edit-usecase', res.useCaseEntity.use_case_id]);
            this.onBack();
          }
        })
      }

    } else {
      this.usecaseForm.markAllAsTouched(); // show validation errors
    }
  }

  onBack() {
    this.router.navigate(['/use-cases']);
  }

  setActiveView(view: string) {
    this.activeView = view;
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
        }
      },
      error: (err) => {
        console.error("Failed to fetch lineageId:", err);
      }
    });
  }

  newLineage(view: string) {
    this.activeView = view;
    this.openLineagePopup();
  }

  openLineagePopup() {
    const dialogRef = this.dialog.open(this.lineagePopup);
    dialogRef.afterClosed().subscribe(result => {
      this.lineageName = '';
    });
  }
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

}
