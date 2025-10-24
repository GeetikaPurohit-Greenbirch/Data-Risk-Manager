import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usecase } from '../models/usecase.model';
import { Lineage } from '../use-cases.component';

@Injectable({
  providedIn: 'root'
})
export class UsecaseService {
  private apiUrl = environment.apiAllBaseUrl // Base URL
  private lineageUrl = environment.apiLineageBaseUrl


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

      public getLineageUsecase(entity_type:string,systemid: number): Observable<Usecase[]> {
        const url: string = this.apiUrl + 'use_cases/'+entity_type+'/'+systemid
        return this.http.get<Usecase[]>(url);
      }
    
    public getPermissionsForUsecases(useCaseIds:any): Observable<any> {
      const url: string = this.apiUrl + 'user-use-case/permission';
      console.log(useCaseIds)
  
      return this.http.post<any>(url, useCaseIds);
    }
  
     public updateUseCase(payload:any): Observable<any> {
        const url: string = this.apiUrl + 'use_cases';
        console.log(payload)
    
        return this.http.post<Usecase[]>(url, payload);
      }
  
      public getUsecaseById(id:number):Observable<Usecase[]> {
        const url: string = this.apiUrl + 'use_cases/id/'+id;
        return this.http.get<Usecase[]>(url);
      }

      public navigateToLineage(usecaseId:number):Observable<Lineage | Lineage[]> {
        const url: string = this.lineageUrl + 'lineage/entities/json/'+usecaseId;
        return this.http.get<Lineage | Lineage[]>(url);
      }
  
      public deleteUsecase(id:number):Observable<Usecase[]> {
        const url: string = this.apiUrl + 'use_cases/'+id;
        return this.http.delete<Usecase[]>(url);
      }

      getShareableUsers(usecase_id:any): Observable<Usecase[]>
      {
        const url: string = this.apiUrl + 'use_cases';
        return this.http.get<Usecase[]>(url);
      }

      shareUseCase(payload:any): Observable<any> {
        const url: string = this.apiUrl + 'use_cases';
        console.log(payload)
    
        return this.http.post<Usecase[]>(url, payload);

      }

      public getAccessFlags(id:string):Observable<Usecase[]> {
        const url: string = this.apiUrl + 'user-use-case/access-flag/'+id;
        return this.http.get<Usecase[]>(url);
      }

      public assignUseCase(payload:any): Observable<any> {
        const url: string = this.apiUrl + 'user-use-case/assign';
        console.log(payload)
    
        return this.http.post(url, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'text' as 'json' // 👈 this prevents JSON parsing error
        });      
      }
}
