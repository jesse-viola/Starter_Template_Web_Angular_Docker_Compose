import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getItems(params: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/items", { params: params });
  }
}
