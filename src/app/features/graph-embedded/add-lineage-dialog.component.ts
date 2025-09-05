// src/app/features/graph-embedded/add-lineage-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { LineageService } from './services/lineage.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';

export interface AddLineageDialogData {
  mode: 'add' | 'edit';
  usecaseOptions: { id: string; name: string }[];
  // present only in edit mode
  value?: { lineage_id: string; lineage_name: string; use_case_id: string };
}

@Component({
  selector: 'app-add-lineage-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './add-lineage-dialog.component.html'
})
export class AddLineageDialogComponent {
  form = this.fb.group({
    lineage_name: ['', Validators.required],
    use_case_id: ['', Validators.required],
  });

  constructor(
    private lineageService: LineageService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddLineageDialogComponent>,
    private toastNotificationService: ToastnotificationService,
    @Inject(MAT_DIALOG_DATA) public data: AddLineageDialogData
  ) {
    // Prefill for edit; set a sensible default for add
    if (data.mode === 'edit' && data.value) {
      this.form.patchValue({
        lineage_name: data.value.lineage_name,
        use_case_id: data.value.use_case_id,
      });
    } else {
      const first = data.usecaseOptions?.[0];
      if (first) this.form.patchValue({ use_case_id: first.id });
    }
  }

  save() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  const payload = {
    lineage_name: this.form.value.lineage_name?.trim(),
    use_case_id: this.form.value.use_case_id,
  };

  if (this.data.mode === 'add') {
    this.lineageService.createLineage(payload).subscribe({
      next: (res) => {
        this.toastNotificationService.success('Lineage created successfully');
        // ✅ Close only after API resolves
        this.dialogRef.close({
          mode: 'add',
          lineage_id: res?.lineage_id ?? null,
          ...payload,
        });
      },
      error: (err) => {
        console.error('Error creating lineage:', err);
        this.toastNotificationService.error('Failed to create lineage');
      }
    });
  }else if (this.data.mode === 'edit' && this.data.value?.lineage_id) {
      // EDIT flow -> update, then close
      this.lineageService.updateLineage(payload).subscribe({
        next: () => {
          this.toastNotificationService.success('Lineage updated successfully');
          this.dialogRef.close({
            mode: 'edit',
            lineage_id: this.data.value!.lineage_id,
            ...payload,
          });
        },
        error: (err) => {
        console.error('Error creating lineage:', err);
        this.toastNotificationService.error('Failed to create lineage');
      }
      });
    }

  // (edit path similar: call update, then close in next)
}

  cancel() {
    this.dialogRef.close();
  }
}
