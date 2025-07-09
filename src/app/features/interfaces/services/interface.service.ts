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
private lineageUrl = environment.apiLineageBaseUrl


  constructor(private http: HttpClient) { }

  public createInterface(payload:any): Observable<any> {
    const url: string = this.apiUrl + 'interfaces';
    console.log(payload)

    return this.http.post<any>(url, payload);
  }

  ///// save inbound interface ////


  public saveInboundInterface(payload: any, systemId: any): Observable<any> {
    const url: string = this.lineageUrl + 'mapping/entity';
    console.log(payload)

    return this.http.post<any>(url, payload);
  }

  public deleteInboundInterface(interface_id:any, system_id:any, entity_type:string): Observable<any> {
    const url: string = this.lineageUrl + 'mapping/entity/system/'+system_id+'/interface/'+interface_id+'/'+entity_type;
    return this.http.delete<any>(url);
  }
  //// get inbound data /////
  
  public getInboundData(systemid:any): Observable<Interface[]> {
    const url: string = this.lineageUrl + 'mapping/entity/'+systemid;
    return this.http.get<Interface[]>(url);
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
