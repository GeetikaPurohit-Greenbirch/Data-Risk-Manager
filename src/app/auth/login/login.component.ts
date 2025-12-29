import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/features/shared-services/user.service'; // 👈 your custom service to hold user email

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    public auth: AuthService,
  ) {}

  ngOnInit() {   
    if ((window as any).PLAYWRIGHT_E2E) {
      console.log('E2E mode: skipping Auth redirect');
      return;
    }

    this.login();
  }

  login() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        audience: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/',
        scope: 'openid profile email offline_access',
        prompt: 'consent'
      }
    });
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
