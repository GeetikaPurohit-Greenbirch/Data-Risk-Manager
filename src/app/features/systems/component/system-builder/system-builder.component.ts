import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemsModel } from '../../models/systems-model.model';
import { SystemServiceService } from '../../services/system-service.service';

@Component({
  selector: 'app-system-builder',
  templateUrl: './system-builder.component.html',
  styleUrls: ['./system-builder.component.scss']
})
export class SystemBuilderComponent implements OnInit {
  systemForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION', 'PRODUCTION', 'PRODUCTION'];
  accuracyRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  timlinessRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  systemModel : SystemsModel = new SystemsModel();

  constructor(private fb: FormBuilder, private systemService: SystemServiceService) {}

  ngOnInit(): void {
    this.systemForm = this.fb.group({
      systemName: ['', Validators.required],
      systemId: ['', Validators.required],
      leanixId: ['', Validators.required],
      description: ['', Validators.required],
      owner: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      version: ['', Validators.required],
      status: ['', Validators.required],
      accuracyRisk:['', Validators.required],
      timlinessRisk: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.systemForm.valid) {
      console.log('System Data:', this.systemForm.value);
      // call API here
      
      this.systemModel.system_id = this.systemForm.value.systemId;
      this.systemModel.system_name = this.systemForm.value.systemName;
      this.systemModel.leanix_id = this.systemForm.value.leanixId;
      this.systemModel.description = this.systemForm.value.description;
      this.systemModel.owner = this.systemForm.value.owner;
      this.systemModel.owner_email = this.systemForm.value.ownerEmail;
      this.systemModel.version_number = this.systemForm.value.version;
      this.systemModel.status = this.systemForm.value.status;
      this.systemModel.accuracy_risk = this.systemForm.value.accuracyRisk;
      this.systemModel.timeliness_risk = this.systemForm.value.timlinessRisk;

      this.systemService.createSystem(this.systemModel).subscribe(res => {
        if(res)
        {
          alert("System Created Successfully. Your System ID is "+ res.id);
          window.location.reload();
        }
      })
      
    } else {
      this.systemForm.markAllAsTouched(); // show validation errors
    }
  }
}
