import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>BudgetWise Login</h1>
        <div *ngIf="errorSignal()" class="error-alert">{{ errorSignal() }}</div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="Enter your username"
              class="form-control"
            />
            <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="error">
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              class="form-control"
            />
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error">
              Password is required
            </div>
          </div>

          <button type="submit" class="btn-primary" [disabled]="!loginForm.valid || loadingSignal()">
            {{ loadingSignal() ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="auth-links">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
          <p><a routerLink="/reset-password">Forgot password?</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .error-alert {
      background: #fee;
      color: #c33;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      border: 1px solid #fcc;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .error {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .auth-links {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.875rem;
    }

    .auth-links p {
      margin: 0.5rem 0;
    }

    .auth-links a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-links a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loadingSignal = signal(false);
  errorSignal = signal<string | null>(null);

  onSubmit() {
    if (this.loginForm.valid) {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);

      this.authService.login(this.loginForm.value as any).subscribe({
        next: () => {
          this.loadingSignal.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorSignal.set(err.error?.error || 'Login failed. Please check your credentials.');
          this.loadingSignal.set(false);
        }
      });
    }
  }
}
