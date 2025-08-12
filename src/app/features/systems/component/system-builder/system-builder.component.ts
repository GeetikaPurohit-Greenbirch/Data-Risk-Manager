import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemsModel } from '../../models/systems-model.model';
import { SystemServiceService } from '../../services/system-service.service';
import { Router } from '@angular/router';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';

@Component({
  selector: 'app-system-builder',
  templateUrl: './system-builder.component.html',
  styleUrls: ['./system-builder.component.scss']
})
export class SystemBuilderComponent implements OnInit {
  systemForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
  accuracyRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  timlinessRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  systemModel : SystemsModel = new SystemsModel();

  constructor(private fb: FormBuilder, private systemService: SystemServiceService,
    private router: Router,
    private toastNotificationService: ToastnotificationService,
  ) {}

  ngOnInit(): void {
    this.systemForm = this.fb.group({
      systemName: ['', Validators.required],
      leanixId: ['', Validators.required],
      description: ['', Validators.required],
      owner: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      version: ['', Validators.required],
      status: ['', Validators.required],
      // accuracyRisk:['', Validators.required],
      // timlinessRisk: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.systemForm.valid) {
      console.log('System Data:', this.systemForm.value);
      // call API here
      
      const payload = {
        systemEntity: {
      // this.systemModel.system_id = this.systemForm.value.systemId;
     system_name : this.systemForm.value.systemName,
      leanix_id : this.systemForm.value.leanixId,
      description : this.systemForm.value.description,
      owner : this.systemForm.value.owner,
      owner_email : this.systemForm.value.ownerEmail,
      version_number : this.systemForm.value.version,
      status : this.systemForm.value.status,
      // this.systemModel.accuracy_risk = this.systemForm.value.accuracyRisk;
      // this.systemModel.timeliness_risk = this.systemForm.value.timlinessRisk;
        }
      }
      this.systemService.createSystem(payload).subscribe(res => {
        if(res)
        {
          console.log(res, "System builder created");
          // alert("System Created Successfully. Your System ID is "+ res.systemEntity.system_id);
          this.toastNotificationService.success("System Created Successfully. Your System ID is "+ res.systemEntity.system_id);

          // window.location.reload();
          this.router.navigate(['/systems/edit-system', res.systemEntity.system_id]);

        }
      })
      
    } else {
      this.systemForm.markAllAsTouched(); // show validation errors
    }
  }
}
