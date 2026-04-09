import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id?: number;
  username: string;
  amount: number;
  description: string;
  category: string;
  account: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  expenseLimit?: number;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/all`);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/add`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/update/${id}`, transaction);
  }
}
