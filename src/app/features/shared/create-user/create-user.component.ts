import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../shared-services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  createUserForm: FormGroup;
  accessToken: any;
  roles = [
    { label: 'Data Admin', value: 'data_admin' },
    { label: 'Client Admin', value: 'client_admin' },
    { label: 'Client Analyst', value: 'client_analyst' },
    { label: 'Client Support', value: 'client_support' }
  ];
  
  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService,private userService: UserService) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void{
    this.authService.getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/',
        scope: 'openid profile email offline_access read:users update:users create:users',
        connection: 'Username-Password-Authentication'
      },
      
    }).subscribe((accessToken) => {
      console.log('API Management Token:', accessToken);
      this.accessToken = accessToken;
    });
    
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      const userData = this.createUserForm.value;
      console.log('User Data:', userData);
      this.createAuth0User(userData);
    }
  }


  getAccessToken(): Promise<string> {
    const tokenUrl = 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/oauth/token';
    const tokenData = {
      client_id: '3p8QkfnRZqdewRwL9AASo7xpNslOL2n7',
      client_secret: 'NFQkJZcnhA628kcI9-9gaOKVj20UUWvIvgUZqztjqzkOtMCiDeZc3d4ZoebdHKTV',
      audience: 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/',
      // grant_type: 'client_credentials'
    };
  
    return this.http.post(tokenUrl, tokenData).toPromise()
      .then((response: any) => response.access_token)
      .catch(error => {
        console.error('Error getting access token:', error);
        throw error;
      });
  }

  async createAuth0User(user: any) {
    try {
      // const accessToken = await this.getAccessToken(); // 👈 FIRST Get Token
  
      const createUserUrl = 'https://dev-e4q8v4ezgegswlh6.us.auth0.com/api/v2/users';
      const userPayload = {
        email: user.email,
        password: user.password,
        connection: 'Username-Password-Authentication',
        email_verified: false
      };
  
      const headers = {
        'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikc0S3dQcC1rdkswcEgwdl9kUkxkciJ9.eyJpc3MiOiJodHRwczovL2Rldi1lNHE4djRlemdlZ3N3bGg2LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJLM3g0R2E5a3Z5cmlvbEF2SkZsMW44NHROSlE3ZVp3YUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtZTRxOHY0ZXpnZWdzd2xoNi51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTc1MDc1ODQ1NiwiZXhwIjoxNzUzMzUwNDU2LCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIHJlYWQ6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgZGVsZXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6aG9va3MgdXBkYXRlOmhvb2tzIGRlbGV0ZTpob29rcyBjcmVhdGU6aG9va3MgcmVhZDphY3Rpb25zIHVwZGF0ZTphY3Rpb25zIGRlbGV0ZTphY3Rpb25zIGNyZWF0ZTphY3Rpb25zIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6aW5zaWdodHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpsb2dzX3VzZXJzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyB1cGRhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyByZWFkOmFub21hbHlfYmxvY2tzIGRlbGV0ZTphbm9tYWx5X2Jsb2NrcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyB1cGRhdGU6Y3VzdG9tX2RvbWFpbnMgcmVhZDplbWFpbF90ZW1wbGF0ZXMgY3JlYXRlOmVtYWlsX3RlbXBsYXRlcyB1cGRhdGU6ZW1haWxfdGVtcGxhdGVzIHJlYWQ6bWZhX3BvbGljaWVzIHVwZGF0ZTptZmFfcG9saWNpZXMgcmVhZDpyb2xlcyBjcmVhdGU6cm9sZXMgZGVsZXRlOnJvbGVzIHVwZGF0ZTpyb2xlcyByZWFkOnByb21wdHMgdXBkYXRlOnByb21wdHMgcmVhZDpicmFuZGluZyB1cGRhdGU6YnJhbmRpbmcgZGVsZXRlOmJyYW5kaW5nIHJlYWQ6bG9nX3N0cmVhbXMgY3JlYXRlOmxvZ19zdHJlYW1zIGRlbGV0ZTpsb2dfc3RyZWFtcyB1cGRhdGU6bG9nX3N0cmVhbXMgY3JlYXRlOnNpZ25pbmdfa2V5cyByZWFkOnNpZ25pbmdfa2V5cyB1cGRhdGU6c2lnbmluZ19rZXlzIHJlYWQ6bGltaXRzIHVwZGF0ZTpsaW1pdHMgY3JlYXRlOnJvbGVfbWVtYmVycyByZWFkOnJvbGVfbWVtYmVycyBkZWxldGU6cm9sZV9tZW1iZXJzIHJlYWQ6ZW50aXRsZW1lbnRzIHJlYWQ6YXR0YWNrX3Byb3RlY3Rpb24gdXBkYXRlOmF0dGFja19wcm90ZWN0aW9uIHJlYWQ6b3JnYW5pemF0aW9uc19zdW1tYXJ5IGNyZWF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6YXV0aGVudGljYXRpb25fbWV0aG9kcyB1cGRhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyBkZWxldGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpzY2ltX2NvbmZpZyBjcmVhdGU6c2NpbV9jb25maWcgdXBkYXRlOnNjaW1fY29uZmlnIGRlbGV0ZTpzY2ltX2NvbmZpZyBjcmVhdGU6c2NpbV90b2tlbiByZWFkOnNjaW1fdG9rZW4gZGVsZXRlOnNjaW1fdG9rZW4gZGVsZXRlOnBob25lX3Byb3ZpZGVycyBjcmVhdGU6cGhvbmVfcHJvdmlkZXJzIHJlYWQ6cGhvbmVfcHJvdmlkZXJzIHVwZGF0ZTpwaG9uZV9wcm92aWRlcnMgZGVsZXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6cGhvbmVfdGVtcGxhdGVzIHJlYWQ6cGhvbmVfdGVtcGxhdGVzIHVwZGF0ZTpwaG9uZV90ZW1wbGF0ZXMgY3JlYXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOmVuY3J5cHRpb25fa2V5cyB1cGRhdGU6ZW5jcnlwdGlvbl9rZXlzIGRlbGV0ZTplbmNyeXB0aW9uX2tleXMgcmVhZDpzZXNzaW9ucyBkZWxldGU6c2Vzc2lvbnMgcmVhZDpyZWZyZXNoX3Rva2VucyBkZWxldGU6cmVmcmVzaF90b2tlbnMgY3JlYXRlOnNlbGZfc2VydmljZV9wcm9maWxlcyByZWFkOnNlbGZfc2VydmljZV9wcm9maWxlcyB1cGRhdGU6c2VsZl9zZXJ2aWNlX3Byb2ZpbGVzIGRlbGV0ZTpzZWxmX3NlcnZpY2VfcHJvZmlsZXMgY3JlYXRlOnNzb19hY2Nlc3NfdGlja2V0cyBkZWxldGU6c3NvX2FjY2Vzc190aWNrZXRzIHJlYWQ6Zm9ybXMgdXBkYXRlOmZvcm1zIGRlbGV0ZTpmb3JtcyBjcmVhdGU6Zm9ybXMgcmVhZDpmbG93cyB1cGRhdGU6Zmxvd3MgZGVsZXRlOmZsb3dzIGNyZWF0ZTpmbG93cyByZWFkOmZsb3dzX3ZhdWx0IHJlYWQ6Zmxvd3NfdmF1bHRfY29ubmVjdGlvbnMgdXBkYXRlOmZsb3dzX3ZhdWx0X2Nvbm5lY3Rpb25zIGRlbGV0ZTpmbG93c192YXVsdF9jb25uZWN0aW9ucyBjcmVhdGU6Zmxvd3NfdmF1bHRfY29ubmVjdGlvbnMgcmVhZDpmbG93c19leGVjdXRpb25zIGRlbGV0ZTpmbG93c19leGVjdXRpb25zIHJlYWQ6Y29ubmVjdGlvbnNfb3B0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnNfb3B0aW9ucyByZWFkOnNlbGZfc2VydmljZV9wcm9maWxlX2N1c3RvbV90ZXh0cyB1cGRhdGU6c2VsZl9zZXJ2aWNlX3Byb2ZpbGVfY3VzdG9tX3RleHRzIGNyZWF0ZTpuZXR3b3JrX2FjbHMgdXBkYXRlOm5ldHdvcmtfYWNscyByZWFkOm5ldHdvcmtfYWNscyBkZWxldGU6bmV0d29ya19hY2xzIGRlbGV0ZTp2ZGNzX3RlbXBsYXRlcyByZWFkOnZkY3NfdGVtcGxhdGVzIGNyZWF0ZTp2ZGNzX3RlbXBsYXRlcyB1cGRhdGU6dmRjc190ZW1wbGF0ZXMgY3JlYXRlOmN1c3RvbV9zaWduaW5nX2tleXMgcmVhZDpjdXN0b21fc2lnbmluZ19rZXlzIHVwZGF0ZTpjdXN0b21fc2lnbmluZ19rZXlzIGRlbGV0ZTpjdXN0b21fc2lnbmluZ19rZXlzIHJlYWQ6ZmVkZXJhdGVkX2Nvbm5lY3Rpb25zX3Rva2VucyBkZWxldGU6ZmVkZXJhdGVkX2Nvbm5lY3Rpb25zX3Rva2VucyByZWFkOmNsaWVudF9jcmVkZW50aWFscyBjcmVhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIHVwZGF0ZTpjbGllbnRfY3JlZGVudGlhbHMgZGVsZXRlOmNsaWVudF9jcmVkZW50aWFscyByZWFkOm9yZ2FuaXphdGlvbl9jbGllbnRfZ3JhbnRzIGNyZWF0ZTpvcmdhbml6YXRpb25fY2xpZW50X2dyYW50cyBkZWxldGU6b3JnYW5pemF0aW9uX2NsaWVudF9ncmFudHMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJLM3g0R2E5a3Z5cmlvbEF2SkZsMW44NHROSlE3ZVp3YSJ9.L0ekKwGJaPDdjOP6J1hMua0rY_1EBohO64dV055bsj04ZC9ApuI_Lp7g3IvcSCMfHYcmjQ7lMti7UU-cIS0XRiyBGnw1fLsKseT6d_Rhfhj-Tu8Y7kFGjAgaJzQdmGru7tKrvjVBg3dkDmDHItOk5sfpyx6rXajfmaF1sUKrih9enE9n1lWj4kUDRqGE7FsPBfyj0R-iiibbvX2BZ3tdbNqUJ6MS2og8w80C2dVD57WDAFFXgla5lgsHxT9oaQ8ftzE8ARR7Z0-AQ9x1RY0sRecU0g9QesycOK1iNZxFFMNPpXkJPMULrlstE8FB1ufXSiFqLl6ipI9dgAV5da8R_w`,
        'Content-Type': 'application/json'
      };
  
      this.http.post(createUserUrl, userPayload, { headers }).subscribe(
        res => {
          console.log('User created successfully in Auth0:', res);
          // After success you can save in your database if needed

          // ➡️ Now immediately save to your database also
        this.saveUserToDatabase(user);
        },
        err => {
          console.error('Error creating user:', err);
        }
      );
  
    } catch (error) {
      console.error('Failed to get token or create user:', error);
    }
  }
   

  saveUserToDatabase(user: any) {
    if (this.createUserForm.valid) {
      const formData = this.createUserForm.value;
      console.log('Form Data:', formData);
  
      this.userService.createUser({
        email: formData.email,
        role: formData.role
      }).subscribe({
        next: (res) => {
          console.log('User saved successfully:', res);
          alert('User Created Successfully!');
          this.createUserForm.reset();
        },
        error: (err) => {
          console.error('Error saving user:', err);
          alert('Failed to save user.');
        }
      });
    }
  }
  
}
