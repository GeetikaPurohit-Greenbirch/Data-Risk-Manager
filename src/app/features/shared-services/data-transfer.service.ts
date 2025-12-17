import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DataTransferService {

  private key = 'sharedData';

  private dataSource = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem(this.key) || 'null')
  );

  data$ = this.dataSource.asObservable();

  setData(data: any) {
    localStorage.setItem(this.key, JSON.stringify(data));
    this.dataSource.next(data);
  }

  getData() {
    return this.dataSource.value;
  }
}
