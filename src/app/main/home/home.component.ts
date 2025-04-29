import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { PrivilegeService } from 'src/app/features/shared-services/privilege.service';
import { UserService } from 'src/app/features/shared-services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  user:any;
  userRole: string ='';
// dashboard.component.ts
constructor(private router: Router,private http: HttpClient,
  private authService: AuthService,
  private userService : UserService,
  private privilegeService: PrivilegeService
) { 

 }
ngOnInit(): void{
  this.authService.user$.subscribe({
    next: (user) => {
      if (user && user.email) {
        console.log('Authenticated user', user);
        this.user = user.email;
        localStorage.setItem('userID', this.user);

        this.fetchUserRoleAndPrivileges(this.user);
      } else {
        this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      console.error('Error fetching user data:', err);
      this.router.navigate(['/login']);
    }
  });

}
searchText:string = '';
stats = [
  { icon: '<i class="fa fa-clipboard" aria-hidden="true"></i>', title: 'Use Cases', bgColor: '#e8f0fe', total: 133, notStarted: 53, expired: 60, complete: 50 },
  { icon: '<i class="fa fa-cogs" aria-hidden="true"></i>', title: 'Systems',   bgColor: '#ffe0b2', total: 299, notStarted: 153, expired: 46, complete: 100 },
  { icon: '<i class="fa fa-database" aria-hidden="true"></i>', title: 'Sources', bgColor: '#c8e6c9', total: 33, notStarted: 16, expired: 3, complete: 14 },
  { icon: '<i class="fa fa-sliders" aria-hidden="true"></i>', title: 'Controls',  bgColor: '#f8bbd0', total: 299, notStarted: 153, expired: 46, complete: 100 },
  { icon: '<i class="fa fa-bullseye" aria-hidden="true"></i>', title: 'Targets', bgColor: '#d1c4e9', total: 299, notStarted: 153, expired: 46, complete: 100 }
];

displayedColumns: string[] = ['select', 'name', 'description', 'owner', 'sys', 'src', 'int', 'ctrls', 'trgts', 'status', 'actions'];

data = [
  {
    name: 'FXAIL – Transaction Reporting',
    description: 'FX-All Transaction Reporting MiFID II RTS',
    owner: 'Mo Ali',
    ownerImg: 'assets/images/Mo.png',
    sys: 100,
    src: 56,
    int: 34,
    ctrls: 65,
    trgts: 4,
    status: 'In Process'
  },
  {
    name: 'FX ALL Market Management',
    description: 'FX Market Management',
    owner: 'Dennis Johnson',
    ownerImg: 'assets/images/Dennis.png',
    sys: 100,
    src: 56,
    int: 34,
    ctrls: 65,
    trgts: 4,
    status: 'Overdue'
  },
  {
    name: 'FXALL Admin – Client Static',
    description: 'FX Venue Management',
    owner: 'Marilyn',
    ownerImg: 'assets/images/Merilyn.png',
    sys: 100,
    src: 56,
    int: 34,
    ctrls: 65,
    trgts: 4,
    status: 'Done'
  },
  // more rows...
];

get filteredData() {
  return this.searchText
    ? this.data.filter(d => JSON.stringify(d).toLowerCase().includes(this.searchText.toLowerCase()))
    : this.data;
}

private fetchUserRoleAndPrivileges(username: string) {
  this.userService.getUserRoleFrom(username).subscribe({
    next: (res) => {
      if (res && res.userRole) {
        console.log('User Role:', res.userRole);
        localStorage.setItem('userRole', res.userRole);

        // After setting role, fetch privileges
        this.privilegeService.fetchPrivileges(res.userRole, username).subscribe({
          next: (privileges) => {
            console.log('Fetched privileges:', privileges);
            this.privilegeService.setPrivileges(privileges);
            // ✅ Now everything is loaded - Sidebar will also load correctly
          },
          error: (err) => {
            console.error('Error fetching privileges:', err);
          }
        });
      }
    },
    error: (err) => {
      console.error('Error fetching user role:', err);
    }
  });
}


}
