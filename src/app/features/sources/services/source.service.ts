import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sources } from '../models/sources.model';

@Injectable({
  providedIn: 'root'
})
export class SourceService {  
  private apiUrl = environment.apiAllBaseUrl // Base URL


  constructor(private http: HttpClient) { }

  public createSource(payload:any): Observable<any> {
    const url: string = this.apiUrl + 'sources';
    console.log(payload)

    return this.http.post<any>(url, payload);
  }

   public getSources(): Observable<Sources[]> {
        const url: string = this.apiUrl + 'sources';
        return this.http.get<Sources[]>(url);
      }

  public getSourceById(id:number):Observable<Sources[]> {
        const url: string = this.apiUrl + 'sources/id/'+id;
        return this.http.get<Sources[]>(url);
      }

   public deleteSource(id:number):Observable<Sources[]> {
        const url: string = this.apiUrl + 'sources/'+id;
        return this.http.delete<Sources[]>(url);
      }
  
  public updateSource(payload:any): Observable<any> {
        const url: string = this.apiUrl + 'sources';
        console.log(payload)
    
        return this.http.post<Sources[]>(url, payload);
      }
  
  
}
