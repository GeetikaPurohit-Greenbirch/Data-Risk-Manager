import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-header',
  // standalone: true,
  // imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}

  logout() {
    // this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
    sessionStorage.clear();
    localStorage.clear();
    this.auth.logout();
  }
}
