import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-container animate-fade">
      <div class="glass glass-card verify-card">
        @if (status() === 'loading') {
          <div class="status-icon loading">⏳</div>
          <h2 class="auth-title">Verifying...</h2>
          <p class="auth-subtitle">Please wait while we activate your account.</p>
        } @else if (status() === 'success') {
          <div class="status-icon success">✅</div>
          <h2 class="auth-title">Account Verified!</h2>
          <p class="auth-subtitle">Your account is now active. You can proceed to login.</p>
          <button routerLink="/login" class="btn btn-primary w-full">Go to Login</button>
        } @else {
          <div class="status-icon error">❌</div>
          <h2 class="auth-title">Verification Failed</h2>
          <p class="auth-subtitle">{{ errorMessage() || 'The link may be invalid or expired.' }}</p>
          <button routerLink="/register" class="btn btn-primary w-full">Try Registering Again</button>
        }
      </div>
    </div>

    <style>
      .auth-container { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
      .verify-card { width: 100%; max-width: 420px; text-align: center; padding: 48px 32px; }
      .status-icon { font-size: 4rem; margin-bottom: 24px; }
      .auth-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; }
      .auth-subtitle { color: var(--text-secondary); margin-bottom: 32px; font-size: 1rem; line-height: 1.5; }
      .w-full { width: 100%; }
      .btn { padding: 14px 32px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
    </style>
  `
})
export class VerifyEmailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  status = signal<'loading' | 'success' | 'error'>('loading');
  errorMessage = signal<string>('');

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: () => this.status.set('success'),
        error: (err) => {
          this.status.set('error');
          this.errorMessage.set(err.error?.error || 'Verification failed');
        }
      });
    } else {
      this.status.set('error');
      this.errorMessage.set('No token provided.');
    }
  }
}
