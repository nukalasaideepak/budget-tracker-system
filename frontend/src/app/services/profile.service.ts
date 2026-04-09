import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  username: string;
  email: string;
  role: string;
  income: number;
  savings: number;
  targetExpenses: number;
  password?: string;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/profile`;

  getProfile(): Observable<UserProfile | { error: string }> {
    return this.http.get<UserProfile>(this.baseUrl);
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.baseUrl, profile);
  }

  verifyCurrentPassword(currentPassword: string) {
    return this.http.post<any>(`${this.baseUrl}/verify-current-password`, { currentPassword });
  }
}
