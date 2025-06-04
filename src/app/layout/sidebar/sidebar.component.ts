import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular'; // if you use Auth0
import { Router } from '@angular/router';
import { PrivilegeService } from 'src/app/features/shared-services/privilege.service';

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  subIcon?: string; // Optional second icon for Builder items
  // rolesAllowed: string[]; // 👈 Add which roles can access this
  feature: string;  
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoading = true; // 👈 flag for loading
  userRole: string | null = null;
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/home', icon: 'fa-tachometer', feature: 'sb_dashboard' },
    { label: 'Use Cases', route: '/use-cases', icon: 'fa-clipboard', feature: 'sb_use_cases' },
    { label: 'Systems', route: '/systems', icon: 'fa-cogs', feature: 'sb_systems' },
    { label: 'Interfaces', route: '/interfaces', icon: 'fa-random', feature: 'sb_interfaces' },
    { label: 'Sources', route: '/sources', icon: 'fa-database', feature: 'sb_sources' },
    { label: 'Targets', route: '/targets', icon: 'fa-bullseye', feature: 'sb_targets' },
    { label: 'Controls', route: '/controls', icon: 'fa-sliders', feature: 'sb_controls' },
    { label: 'Use Case Builder', route: '/use-cases/create-use-case', icon: 'fa-clipboard', subIcon: 'fa-plus', feature: 'sb_create_use_cases' },
    { label: 'System Builder', route: '/systems/system-builder', icon: 'fa-cogs', subIcon: 'fa-plus', feature: 'sb_system_builder' },
    { label: 'Interface Builder', route: '/interfaces/interface-builder', icon: 'fa-random', subIcon: 'fa-plus', feature: 'sb_interface_builder' },
    { label: 'Source Builder', route: '/sources/source-builder', icon: 'fa-database', subIcon: 'fa-plus', feature: 'sb_source_builder' },
    { label: 'Target Builder', route: '/targets/target-builder', icon: 'fa-bullseye', subIcon: 'fa-plus', feature: 'sb_target_builder' },
    { label: 'Control Builder', route: '/controls/control-builder', icon: 'fa-sliders', subIcon: 'fa-plus', feature: 'sb_control_builder' },
    { label: 'Create User', route: '/create-user', icon: 'fa-user', feature: 'create_user' },
    { label: 'User List', route: '/user-list', icon: 'fa-users', feature: 'sb_user_list' }
  ];

  constructor(private auth: AuthService, private router: Router,
    private privilegeService: PrivilegeService
  ) {}
  ngOnInit() {
    // setTimeout(() => { // wait for localStorage (simulate async)
      this.userRole = localStorage.getItem('userRole'); 
      this.isLoading = false;
    // }, 10); // 300ms delay, you can adjust
  }

  canAccess(feature: string): boolean {
    return this.privilegeService.hasAccess(feature);
  }

  // isAllowed(item: NavItem): boolean {
  //   if (!item.rolesAllowed) return true; // If no restriction
  //   if (!this.userRole) return false;     // UserRole not yet available
  //   return item.rolesAllowed.includes(this.userRole);
  // }
}
