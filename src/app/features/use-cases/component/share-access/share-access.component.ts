import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsecaseService } from '../../services/usecase.service';

@Component({
  selector: 'app-share-access',
  templateUrl: './share-access.component.html'
})
export class ShareAccessComponent implements OnInit {
  useCaseId: string = '';
  userAccessList: any[] = [];
  userID: any;

  constructor(
    private route: ActivatedRoute,
   private usecaseService: UsecaseService,
  ) {}

  ngOnInit(): void {
    this.userID = localStorage.getItem('userID'); 
    this.useCaseId = this.route.snapshot.paramMap.get('useCaseId') || '';

    this.usecaseService.getAccessFlags(this.useCaseId).subscribe((users: any[]) => {
      this.userAccessList = users.map(u => ({
        ...u,
        selected: u.has_access, // for checkbox
        userrole: u.user_role,
        access: u.has_access ? (u.is_editable ? 'Edit' : 'View') : 'View',
        isDisabled: u.username === this.userID
      }));
    });
  }

  submitSharedAccess() {
    const user_permissions = this.userAccessList
      .filter(user => user.selected) // only selected users
      .map(user => ({
        user_name: user.username,
        is_editable: user.access === 'Edit'
      }));
  
    if (user_permissions.length === 0) {
      alert('Please select at least one user to share the use case.');
      return;
    }
  
    const payload = {
      use_case_id: this.useCaseId,
      user_permissions
    };
  
    // const sharingUser = 'john.doe'; // Get current logged-in user dynamically
  
    this.usecaseService.assignUseCase(payload).subscribe({
      next: (res:string) => {
        alert(res);
      },
      error: (err) => {
        console.error('Error assigning use case:', err);
        alert('Failed to share use case.');
      }
    });
  }
  
}
