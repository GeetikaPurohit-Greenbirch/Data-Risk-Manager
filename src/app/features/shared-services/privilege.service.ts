import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

// NOTE: This PrivilegeService is the bouncer at the club — it checks if your user role has access to certain features. It fetches privileges from the backend based on your role, stores them, and later checks if you’re allowed to see/do stuff. ( UserService — one knows who you are, the other knows what you can do!)


export class PrivilegeService {
  
  private apiUrl = environment.apiBaseUrl + 'role-privileges';
  private privileges: any[] = []; // Store the privileges list

  constructor(private http: HttpClient) {}

  fetchPrivileges(role: string, userId: string): Observable<any> {
    // const apiUrl = 'http://18.130.231.245:8080/role-privileges';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // return this.http.post(this.apiUrl, body, { headers });
          const url: string = this.apiUrl+'/'+role;
      return this.http.get<any>(url);
    }
  

  setPrivileges(privileges: any[]) {
    this.privileges = privileges;
  }

  hasAccess(feature: string): boolean {
   // 🛡️ If no privileges found, allow all links
   if (!this.privileges || this.privileges.length === 0) {
    return true;
  }

  // 🔥 Otherwise, check specific feature access
  const privilege = this.privileges.find(p => p.feature === feature);
  return privilege ? privilege.access : false;
  }
}
