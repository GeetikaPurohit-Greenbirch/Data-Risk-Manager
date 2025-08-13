import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { TargetService } from '../../services/target.service';
import { Target } from '../../models/target.model';
import { Router } from '@angular/router';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';


@Component({
  selector: 'app-target-builder',
  // standalone: true,
  // imports: [],
  templateUrl: './target-builder.component.html',
  styleUrl: './target-builder.component.scss'
})
export class TargetBuilderComponent {
targetForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
  serviceQualityOptions = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  targetTypeOptions = ['SYSTEM', 'MANUAL ENTRY']
  targetModel : Target = new Target();
  timeOptions: string[] = [];
  frequencyLimit = 1;
  scheduleLimitReached = false;
  constructor(private fb: FormBuilder, private targetService: TargetService,
    private router: Router,            
    private toastNotificationService: ToastnotificationService,
    
  ) {} 

  ngOnInit(): void {
    this.targetForm = this.fb.group({
      targetName: ['', Validators.required],
      serviceQuality: ['', Validators.required],
      frequencyUpdate:[1,Validators.required],
      updateSchedule: [[], Validators.required],
      transferMethodology:['',Validators.required],
      targetType:['',Validators.required],
      version: ['', Validators.required],
      status: ['', Validators.required],
      owner: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      entity: ['', Validators.required]
      });
      this.generateTimeOptions();

      
      
       // Watch for changes in serviceQuality
  this.targetForm.get('serviceQuality')?.valueChanges.subscribe(value => {
    if (value === 'STREAMING' || value === 'AD_HOC') {
      this.targetForm.get('frequencyUpdate')?.disable({ emitEvent: false });
      this.targetForm.get('updateSchedule')?.disable({ emitEvent: false });
    } else {
      this.targetForm.get('frequencyUpdate')?.enable({ emitEvent: false });
      this.targetForm.get('updateSchedule')?.enable({ emitEvent: false });
    }
  });
  }


  generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour.toString().padStart(2, '0') + ':00';
      this.timeOptions.push(time);
    }
  }

  onFrequencyChange(): void {
    const freq = +this.targetForm.get('frequencyUpdate')?.value || 1;
    this.frequencyLimit = freq;

    const currentSelection = this.targetForm.get('updateSchedule')?.value || [];
    if (currentSelection.length > freq) {
      this.targetForm.get('updateSchedule')?.setValue(currentSelection.slice(0, freq));
    }
  }

  onScheduleSelectionChange(event: MatSelectChange): void {
    const selected = event.value || [];
    if (selected.length > this.frequencyLimit) {
      this.scheduleLimitReached = true;
      // Keep only allowed number of selections
      this.targetForm.get('updateSchedule')?.setValue(selected.slice(0, this.frequencyLimit));
    } else {
      this.scheduleLimitReached = false;
    }
  }

  getSelectedTimesAsCommaString(): string {
    return (this.targetForm.get('updateSchedule')?.value || []).join(', ');
  }

  onSubmit() {
    if (this.targetForm.valid) {
      console.log('Target Data:', this.targetForm.value);
      // call API here
      const payload = {
        targetEntity: {
          target_name : this.targetForm.value.targetName,
          quality_of_service : this.targetForm.value.serviceQuality,
          frequency_of_update:this.targetForm.value.frequencyUpdate,
          schedule_of_update:this.targetForm.value.updateSchedule,
          methodology_of_transfer:this.targetForm.value.transferMethodology,
          target_type:this.targetForm.value.targetType,
          target_version_number : this.targetForm.value.version,
          target_status : this.targetForm.value.status,
          target_owner: this.targetForm.value.owner,
          target_owner_email: this.targetForm.value.ownerEmail,
          target_entity : this.targetForm.value.entity
     
        }
      }
      this.targetService.createTarget(payload).subscribe((res: { targetEntity: { target_id: string; }; }) => {
        if(res)
        {
          console.log(res, "Target builder created");
          // alert("Target Created Successfully. Your Target ID is "+ res.targetEntity.target_id);
          this.toastNotificationService.success("Target Created Successfully. Your Target ID is "+ res.targetEntity.target_id);

          // window.location.reload();
          this.router.navigate(['/targets/edit-target', res.targetEntity.target_id]);

        }
      })
      
    } else {
      this.targetForm.markAllAsTouched(); // show validation errors
    }
  }
}
