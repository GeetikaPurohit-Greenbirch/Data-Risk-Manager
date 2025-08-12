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

export interface AddLineageDialogData {
  mode: 'add' | 'edit';
  usecaseOptions: { id: string; name: string }[];
  // present only in edit mode
  value?: { lineage_id: string; lineage_name: string; usecase_id: string };
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
    usecase_id: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddLineageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddLineageDialogData
  ) {
    // Prefill for edit; set a sensible default for add
    if (data.mode === 'edit' && data.value) {
      this.form.patchValue({
        lineage_name: data.value.lineage_name,
        usecase_id: data.value.usecase_id,
      });
    } else {
      const first = data.usecaseOptions?.[0];
      if (first) this.form.patchValue({ usecase_id: first.id });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close({
      mode: this.data.mode,
      lineage_id: this.data.value?.lineage_id ?? null,
      lineage_name: this.form.value.lineage_name?.trim(),
      usecase_id: this.form.value.usecase_id,
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
