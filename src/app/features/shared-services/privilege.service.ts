import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {
  
  private apiUrl = 'http://18.175.147.85:8080/role-privileges';
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
