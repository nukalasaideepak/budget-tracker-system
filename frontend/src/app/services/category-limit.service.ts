import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryLimit {
  id?: number;
  username?: string;
  category: string;
  limitAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryLimitService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8082/api/limits';

  getLimits(): Observable<CategoryLimit[]> {
    return this.http.get<CategoryLimit[]>(this.apiUrl);
  }

  saveLimit(limit: CategoryLimit): Observable<CategoryLimit> {
    return this.http.post<CategoryLimit>(this.apiUrl, limit);
  }
}
