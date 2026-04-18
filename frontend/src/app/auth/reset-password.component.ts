import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container animate-fade">
      <div class="glass glass-card reset-card">
        @if (step() === 'success') {
          <div class="status-icon success">🎉</div>
          <h2 class="auth-title">Password Reset!</h2>
          <p class="auth-subtitle">Your password has been updated successfully. You can now login with your new credentials.</p>
          <button routerLink="/login" class="btn btn-primary w-full">Go to Login</button>
        } 
        
        @else if (step() === 'request') {
          <h2 class="auth-title">Forgot Password</h2>
          <p class="auth-subtitle">Enter your email and we will send you a 6-digit OTP to reset your password.</p>

          <form [formGroup]="requestForm" (ngSubmit)="onRequestSubmit()">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input id="email" type="email" formControlName="email" placeholder="Enter your email">
            </div>

            @if (errorMessage()) {
              <div class="error-msg container">
                {{ errorMessage() }}
              </div>
            }

            <button type="submit" class="btn btn-primary w-full" [disabled]="requestForm.invalid || loading()">
              {{ loading() ? 'Sending...' : 'Send OTP' }}
            </button>
            <div class="auth-footer">
              <p><a routerLink="/login">Back to Login</a></p>
            </div>
          </form>
        }

        @else if (step() === 'verify') {
          <h2 class="auth-title">Verify OTP</h2>
          <p class="auth-subtitle">Enter the 6-digit OTP sent to your email.</p>

          <form [formGroup]="verifyForm" (ngSubmit)="onVerifySubmit()">
            <div class="form-group">
              <label for="otp">OTP Code</label>
              <input id="otp" type="text" formControlName="otp" placeholder="e.g. 123456" maxlength="6">
            </div>

            @if (errorMessage()) {
              <div class="error-msg container">
                {{ errorMessage() }}
              </div>
            }

            <button type="submit" class="btn btn-primary w-full" [disabled]="verifyForm.invalid || loading()">
              {{ loading() ? 'Verifying...' : 'Verify OTP' }}
            </button>
            <div class="auth-footer">
              <p><a (click)="step.set('request')" style="cursor: pointer;">Back</a></p>
            </div>
          </form>
        }

        @else if (step() === 'reset') {
          <h2 class="auth-title">New Password</h2>
          <p class="auth-subtitle">Enter your new password below.</p>

          <form [formGroup]="resetForm" (ngSubmit)="onResetSubmit()">
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
      .auth-subtitle { color: var(--text-secondary); margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5; }
      
      form { text-align: left; }
      .form-group { margin-bottom: 24px; }
      label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }
      input { width: 100%; padding: 12px 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-primary); outline: none; }
      input:focus { border-color: var(--accent-emerald); }
      
      .w-full { width: 100%; }
      .btn { padding: 14px 32px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
      .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .error-msg { color: #f87171; font-size: 0.85rem; margin-top: 8px; }
      .error-msg.container { padding: 12px; background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 12px; margin-bottom: 24px; }
      .auth-footer { margin-top: 24px; text-align: center; font-size: 0.9rem; color: var(--text-secondary); }
      .auth-footer a { color: var(--accent-emerald); text-decoration: none; font-weight: 600; }
      .auth-footer a:hover { text-decoration: underline; }
    </style>
  `
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // States: request -> verify -> reset -> success
  step = signal<'request' | 'verify' | 'reset' | 'success'>('request');
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  verifiedOtp = signal<string | null>(null);

  requestForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  verifyForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]]
  });

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: any) {
    const p = g.get('password')?.value;
    const c = g.get('confirmPassword')?.value;
    return p === c ? null : { mismatch: true };
  }

  onRequestSubmit() {
    if (this.requestForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.authService.requestPasswordReset(this.requestForm.value.email!).subscribe({
        next: () => {
          this.loading.set(false);
          this.step.set('verify');
        },
        error: (err) => {
          this.errorMessage.set(err.error?.error || 'Failed to send OTP.');
          this.loading.set(false);
        }
      });
    }
  }

  onVerifySubmit() {
    if (this.verifyForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      const otp = this.verifyForm.value.otp!;
      this.authService.verifyResetOtp(otp).subscribe({
        next: () => {
          this.verifiedOtp.set(otp);
          this.loading.set(false);
          this.step.set('reset');
        },
        error: (err) => {
          this.errorMessage.set(err.error?.error || 'Invalid OTP.');
          this.loading.set(false);
        }
      });
    }
  }

  onResetSubmit() {
    if (this.resetForm.valid && this.verifiedOtp()) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.authService.resetPassword(this.verifiedOtp()!, this.resetForm.value.password!).subscribe({
        next: () => {
          this.loading.set(false);
          this.step.set('success');
        },
        error: (err) => {
          this.errorMessage.set(err.error?.error || 'Failed to reset password.');
          this.loading.set(false);
        }
      });
    }
  }
}
