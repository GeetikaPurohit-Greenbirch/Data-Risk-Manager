import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Control } from '../models/control.model';

@Injectable({
  providedIn: 'root'
})
export class ControlService {
private apiUrl = environment.apiAllBaseUrl // Base URL


  constructor(private http: HttpClient) { }

  public createControl(payload:any): Observable<any> {
    const url: string = this.apiUrl + 'controls';
    console.log(payload)

    return this.http.post<any>(url, payload);
  }

   public getControl(): Observable<Control[]> {
      const url: string = this.apiUrl + 'controls';
      return this.http.get<Control[]>(url);
    }

    public getControlById(id:number):Observable<Control[]> {
      const url: string = this.apiUrl + 'controls/id/'+id;
      return this.http.get<Control[]>(url);
    }

    public deleteControl(id:number):Observable<Control[]> {
      const url: string = this.apiUrl + 'controls/'+id;
      return this.http.delete<Control[]>(url);
    }

       public updateControl(payload:any): Observable<any> {
            const url: string = this.apiUrl + 'controls';
            console.log(payload)
        
            return this.http.post<Control[]>(url, payload);
          }
}
