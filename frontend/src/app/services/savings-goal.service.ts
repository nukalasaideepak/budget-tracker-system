import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SavingsGoal {
  id?: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  username: string;
  category?: string;
  targetDate?: string;
  monthlyAllocationPercentage?: number;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavingsGoalService {
  private apiUrl = `${environment.apiUrl}/api/savings-goals`;

  constructor(private http: HttpClient) {}

  getGoals(username: string): Observable<SavingsGoal[]> {
    return this.http.get<SavingsGoal[]>(`${this.apiUrl}?username=${username}`);
  }

  addGoal(goal: SavingsGoal): Observable<SavingsGoal> {
    return this.http.post<SavingsGoal>(this.apiUrl, goal);
  }

  updateGoal(id: number, goal: SavingsGoal): Observable<SavingsGoal> {
    return this.http.put<SavingsGoal>(`${this.apiUrl}/${id}`, goal);
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
