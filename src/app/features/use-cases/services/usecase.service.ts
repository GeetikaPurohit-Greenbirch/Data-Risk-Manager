import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usecase } from '../models/usecase.model';

@Injectable({
  providedIn: 'root'
})
export class UsecaseService {
  private apiUrl = environment.apiAllBaseUrl // Base URL

  constructor(private http: HttpClient) { }

  
    public createUsecase(payload:any): Observable<any> {
      const url: string = this.apiUrl + 'use_cases';
      console.log(payload)
  
      return this.http.post<any>(url, payload);
    }
  
     public getUsecase(): Observable<Usecase[]> {
        const url: string = this.apiUrl + 'use_cases';
        return this.http.get<Usecase[]>(url);
      }
  
     public updateInterface(payload:any): Observable<any> {
        const url: string = this.apiUrl + 'use_cases';
        console.log(payload)
    
        return this.http.post<Usecase[]>(url, payload);
      }
  
      public getUsecaseById(id:number):Observable<Usecase[]> {
        const url: string = this.apiUrl + 'use_cases/id/'+id;
        return this.http.get<Usecase[]>(url);
      }
  
      public deleteUsecase(id:number):Observable<Usecase[]> {
        const url: string = this.apiUrl + 'use_cases/'+id;
        return this.http.delete<Usecase[]>(url);
      }
}
