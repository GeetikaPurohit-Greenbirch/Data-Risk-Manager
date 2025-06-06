import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Control } from '../../models/control.model';
import { ControlService } from '../../services/control.service';
import { SourceService } from 'src/app/features/sources/services/source.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sources } from 'src/app/features/sources/models/sources.model';
import { SystemsModel } from 'src/app/features/systems/models/systems-model.model';
import { SystemServiceService } from 'src/app/features/systems/services/system-service.service';
@Component({
  selector: 'app-control-builder',
  // standalone: true,
  // imports: [],
  templateUrl: './control-builder.component.html',
  styleUrl: './control-builder.component.scss'
})
export class ControlBuilderComponent {
  dataSource1 = new MatTableDataSource<Sources>();
  dataSource2 = new MatTableDataSource<SystemsModel>();
controlForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED','PRODUCTION'];
  applicationStatusOptions= ['TARGET', 'PLANNED', 'COMMITTED', 'DELAYED'];
  attachToOptions = ['SYSTEM', 'SOURCE'];
  filteredAttachToIdOptions: { id: number, name: string }[] = [];
  controlModel : Control = new Control();
  timeOptions: string[] = [];
  frequencyLimit = 1;
  scheduleLimitReached = false;
  constructor(private fb: FormBuilder, private controlService: ControlService,
    private router: Router,
    private sourceService: SourceService,
    private systemService: SystemServiceService,
  ) {} 

  ngOnInit(): void {
    this.controlForm = this.fb.group({
      controlName: ['', Validators.required],
      controlDescription:['',Validators.required],
      attachto: ['', Validators.required],
      attachToId: ['', Validators.required],
      owner:['', Validators.required],
      ownerEmail:['', Validators.required],
      version: ['', Validators.required],
      status: ['', Validators.required],
      applicationDate: ['', Validators.required],
      applicationStatus: ['', Validators.required],
      });
      
  }

  onChange(attachTo: string): void
  {
    this.filteredAttachToIdOptions = []; // Clear previous list
  this.controlForm.get('attachToId')?.setValue(null); // Reset selection

  if (attachTo === 'SOURCE') {
    this.sourceService.getSources().subscribe(data =>{
      this.filteredAttachToIdOptions = data.map(item => ({
        id: item.sourceEntity.source_id,
        name: item.sourceEntity.source_name
      }));
    });
  } else if (attachTo === 'SYSTEM') {
    this.systemService.getSystems().subscribe((data) => {
      this.filteredAttachToIdOptions = data.map(item => ({
         id: item.systemEntity.system_id,
        name: item.systemEntity.system_name
      }));
    });
  }
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
          attach_to:this.controlForm.value.attachto,
          attach_to_id:this.controlForm.value.attachToId,
          control_owner:this.controlForm.value.owner,
          control_owner_email:this.controlForm.value.ownerEmail,
          version_number : this.controlForm.value.version,
          status : this.controlForm.value.status,
          application_date:this.controlForm.value.applicationDate,
          application_date_status:this.controlForm.value.applicationStatus,
            
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
