import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../shared-services/user.service'; // ⬅️ import

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const excludedDomains = ['dev-e4q8v4ezgegswlh6.us.auth0.com'];
  
    if (excludedDomains.some(domain => req.url.includes(domain))) {
      return next.handle(req);
    }
  
    const userEmail = localStorage.getItem('userID') || 'default@example.com';
  
    const modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': req.headers.has('Content-Type') ? req.headers.get('Content-Type')! : 'application/json',
        'X-User-ID': userEmail
      }
    });
  
    return next.handle(modifiedReq);
  }
  
}
