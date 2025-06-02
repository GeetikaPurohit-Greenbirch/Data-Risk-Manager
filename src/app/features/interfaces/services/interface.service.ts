import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Interface } from '../models/interface.model';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
private apiUrl = environment.apiAllBaseUrl // Base URL


  constructor(private http: HttpClient) { }

  public createInterface(payload:any): Observable<any> {
    const url: string = this.apiUrl + 'interfaces';
    console.log(payload)

    return this.http.post<any>(url, payload);
  }

   public getInterface(): Observable<Interface[]> {
      const url: string = this.apiUrl + 'interfaces';
      return this.http.get<Interface[]>(url);
    }

   public updateInterface(payload:any): Observable<any> {
      const url: string = this.apiUrl + 'interfaces';
      console.log(payload)
  
      return this.http.post<Interface[]>(url, payload);
    }

    public getInterfaceById(id:number):Observable<Interface[]> {
      const url: string = this.apiUrl + 'interfaces/id/'+id;
      return this.http.get<Interface[]>(url);
    }

    public deleteInterface(id:number):Observable<Interface[]> {
      const url: string = this.apiUrl + 'interfaces/'+id;
      return this.http.delete<Interface[]>(url);
    }
}
