import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;
  
  // Storage keys
  private readonly TOKEN_KEY = 'budgetwise_token';
  private readonly USER_KEY = 'budgetwise_user';

  // Signals for reactive state
  readonly currentUser = signal<string | null>(this.getStoredUser());
  readonly isAuthenticated = signal<boolean>(!!this.getStoredToken());

  login(credentials: { username: string; password?: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          this.setSession(res.token, res.username);
        }
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  verifyEmail(token: string) {
    return this.http.get<any>(`${this.apiUrl}/auth/verify-email?token=${token}`);
  }

  requestPasswordReset(email: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  verifyResetOtp(token: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/verify-reset-otp`, { token });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  private setSession(token: string, username: string) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USER_KEY, username);
    this.currentUser.set(username);
    this.isAuthenticated.set(true);
  }

  getStoredToken(): string | null {
    // One-time cleanup of old localStorage to fix the "not asking for login" issue
    if (localStorage.getItem(this.TOKEN_KEY)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): string | null {
    return sessionStorage.getItem(this.USER_KEY);
  }
}
