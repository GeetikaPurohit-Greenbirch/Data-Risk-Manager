import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Target } from '../models/target.model';

@Injectable({
  providedIn: 'root'
})
export class TargetService {
private apiUrl = environment.apiAllBaseUrl // Base URL


  constructor(private http: HttpClient) { }

  public createTarget(payload:any): Observable<any> {
    const url: string = this.apiUrl + 'targets';
    console.log(payload)

    return this.http.post<any>(url, payload);
  }

  public getTarget(): Observable<Target[]> {
        const url: string = this.apiUrl + 'targets';
        return this.http.get<Target[]>(url);
      }
  
      public getTargetById(id:number):Observable<Target[]> {
        const url: string = this.apiUrl + 'targets/id/'+id;
        return this.http.get<Target[]>(url);
      }

   public deleteTarget(id:number):Observable<Target[]> {
        const url: string = this.apiUrl + 'targets/'+id;
        return this.http.delete<Target[]>(url);
      }

       public updateTarget(payload:any): Observable<any> {
            const url: string = this.apiUrl + 'interfaces';
            console.log(payload)
        
            return this.http.post<Target[]>(url, payload);
          }
}
