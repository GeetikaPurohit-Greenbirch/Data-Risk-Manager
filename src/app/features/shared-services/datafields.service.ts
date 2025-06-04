import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Datafields } from '../shared-models/datafields.model';

@Injectable({
  providedIn: 'root'
})

// NOTE: DataFields service is like a digital notepad for extra info linked to stuff like clients, tasks, etc.
//  createDataFields() — saves new custom fields (like “Favorite color” for a client).
// getDataFieldsById() — fetches all those fields for a specific item (based on type + ID).
// deleteDataFields() — removes a custom field if it’s no longer needed.
// Its like giving superpowers to your forms so users can define their own fields! 

export class DatafieldsService {
  private apiUrl = environment.apiAllBaseUrl // Base URL


  constructor(private http: HttpClient) { }

  public createDataFields(dataFieldsModel: Datafields): Observable<any> {
    const url: string = this.apiUrl + 'fields';
    console.log(dataFieldsModel)

    return this.http.post<Datafields[]>(url, dataFieldsModel);
  }

   public getDataFieldsById(id:number, entity_type:any):Observable<Datafields[]> {
        const url: string = this.apiUrl + 'fields/'+entity_type+'/'+id;
    return this.http.get<Datafields[]>(url);
  }

  public deleteDataFields(id:number):Observable<Datafields[]> {
        const url: string = this.apiUrl + 'fields/'+id;
    return this.http.delete<Datafields[]>(url);
  }

}
