import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { PrivilegeService } from 'src/app/features/shared-services/privilege.service';
import { UserService } from 'src/app/features/shared-services/user.service';
import { Sources } from 'src/app/features/sources/models/sources.model';
import { SourceService } from 'src/app/features/sources/services/source.service';
import { SystemsModel } from 'src/app/features/systems/models/systems-model.model';
import { SystemServiceService } from 'src/app/features/systems/services/system-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    displayedColumnsSystems: string[] = ['select', 'systemid', 'name', 'description', 'owner','owner_email' ,'leanixId', 'accuracyRisk', 'timelinessRisk', 'version', 'status'];
    displayedColumnsSource: string[] = ['sourceid', 'name', 'servicequality', 'frequencyupdate', 'scheduleupdate', 'transfermethodology', 'sourcetype', 'version', 'status', 'owner', 'owner_email'];

  dataSource: MatTableDataSource<SystemsModel>;
  dataSource_1!: MatTableDataSource<Sources>;
  user:any;
  userRole: string ='';
  systems: SystemsModel[] = []; // ✅ correct
  sources: Sources[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
// dashboard.component.ts
constructor(private router: Router,private http: HttpClient,
  private authService: AuthService,
  private userService : UserService,
  private privilegeService: PrivilegeService,
  private systemService: SystemServiceService,
  private sourceService: SourceService,
) { 
  this.dataSource = new MatTableDataSource(this.systems);
  this.dataSource_1 = new MatTableDataSource(this.sources);

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

  this.getSystemList();
  this.getSourceList();
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


getSystemList()
{
  this.systemService.getSystems().subscribe((data: any) => {
    // this.systems = data.systemEntity;
    const systemsWithChildData = data.map((system: any) => {
    const sys = {
      ...system.systemEntity,
    };
    return sys;
  });

  this.systems = systemsWithChildData;
    this.dataSource.data = this.systems;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  });
  
}


getSourceList() {
  this.sourceService.getSources().subscribe({
    next: (sources: any[]) => {
      // Map and extract the sourceEntity from each item
      const patchedSources = sources.map(data => ({
        ...data.sourceEntity
      }));

      this.dataSource_1.data = patchedSources;
      this.dataSource_1.paginator = this.paginator;
      this.dataSource_1.sort = this.sort;

      console.log(this.dataSource_1.data, "Sources");
    },
    error: (err) => {
      console.error('Error fetching sources:', err);
    }
  });
}

}

