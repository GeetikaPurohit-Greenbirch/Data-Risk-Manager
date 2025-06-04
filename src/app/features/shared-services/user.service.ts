import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface User {
  id: string;
  username: string;
  userRole: string;
  actions?: string; 
}

@Injectable({
  providedIn: 'root'
})

  // NOTE: This UserService is like our control room for anything user-related — fetch, add, delete users, or check their roles stores the currently logged-in user's email temporarily


export class UserService {

  private apiUrl = environment.apiBaseUrl + 'users'; // Base URL

  private _currentUserEmail: string = '';

  constructor(private http: HttpClient) {}

  setCurrentUserEmail(email: string): void {
    this._currentUserEmail = email;
  }

  getCurrentUserEmail(): string {
    return this._currentUserEmail;
  }

  getUserRoleFrom(username: string) {
    return this.http.get<any>(`${this.apiUrl}/${username}`);
  }

  createUser(user: { email: string, role: string }): Observable<any>{
    const body = {
      username: user.email,
      userRole: user.role
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }
  
  deleteUser(username: string): Observable<User[]> {
    return this.http.delete<any>(`${this.apiUrl}/${username}`);
  }
}
