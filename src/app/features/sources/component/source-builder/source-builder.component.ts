import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sources } from '../../models/sources.model';
import { SourceService } from '../../services/source.service';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';


@Component({
  selector: 'app-source-builder',
  // standalone: true,
  // imports: [],
  templateUrl: './source-builder.component.html',
  styleUrl: './source-builder.component.scss'
})
export class SourceBuilderComponent {
  sourceForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
  serviceQualityOptions = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  sourceTypeOptions = ['SYSTEM', 'MANUAL ENTRY'];
  sourceModel : Sources = new Sources();
  timeOptions: string[] = [];
  frequencyLimit = 1;
  scheduleLimitReached = false;
  constructor(private fb: FormBuilder, private sourceService: SourceService,
    private router: Router,
     private toastNotificationService: ToastnotificationService,
  ) {}

  ngOnInit(): void {
    this.sourceForm = this.fb.group({
      sourceName: ['', Validators.required],
      vendor:['', Validators.required],
      serviceQuality: ['', Validators.required],
      frequencyUpdate:[1,Validators.required],
      updateSchedule: [[], Validators.required],
      transferMethodology:['',Validators.required],
      sourceType:['',Validators.required],
      version: ['', Validators.required],
      status: ['', Validators.required],
      owner: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      });
      this.generateTimeOptions();

      
       // Watch for changes in serviceQuality
  this.sourceForm.get('serviceQuality')?.valueChanges.subscribe(value => {
    if (value === 'STREAMING' || value === 'AD_HOC') {
      this.sourceForm.get('frequencyUpdate')?.disable({ emitEvent: false });
      this.sourceForm.get('updateSchedule')?.disable({ emitEvent: false });
    } else {
      this.sourceForm.get('frequencyUpdate')?.enable({ emitEvent: false });
      this.sourceForm.get('updateSchedule')?.enable({ emitEvent: false });
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
    const freq = +this.sourceForm.get('frequencyUpdate')?.value || 1;
    this.frequencyLimit = freq;

    const currentSelection = this.sourceForm.get('updateSchedule')?.value || [];
    if (currentSelection.length > freq) {
      this.sourceForm.get('updateSchedule')?.setValue(currentSelection.slice(0, freq));
    }
  }

  onScheduleSelectionChange(event: MatSelectChange): void {
    const selected = event.value || [];
    if (selected.length > this.frequencyLimit) {
      this.scheduleLimitReached = true;
      // Keep only allowed number of selections
      this.sourceForm.get('updateSchedule')?.setValue(selected.slice(0, this.frequencyLimit));
    } else {
      this.scheduleLimitReached = false;
    }
  }

  getSelectedTimesAsCommaString(): string {
    return (this.sourceForm.get('updateSchedule')?.value || []).join(', ');
  }

  onSubmit() {
    if (this.sourceForm.valid) {
      console.log('Source Data:', this.sourceForm.value);
      // call API here
      const payload = {
        sourceEntity: {
          source_name : this.sourceForm.value.sourceName,
          vendor: this.sourceForm.value.vendor,
          quality_of_service : this.sourceForm.value.serviceQuality,
          frequency_of_update:this.sourceForm.value.frequencyUpdate,
          schedule_of_update:this.sourceForm.value.updateSchedule,
          methodology_of_transfer:this.sourceForm.value.transferMethodology,
          source_type:this.sourceForm.value.sourceType,
          source_version_number : this.sourceForm.value.version,
          source_status : this.sourceForm.value.status,
          source_owner: this.sourceForm.value.owner,
          source_owner_email: this.sourceForm.value.ownerEmail
     
     
        }
      }
      this.sourceService.createSource(payload).subscribe((res: { sourceEntity: { source_id: string; }; }) => {
        if(res)
        {
          console.log(res, "Source builder created");
          // alert("Source Created Successfully. Your Source ID is "+ res.sourceEntity.source_id);
          this.toastNotificationService.success("Source Created Successfully. Your Source ID is "+ res.sourceEntity.source_id);

          // window.location.reload();
          this.router.navigate(['/sources/edit-source', res.sourceEntity.source_id]);
        }
      })
      
    } else {
      this.sourceForm.markAllAsTouched(); // show validation errors
    }
  }
}
