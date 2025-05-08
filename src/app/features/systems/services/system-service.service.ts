import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SystemsModel } from '../models/systems-model.model';

@Injectable({
  providedIn: 'root'
})
export class SystemServiceService {
  private apiUrl = environment.apiAllBaseUrl // Base URL


  constructor(private http: HttpClient) { }

  public createSystem(systemModel: SystemsModel): Observable<any> {
    const url: string = this.apiUrl + 'systems';
    console.log(systemModel)

    return this.http.post<SystemsModel[]>(url, systemModel);
  }

  public getSystems(): Observable<SystemsModel[]> {
    const url: string = this.apiUrl + 'systems';
    return this.http.get<SystemsModel[]>(url);
  }

  public updateSystem(systemModel: SystemsModel): Observable<any> {
    const url: string = this.apiUrl + 'systems';
    console.log(systemModel)

    return this.http.post<SystemsModel[]>(url, systemModel);
  }
 
  public deleteSystem(id:number): Observable<any> {
    const url: string = this.apiUrl + 'systems/' + id;

    return this.http.delete<SystemsModel[]>(url);
  }
}
