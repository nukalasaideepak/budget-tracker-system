import { Component, inject, signal, OnInit } from '@angular/core';
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
    <div class="auth-container animate-fade">
      <div class="glass glass-card auth-card">
        <h1 class="brand" style="font-size: 2.5rem; margin-bottom: 8px; text-align: center;">BudgetWise</h1>
        <h2 style="text-align: center; margin-bottom: 32px; font-weight: 500; color: var(--text-secondary);">Welcome Back</h2>
        
        @if (errorSignal()) {
          <div class="error-msg">
            {{ errorSignal() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="Enter your username"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" class="btn btn-primary w-full" [disabled]="!loginForm.valid || loadingSignal()">
            {{ loadingSignal() ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register</a></p>
          <p><a routerLink="/reset-password">Forgot password?</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { 
      height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 24px;
    }
    
    .auth-card { 
      width: 100%; 
      max-width: 440px; 
      padding: 48px;
    }

    form { display: flex; flex-direction: column; gap: 24px; }
    
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    
    label { 
      font-size: 0.9rem; 
      font-weight: 600; 
      color: var(--accent-emerald); 
      text-transform: uppercase; 
      letter-spacing: 1px;
    }

    input { 
      width: 100%; 
      padding: 14px 18px; 
      background: rgba(255, 255, 255, 0.04); 
      border: 1px solid var(--glass-border); 
      border-radius: 14px; 
      color: var(--text-primary); 
      outline: none; 
      transition: all 0.2s; 
    }

    input:focus { 
      border-color: var(--accent-emerald); 
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    }

    .btn { 
      padding: 14px; 
      border-radius: 14px; 
      border: none; 
      font-weight: 700; 
      cursor: pointer; 
      transition: all 0.2s; 
      font-size: 1rem;
    }

    .btn-primary { 
      background: var(--accent-emerald); 
      color: var(--bg-dark); 
    }

    .btn-primary:hover:not(:disabled) { 
      filter: brightness(1.1); 
      transform: translateY(-2px);
    }

    .btn-primary:disabled { 
      opacity: 0.5; 
      cursor: not-allowed; 
    }

    .error-msg { 
      padding: 12px; 
      background: rgba(244, 63, 94, 0.1); 
      color: var(--accent-rose); 
      border: 1px solid rgba(244, 63, 94, 0.2); 
      border-radius: 12px; 
      margin-bottom: 24px; 
      font-size: 0.85rem; 
      text-align: center;
    }

    .auth-footer { 
      margin-top: 32px; 
      text-align: center; 
      font-size: 0.9rem; 
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .auth-footer a { 
      color: var(--accent-emerald); 
      text-decoration: none; 
      font-weight: 600; 
    }

    .auth-footer a:hover { text-decoration: underline; }
    
    .w-full { width: 100%; }
  `]

})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

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
