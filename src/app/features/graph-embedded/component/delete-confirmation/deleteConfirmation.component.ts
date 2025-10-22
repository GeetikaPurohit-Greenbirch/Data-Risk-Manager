// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title class="dialog-title">Confirm Delete</h2>

    <mat-dialog-content class="dialog-content">
      <p>
        Are you sure you want to delete <b>{{ data.name }}</b
        >?
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="center" class="dialog-actions">
      <button
        mat-stroked-button
        color="primary"
        (click)="onCancel()"
        aria-label="Cancel delete"
      >
        Cancel
      </button>
      <button
        mat-raised-button
        color="warn"
        (click)="onConfirm()"
        aria-label="Confirm delete"
      >
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-title {
        text-align: center;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .dialog-content {
        text-align: center;
        font-size: 15px;
        padding: 10px 20px;
        color: #333;
      }

      .dialog-actions {
        justify-content: center;
        padding: 15px 0;
        gap: 15px;
      }

      .dialog-actions button {
        min-width: 90px;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
