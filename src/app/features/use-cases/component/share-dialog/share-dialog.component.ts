import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
})
export class ShareDialogComponent implements OnInit {
  userList: any[] = [];
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      selectedUsers: [[]],
      permission: ['view'],
    });
  }

  ngOnInit() {
    // this.data.useCaseId can be used to fetch user list
    // Call API to get users with share flag
    // Example API call (replace with your service)
    // this.apiService.getShareableUsers(this.data.useCaseId).subscribe(users => this.userList = users);
    this.userList = this.data.users; // mocked API response
  }

  onSubmit() {
    const payload = {
      useCaseId: this.data.useCaseId,
      users: this.form.value.selectedUsers,
      permission: this.form.value.permission,
    };
    this.dialogRef.close(payload); // return to parent
  }

  onCancel() {
    this.dialogRef.close();
  }
}
