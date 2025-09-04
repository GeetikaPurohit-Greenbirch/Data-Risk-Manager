import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsecaseService } from '../../services/usecase.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';

@Component({
  selector: 'app-create-use-case',
  // standalone: true,
  // imports: [],
  templateUrl: './create-use-case.component.html',
  styleUrl: './create-use-case.component.scss'
})
export class CreateUseCaseComponent {
 usecaseForm!: FormGroup;
  statusOptions = ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'PRODUCTION'];
  accuracyRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  timlinessRiskOptions = ['LOW', 'MEDIUM', 'HIGH'];
  // usecaseModel : UseCasesModel = new UseCasesModel();

  constructor(private fb: FormBuilder, 
    private usecaseService: UsecaseService,
    private router: Router,
     private toastNotificationService: ToastnotificationService,
  ) {}

  ngOnInit(): void {
    this.usecaseForm = this.fb.group({
      usecaseName: ['', Validators.required],
      description: ['', Validators.required],
      owner: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      version: ['', Validators.required],
      status: ['', Validators.required],
      lastreviewdate:['', Validators.required],
      reviewedby: ['', Validators.required],
      nextreviewdate: ['', Validators.required],
      reviewer:['', Validators.required]
    });
  }

  onSubmit() {
    if (this.usecaseForm.valid) {
      console.log('UseCase Data:', this.usecaseForm.value);
      
      const payload = {
        useCaseEntity: {
            use_case_name : this.usecaseForm.value.usecaseName,
            use_case_description : this.usecaseForm.value.description,
            use_case_owner : this.usecaseForm.value.owner,
            use_case_owner_email : this.usecaseForm.value.ownerEmail,
            version : this.usecaseForm.value.version,
            status : this.usecaseForm.value.status,
            last_review_date : this.usecaseForm.value.lastreviewdate,
            reviewed_by : this.usecaseForm.value.reviewedby,
            next_review_date : this.usecaseForm.value.nextreviewdate,
            reviewer : this.usecaseForm.value.reviewer
    
        }
      }
      this.usecaseService.createUsecase(payload).subscribe(res => {
        if(res)
        {
          console.log(res, "UseCase builder created");
          // alert("UseCase Created Successfully. Your UseCase ID is "+ res.useCaseEntity.use_case_id);
          this.toastNotificationService.success("UseCase Created Successfully. Your UseCase ID is "+ res.useCaseEntity.use_case_id);

          // window.location.reload();
          this.router.navigate(['/use-cases/edit-usecase', res.useCaseEntity.use_case_id]);

        }
      })
      
    } else {
      this.usecaseForm.markAllAsTouched(); // show validation errors
    }
  }
}
