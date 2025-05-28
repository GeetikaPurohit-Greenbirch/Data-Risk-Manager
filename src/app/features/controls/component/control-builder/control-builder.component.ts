import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Control } from '../../models/control.model';
import { ControlService } from '../../services/control.service';
@Component({
  selector: 'app-control-builder',
  // standalone: true,
  // imports: [],
  templateUrl: './control-builder.component.html',
  styleUrl: './control-builder.component.scss'
})
export class ControlBuilderComponent {
controlForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED','PRODUCTION'];
  controlEffectOptions = ['INDIVIDUAL', 'ALL'];
  controlApplicationOptions= ['APPLIED', 'NOT_APPLIED', 'AUTOMATED'];
  controlTypeOptions = ['SYSTEM', 'MANUAL ENTRY']
  controlModel : Control = new Control();
  timeOptions: string[] = [];
  frequencyLimit = 1;
  scheduleLimitReached = false;
  constructor(private fb: FormBuilder, private controlService: ControlService,
    private router: Router
  ) {} 

  ngOnInit(): void {
    this.controlForm = this.fb.group({
      controlName: ['', Validators.required],
      controlDescription:['',Validators.required],
      controlType:['',Validators.required],
      version: ['', Validators.required],
      status: ['', Validators.required],
      controlEffect: ['', Validators.required],
      controlApplication: [''],
      });
      
  }

  onStatusChange(statusValue: string): void {
 // Status change logic
  const draftStatuses = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'];
  if (statusValue === 'PRODUCTION') {
    this.controlForm.get('controlApplication')?.setValue('APPLIED');
  } else if (draftStatuses.includes(statusValue)) {
    this.controlForm.get('controlApplication')?.setValue('NOT_APPLIED');
  }
  }


  onSubmit() {
    if (this.controlForm.valid) {
      console.log('Control Data:', this.controlForm.value);
      // call API here
      const payload = {
        controlEntity: {
          control_name:this.controlForm.value.controlName, 
          control_description:this.controlForm.value.controlDescription,
          control_type:this.controlForm.value.controlType,
          version_number : this.controlForm.value.version,
          status : this.controlForm.value.status,
          control_effect:this.controlForm.value.controlEffect,
          control_application:this.controlForm.value.controlApplication,
       
     
     
        }
      }
      this.controlService.createControl(payload).subscribe((res: { controlEntity: { control_id: string; }; }) => {
        if(res)
        {
          console.log(res, "Control builder created");
          alert("Control Created Successfully. Your Control ID is "+ res.controlEntity.control_id);
          // Navigate to Edit Control page with the ID
          this.router.navigate(['/controls/edit-control', res.controlEntity.control_id]);
        }
      })
      
    } else {
      this.controlForm.markAllAsTouched(); // show validation errors
    }
  }
}
