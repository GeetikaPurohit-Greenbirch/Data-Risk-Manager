import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SystemsModel } from '../models/systems-model.model';
import { SystemDataFields } from '../models/system-data-fields.model';

@Injectable({
  providedIn: 'root'
})
export class SystemServiceService {
  private apiUrl = environment.apiAllBaseUrl // Base URL


  constructor(private http: HttpClient) { }

  public createSystem(payload:any): Observable<any> {
    const url: string = this.apiUrl + 'systems';
    console.log(payload)

    return this.http.post<any>(url, payload);
  }

///////// save system data fields /////////
  public createSystemDataFields(systemDataModel: SystemDataFields): Observable<any> {
    const url: string = this.apiUrl + 'fields';
    console.log(systemDataModel)

    return this.http.post<SystemDataFields[]>(url, systemDataModel);
  }

  public getSystems(): Observable<SystemsModel[]> {
    const url: string = this.apiUrl + 'systems';
    return this.http.get<SystemsModel[]>(url);
  }

  public getChildData(): Observable<SystemsModel[]> {
    const url: string = this.apiUrl + 'fields';
    return this.http.get<SystemsModel[]>(url);
  }

  public updateSystem(systemModel: SystemsModel): Observable<any> {
    const url: string = this.apiUrl + 'systems';
    console.log(systemModel)

    return this.http.post<SystemsModel[]>(url, systemModel);
  }

    public getSystemById(id:number):Observable<SystemsModel[]> {
        const url: string = this.apiUrl + 'systems/id/'+id;
        return this.http.get<SystemsModel[]>(url);
      }
  
 
 
  public deleteSystem(id:number): Observable<any> {
    const url: string = this.apiUrl + 'systems/' + id;

    return this.http.delete<SystemsModel[]>(url);
  }
}
