import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Interface } from '../../models/interface.model';
import { InterfaceService } from '../../services/interface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interface-builder',
  // standalone: true,
  // imports: [],
  templateUrl: './interface-builder.component.html',
  styleUrl: './interface-builder.component.scss'
})
export class InterfaceBuilderComponent {
interfaceForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
  serviceQualityOptions = ['PERIODIC', 'REAL-TIME'];
  interfaceTypeOptions = ['SYSTEM', 'MANUAL ENTRY']
  interfaceModel : Interface = new Interface();
  timeOptions: string[] = [];
  frequencyLimit = 1;
  scheduleLimitReached = false;
  constructor(private fb: FormBuilder, private interfaceService: InterfaceService,
    private router: Router
  ) {} 

  ngOnInit(): void {
    this.interfaceForm = this.fb.group({
      interfaceName: ['', Validators.required],
      serviceQuality: ['', Validators.required],
      frequencyUpdate:[1,Validators.required],
      updateSchedule: [[], Validators.required],
      transferMethodology:['',Validators.required],
      interfaceType:['',Validators.required],
      version: ['', Validators.required],
      status: ['', Validators.required],
      owner: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      });
      this.generateTimeOptions();
  }


  generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour.toString().padStart(2, '0') + ':00';
      this.timeOptions.push(time);
    }
  }

  onFrequencyChange(): void {
    const freq = +this.interfaceForm.get('frequencyUpdate')?.value || 1;
    this.frequencyLimit = freq;

    const currentSelection = this.interfaceForm.get('updateSchedule')?.value || [];
    if (currentSelection.length > freq) {
      this.interfaceForm.get('updateSchedule')?.setValue(currentSelection.slice(0, freq));
    }
  }

  onScheduleSelectionChange(event: MatSelectChange): void {
    const selected = event.value || [];
    if (selected.length > this.frequencyLimit) {
      this.scheduleLimitReached = true;
      // Keep only allowed number of selections
      this.interfaceForm.get('updateSchedule')?.setValue(selected.slice(0, this.frequencyLimit));
    } else {
      this.scheduleLimitReached = false;
    }
  }

  getSelectedTimesAsCommaString(): string {
    return (this.interfaceForm.get('updateSchedule')?.value || []).join(', ');
  }

  onSubmit() {
    if (this.interfaceForm.valid) {
      console.log('Interface Data:', this.interfaceForm.value);
      // call API here
      const payload = {
        interfaceEntity: {
          interface_name : this.interfaceForm.value.interfaceName,
          quality_of_service : this.interfaceForm.value.serviceQuality,
          frequency_of_update:this.interfaceForm.value.frequencyUpdate,
          schedule_of_update:this.interfaceForm.value.updateSchedule,
          methodology_of_transfer:this.interfaceForm.value.transferMethodology,
          interface_type:this.interfaceForm.value.interfaceType,
          interface_version_number : this.interfaceForm.value.version,
          interface_status : this.interfaceForm.value.status,
          interface_owner: this.interfaceForm.value.owner,
          interface_owner_email: this.interfaceForm.value.ownerEmail
     
     
        }
      }
      this.interfaceService.createInterface(payload).subscribe((res: { interfaceEntity: { interface_id: string; }; }) => {
        if(res)
        {
          console.log(res, "Interface builder created");
          alert("Interface Created Successfully. Your Interface ID is "+ res.interfaceEntity.interface_id);
          // Navigate to Edit Interface page with the ID
          this.router.navigate(['/interfaces/edit-interface', res.interfaceEntity.interface_id]);
        }
      })
      
    } else {
      this.interfaceForm.markAllAsTouched(); // show validation errors
    }
  }
}
