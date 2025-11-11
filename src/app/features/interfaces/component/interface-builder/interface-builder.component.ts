import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Interface } from '../../models/interface.model';
import { InterfaceService } from '../../services/interface.service';
import { NavigationEnd, Router } from '@angular/router';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-interface-builder',
  templateUrl: './interface-builder.component.html',
  styleUrl: './interface-builder.component.scss'
})
export class InterfaceBuilderComponent {
  interfaceForm!: FormGroup;
  interfaceData: any;
  isClone = false;
  originalVersion = '';
  paentInterfaceId:any;

  statusOptions = ['NEW', 'DRAFT', 'READY_FOR_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
  serviceQualityOptions = ['STREAMING', 'PERIODIC', 'AD_HOC'];
  interfaceTypeOptions = ['SYSTEM', 'MANUAL ENTRY'];
  timeOptions: string[] = [];
  frequencyLimit = 1;
  scheduleLimitReached = false;

  constructor(
    private fb: FormBuilder,
    private interfaceService: InterfaceService,
    private router: Router,
    private toast: ToastnotificationService
  ) {
    // // ✅ Check navigation state for cloned interface
  }

  ngOnInit(): void {
  

    this.interfaceForm = this.fb.group({
      interfaceName: ['', Validators.required],
      serviceQuality: ['', Validators.required],
      frequencyUpdate: [1, Validators.required],
      updateSchedule: ['', Validators.required],
      transferMethodology: ['', Validators.required],
      interfaceType: ['', Validators.required],
      version: ['', Validators.required],
      status: ['', Validators.required],
      owner: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
    });

    this.generateTimeOptions();

    // Disable freq/schedule for certain service qualities
    this.interfaceForm.get('serviceQuality')?.valueChanges.subscribe(value => {
      if (value === 'STREAMING' || value === 'AD_HOC') {
        this.interfaceForm.get('frequencyUpdate')?.disable({ emitEvent: false });
        this.interfaceForm.get('updateSchedule')?.disable({ emitEvent: false });
      } else {
        this.interfaceForm.get('frequencyUpdate')?.enable({ emitEvent: false });
        this.interfaceForm.get('updateSchedule')?.enable({ emitEvent: false });
      }
    });

    // Read router state data
    // const nav = this.router.getCurrentNavigation();
    // this.interfaceData = nav?.extras?.state?.['clonedInterface'];
  }

  ngAfterViewInit(): void {
    // 🔹 Patch only after view is fully initialized
    if (this.interfaceData) {
      this.isClone = true;
      this.originalVersion = this.interfaceData.interface_version_number;
      this.prefillForm(this.interfaceData);
    }
  }

  resetFormForClone(): void {
    this.interfaceForm.reset();
    this.prefillForm(this.interfaceData);
    this.interfaceForm.enable();
  }

  prefillForm(data: any): void {
    this.interfaceForm.patchValue({
      interfaceName: data.interface_name,
      serviceQuality: data.quality_of_service,
      frequencyUpdate: data.frequency_of_update,
      updateSchedule: data.schedule_of_update,
      transferMethodology: data.methodology_of_transfer,
      interfaceType: data.interface_type,
      version: data.interface_version_number, // ✅ correct field name
      status: data.interface_status,
      owner: data.interface_owner,
      ownerEmail: data.interface_owner_email,
    });

   
  }

  checkVersionChange(currentVersion: string): void {
    if (this.isClone) {
      if (!currentVersion || currentVersion === this.originalVersion) {
        this.interfaceForm.get('version')?.setErrors({ versionUnchanged: true });
      } else {
        this.interfaceForm.get('version')?.setErrors(null);
      }
    }
  }

  generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      this.timeOptions.push(hour.toString().padStart(2, '0') + ':00');
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


  onSubmit(): void {
    if (this.interfaceForm.invalid) {
      this.interfaceForm.markAllAsTouched();
      return;
    }

    const payload = {
      interfaceEntity: {
        interface_name: this.interfaceForm.value.interfaceName,
        quality_of_service: this.interfaceForm.value.serviceQuality,
        frequency_of_update: this.interfaceForm.value.frequencyUpdate,
        schedule_of_update: this.interfaceForm.value.updateSchedule,
        methodology_of_transfer: this.interfaceForm.value.transferMethodology,
        interface_type: this.interfaceForm.value.interfaceType,
        interface_version_number: this.interfaceForm.value.version,
        interface_status: this.interfaceForm.value.status,
        interface_owner: this.interfaceForm.value.owner,
        interface_owner_email: this.interfaceForm.value.ownerEmail,
      }
    };

    if (this.isClone && this.interfaceForm.value.version === this.originalVersion) {
      this.toast.error('Please change the version number before saving the cloned interface.');
     
      return;
    }

    // this.interfaceService.createInterface(payload).subscribe({
    //   next: (res: any) => {       
    //     this.toast.success('Interface Created Successfully. Your Interface ID is ' + res.interfaceEntity.interface_id);
    //     this.router.navigate(['/interfaces/edit-interface', res.interfaceEntity.interface_id]);
    //   },
    //   error: () => this.toast.error('Failed to create interface.')
    // });

    const create$ = this.interfaceService.createInterface(payload);
    const clone$ = this.interfaceService.cloneInterfaceDatafields(payload, 'INTERFACE', this.paentInterfaceId);
  
    forkJoin([create$, clone$]).subscribe({
      next: ([createRes, cloneRes]) => {
        this.toast.success('Interface Created Successfully. Your Interface ID is ' + createRes.interfaceEntity.interface_id);
        this.toast.success('Datafields cloned successfully.');
        this.router.navigate(['/interfaces/edit-interface', createRes.interfaceEntity.interface_id]);
      },
      error: () => this.toast.error('Failed to complete both API calls.')
    });
  }
   onBack()
  {
     this.router.navigate(['/interfaces']);
  }
}
