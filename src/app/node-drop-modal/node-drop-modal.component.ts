import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-node-drop-modal',
  template: `
    <h2 mat-dialog-title>Select {{ data.typeName }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Choose a value</mat-label>
        <mat-select [(value)]="selectedValue">
          <mat-option *ngFor="let option of data.items" [value]="option.label">
            {{ option.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-button color="primary" [disabled]="!selectedValue" (click)="submit()">OK</button>
    </mat-dialog-actions>
  `
})
export class NodeDropModalComponent {
  selectedValue: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<NodeDropModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    this.dialogRef.close(this.selectedValue);
  }
}
