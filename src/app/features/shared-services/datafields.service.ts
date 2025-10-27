import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Datafields } from '../shared-models/datafields.model';

@Injectable({
  providedIn: 'root'
})
export class DatafieldsService {
  private apiUrl = environment.apiAllBaseUrl // Base URL
  private lineageUrl = environment.apiLineageBaseUrl


  constructor(private http: HttpClient) { }

   public createDataFields(dataFieldsModel: Datafields): Observable<any> {
      const url: string = this.apiUrl + 'fields';
      console.log(dataFieldsModel)
  
      return this.http.post<Datafields[]>(url, dataFieldsModel);
    }

    public createDataFieldsWithUsecase(dataFieldsModel: Datafields, entity_type:any, entity_id:any, usecaseid:any): Observable<any> {
      const url: string = this.apiUrl + 'fields/'+entity_type+'/'+entity_id+'/'+usecaseid;
      console.log(dataFieldsModel)
  
      return this.http.post<Datafields[]>(url, dataFieldsModel);
    }

    public createGlobalRisk(dataFieldsModel: Datafields): Observable<any> {
      const url: string = this.apiUrl + 'entity-risk-config';
      console.log(dataFieldsModel)
  
      return this.http.post<Datafields[]>(url, dataFieldsModel);
    }

  public updateInterface(dataFieldsModel: Datafields): Observable<any> {
        const url: string = this.apiUrl + 'fields';
        console.log(dataFieldsModel)
    
        return this.http.post<Datafields[]>(url, dataFieldsModel);
      }

      public updateDataFieldsWithUsecase(dataFieldsModel: Datafields, entity_type:any, entity_id:any, usecaseid:any): Observable<any> {
        const url: string = this.apiUrl + 'fields/'+entity_type+'/'+entity_id+'/'+usecaseid;
        console.log(dataFieldsModel)
    
        return this.http.post<Datafields[]>(url, dataFieldsModel);
      }

      public updateControlsDatafields(dataFieldsModel: Datafields): Observable<any> {
        const url: string = this.apiUrl + 'controls/field';
        console.log(dataFieldsModel)
    
        return this.http.post<Datafields[]>(url, dataFieldsModel);
      }


      public updateGlobalRisk(dataFieldsModel: Datafields): Observable<any> {
        const url: string = this.apiUrl + 'entity-risk-config';
        console.log(dataFieldsModel)
    
        return this.http.post<Datafields[]>(url, dataFieldsModel);
      }

   public getDataFieldsById(id:number, entity_type:any):Observable<Datafields[]> {
        const url: string = this.apiUrl + 'fields/'+entity_type+'/'+id;
        return this.http.get<Datafields[]>(url);
      }

      public getControlsDatafields(control_id:any): Observable<Datafields[]> {
        const url: string = this.apiUrl + 'controls/field/id/'+control_id;
        return this.http.get<Datafields[]>(url);
      }

      public getDataFieldsByIdWithUsecase(id:number, entity_type:any, usecaseid:any):Observable<Datafields[]> {
        const url: string = this.apiUrl + 'fields/'+entity_type+'/'+id+'/'+usecaseid;
        return this.http.get<Datafields[]>(url);
      }

      public getDataFieldsDQA(id:number, entity_type:any):Observable<Datafields[]> {
        const url: string = this.apiUrl + 'entity-risk-config/'+entity_type+'/'+id;
        return this.http.get<Datafields[]>(url);
      }

  public deleteDataFields(id:number, entity_type:string, entity_id:number):Observable<Datafields[]> {
        const url: string = this.apiUrl + 'fields/'+entity_type+'/'+entity_id+'/'+id;
        return this.http.delete<Datafields[]>(url);
      }


      ///// Save field mappings /////

      public saveFieldMapping(Datafields: any): Observable<any> {
        const url: string = this.lineageUrl + 'mapping/fields';
        console.log(Datafields)
    
        // return this.http.post<Datafields[]>(url, Datafields);
        return this.http.post(url, Datafields, {
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'text' as 'json' // 👈 this prevents JSON parsing error
        });   
      }

      public deleteAllSystemMapping(systemId:number): Observable<any> {
        const url: string = this.lineageUrl + 'mapping/fields/system/'+systemId;
        return this.http.delete<any[]>(url,{
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'text' as 'json' // 👈 this prevents JSON parsing error
        });    
      }


      public getMappings(systemId:any):Observable<any[]> {
        const url: string = this.lineageUrl + 'mapping/fields/'+ systemId;
        return this.http.get<any[]>(url);

      }

      public deleteFieldMapping(mappingId: number): Observable<any> {
        const url: string = this.lineageUrl + 'mapping/fields/id/'+mappingId;
        return this.http.delete<any[]>(url,{
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'text' as 'json' // 👈 this prevents JSON parsing error
        });      
      }

      public getTargetReportdata(use_case_id:number, target_id:any):Observable<Datafields[]> {
        const url: string = this.lineageUrl + 'reports/target/'+use_case_id+'/'+target_id;
        return this.http.get<Datafields[]>(url);
      }
}
