import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Budget {
  id?: number;
  category: string;
  limitAmount: number;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/budget`;

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.baseUrl}/all`);
  }

  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.baseUrl}/add`, budget);
  }

  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
