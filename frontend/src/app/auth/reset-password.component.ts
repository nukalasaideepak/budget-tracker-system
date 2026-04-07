import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container animate-fade">
      <div class="glass glass-card reset-card">
        @if (success()) {
          <div class="status-icon success">🎉</div>
          <h2 class="auth-title">Password Reset!</h2>
          <p class="auth-subtitle">Your password has been updated successfully. You can now login with your new credentials.</p>
          <button routerLink="/login" class="btn btn-primary w-full">Go to Login</button>
        } @else {
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-subtitle">Enter your new password below.</p>

          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="password">New Password</label>
              <input id="password" type="password" formControlName="password" placeholder="Min 6 characters">
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="Repeat new password">
              @if (resetForm.errors?.['mismatch'] && resetForm.get('confirmPassword')?.touched) {
                <p class="error-msg">Passwords do not match</p>
              }
            </div>

            @if (errorMessage()) {
              <div class="error-msg container">
                {{ errorMessage() }}
              </div>
            }

            <button type="submit" class="btn btn-primary w-full" [disabled]="resetForm.invalid || loading()">
              {{ loading() ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
        }
      </div>
    </div>

    <style>
      .auth-container { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
      .reset-card { width: 100%; max-width: 420px; text-align: center; padding: 48px 32px; }
      .status-icon { font-size: 4rem; margin-bottom: 24px; }
      .auth-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; }
      .auth-subtitle { color: var(--text-secondary); margin-bottom: 32px; font-size: 1rem; line-height: 1.5; }
      
      form { text-align: left; }
      .form-group { margin-bottom: 24px; }
      label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }
      input { width: 100%; padding: 12px 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-primary); outline: none; }
      input:focus { border-color: var(--accent-emerald); }
      
      .w-full { width: 100%; }
      .btn { padding: 14px 32px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
      .error-msg { color: #f87171; font-size: 0.85rem; margin-top: 8px; }
      .error-msg.container { padding: 12px; background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 12px; margin-bottom: 24px; }
    </style>
  `
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  success = signal(false);
  errorMessage = signal<string | null>(null);
  token: string | null = null;

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: any) {
    const p = g.get('password')?.value;
    const c = g.get('confirmPassword')?.value;
    return p === c ? null : { mismatch: true };
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage.set('Invalid reset link. No token found.');
    }
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.loading.set(true);
      this.authService.resetPassword(this.token, this.resetForm.get('password')?.value!)
        .subscribe({
          next: () => {
            this.success.set(true);
            this.loading.set(false);
          },
          error: (err) => {
            this.errorMessage.set(err.error?.error || 'Failed to reset password');
            this.loading.set(false);
          }
        });
    }
  }
}
