import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lineage } from '../models/usecase.model';
import { LineageRecord } from '../component/diagram/diagram.component';

@Injectable({
  providedIn: 'root'
})
export class LineageService {
  private apiUrl = environment.apiLineageBaseUrl // Base URL
  private apiUrlForEntity = environment.apiAllBaseUrl // Base URL

  constructor(private http: HttpClient) { }

  
    public createLineage(payload:any): Observable<any> {
      const url: string = this.apiUrl + `lineage/entities/json/${payload.use_case_id}/${payload.lineage_name}`;
      console.log(payload)
      const payloadData = {

      }
  
      return this.http.post<any>(url, payloadData);
    }
  
    public getLineage(): Observable<Lineage[]> {
         const url: string = this.apiUrl + `lineage/entities/json/all`;
        return this.http.get<any[]>(url);
      }

    public deleteLineage(payload:any): Observable<Lineage[]> {
         const url: string = this.apiUrl + `lineage/entities/json/id/${payload.id}`;
        return this.http.delete<any[]>(url);
      }
     
    public updateLineage(payload:any): Observable<Lineage[]> {
          console.log("Update Payload: ", payload);
         const url: string = this.apiUrl + `lineage/entities/json/${payload.use_case_id}/${payload.lineage_name}`;
        return this.http.put<any[]>(url, payload);
      }
  
    public getLineageByUseCaseId(useCaseId: string) {
        const url: string = this.apiUrl + `lineage/entities/json/${useCaseId}`;
        return this.http.get<LineageRecord>(url);
      } 
    
    public saveLineageById(lineage: Lineage, payload:any): Observable<Lineage> {
        const url: string = this.apiUrl + `lineage/entities/json/${lineage.use_case_id}/${lineage.name}`;
        return this.http.put<Lineage>(url, payload);
      }      

    public getAllSources(){
        const url: string = this.apiUrlForEntity + `sources`;
        return this.http.get<any[]>(url);
    }   

    public getAllByEntityType(entityType: string){
        const url: string = this.apiUrlForEntity + `${entityType}`;
        return this.http.get<any[]>(url);
    }

    public getEntityById(entityType: string, id: number){
        const url: string = this.apiUrlForEntity + `${entityType}/${id}/details`;
        return this.http.get<any>(url);
    }

    public saveLineageDetailsByLinkId(linkId: string,usecaseId: string, payload:any){
        const url: string = this.apiUrl + `lineage/fields/json/${usecaseId}/${linkId}`;
        return this.http.post<any>(url, payload);
    }

      public updateLineageDetailsByLinkId(linkId: string,usecaseId: string, payload:any){
        const url: string = this.apiUrl + `lineage/fields/json/${usecaseId}/${linkId}`;
        return this.http.put<any>(url, payload);
    }

      public getLineageDetailsByLinkId(linkId: string,usecaseId: string){
        const url: string = this.apiUrl + `lineage/fields/json/${usecaseId}/${linkId}`;
        return this.http.get<any>(url);
    }

}
