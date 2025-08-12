import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemEntity, SystemsModel } from '../models/systems-model.model';
import { SystemServiceService } from '../services/system-service.service';
import { ToastnotificationService } from '../../shared-services/toastnotification.service';

@Component({
  selector: 'app-edit-system-dialog',
  templateUrl: './edit-system-dialog.component.html'
})
export class EditSystemDialogComponent {
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION', 'PRODUCTION', 'PRODUCTION'];
  accuracyRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  timlinessRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  systemModel : SystemEntity = new SystemEntity();

  constructor(
    public dialogRef: MatDialogRef<EditSystemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SystemEntity,
    private systemService: SystemServiceService,
        private toastNotificationService: ToastnotificationService,
    
  ) {
    console.log(data, "row data to edit");
  }

  onSave(): void {
    console.log(this.data, "updated data");
    this.systemModel.system_id = this.data.system_id
    this.systemModel.system_id = this.data.system_id;
    this.systemModel.system_name = this.data.system_name;
    this.systemModel.leanix_id = this.data.leanix_id;
    this.systemModel.description = this.data.description;
    this.systemModel.owner = this.data.owner;
    this.systemModel.owner_email = this.data.owner_email;
    this.systemModel.version_number = this.data.version_number;
    this.systemModel.status = this.data.status;
    // this.systemModel.accuracy_risk = this.data.accuracy_risk;
    // this.systemModel.timeliness_risk = this.data.timeliness_risk;
    this.systemService.updateSystem(this.systemModel).subscribe(res => {
      if(res)
      {
        // alert("System Updated Successfully. Your System ID is "+ res.id);
        this.toastNotificationService.success("System Updated Successfully. Your System ID is "+ res.id);

        // window.location.reload();
      }
    })
    this.dialogRef.close(this.data); // return updated data
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
