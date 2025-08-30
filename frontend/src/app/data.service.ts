import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: Define proper types for API responses and parameters
interface ItemsResponse {
  items: unknown[];
  total: number;
}

interface ItemsParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getItems(params: ItemsParams): Observable<ItemsResponse> {
    return this.http.get<ItemsResponse>(this.apiUrl + '/items', {
      params: params as Record<string, string | number | boolean>,
    });
  }
}
