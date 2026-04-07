import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container animate-fade">
      <div class="glass glass-card register-card">
        <h2 class="auth-title">Join BudgetWise</h2>
        <p class="auth-subtitle">Start tracking your way to financial freedom</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" formControlName="username" placeholder="Choose a username">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="jack@example.com">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••">
          </div>

          @if (errorSignal()) {
            <div class="error-msg">
              {{ errorSignal() }}
            </div>
          }

          <button type="submit" class="btn btn-primary w-full" [disabled]="loadingSignal()">
            {{ loadingSignal() ? 'Creating account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Login</a>
        </div>
      </div>
    </div>

    <style>
      .auth-container { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
      .register-card { width: 100%; max-width: 480px; text-align: center; }
      .success-verification { padding: 48px 24px; }
      .status-icon { font-size: 4rem; margin-bottom: 24px; }
      
      .auth-title { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
      .auth-subtitle { color: var(--text-secondary); margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5; }
      
      form { text-align: left; }
      .form-group { margin-bottom: 24px; }
      label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }
      input { width: 100%; padding: 12px 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-primary); outline: none; }
      input:focus { border-color: var(--accent-emerald); }
      
      .w-full { width: 100%; }
      .btn { padding: 14px 32px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
      
      .error-msg { padding: 12px; background: rgba(244, 63, 94, 0.1); color: var(--accent-rose); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 12px; margin-bottom: 24px; font-size: 0.85rem; }
      .auth-footer { margin-top: 32px; font-size: 0.9rem; color: var(--text-secondary); }
      .auth-footer a { color: var(--accent-emerald); font-weight: 600; text-decoration: none; }
    </style>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  loadingSignal = signal(false);
  errorSignal = signal<string | null>(null);

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      
      this.authService.register(this.registerForm.value as any).subscribe({
        next: () => {
          this.loadingSignal.set(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorSignal.set(err.error?.error || 'Registration failed. Please try again.');
          this.loadingSignal.set(false);
        }
      });
    }
  }
}
