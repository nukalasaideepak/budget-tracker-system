import { Component, inject, signal, OnInit } from '@angular/core';
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
      <div class="auth-card-wrapper anim-slide-up">
        <header class="auth-brand">
          <div class="logo-symbol">BW</div>
          <h1>BudgetWise</h1>
          <p>Join the movement for financial clarity</p>
        </header>

        <section class="glass glass-card auth-card">
          <h2 class="form-title">Create Account</h2>
          <p class="form-hint">Fill in the details to get started</p>
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="username">Username</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input id="username" type="text" formControlName="username" placeholder="Choose a username" autocomplete="username">
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input id="email" type="email" formControlName="email" placeholder="jack@example.com" autocomplete="email">
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input id="password" type="password" formControlName="password" placeholder="••••••••" autocomplete="new-password">
              </div>
            </div>

            @if (errorSignal()) {
              <div class="error-msg anim-shake">
                <span class="error-icon">⚠️</span> {{ errorSignal() }}
              </div>
            }

            <button type="submit" class="btn btn-primary w-full" [disabled]="loadingSignal() || registerForm.invalid">
              @if (loadingSignal()) {
                <span class="loader"></span> Creating account...
              } @else {
                Register
              }
            </button>
          </form>

          <div class="auth-footer">
            Already have an account? <a routerLink="/login">Log In</a>
          </div>
        </section>
      </div>
    </div>

    <style>
      .auth-container { 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 40px 24px;
        background: radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 40%);
      }
      .auth-card-wrapper { width: 100%; max-width: 440px; }
      
      .auth-brand { text-align: center; margin-bottom: 40px; }
      .logo-symbol { 
        width: 64px; height: 64px; background: linear-gradient(135deg, var(--accent-emerald), var(--accent-violet));
        color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem; font-weight: 800; margin: 0 auto 16px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      }
      .auth-brand h1 { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
      .auth-brand p { color: var(--text-secondary); font-size: 1rem; }

      .auth-card { padding: 48px; }
      .form-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; text-align: center; }
      .form-hint { color: var(--text-secondary); font-size: 0.9rem; text-align: center; margin-bottom: 32px; }

      .form-group { margin-bottom: 24px; }
      label { display: block; margin-bottom: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
      
      .input-wrapper { position: relative; }
      .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; opacity: 0.5; }
      
      input { 
        width: 100%; padding: 14px 16px 14px 48px; background: rgba(255, 255, 255, 0.03); 
        border: 1px solid var(--glass-border); border-radius: 14px; 
        color: var(--text-primary); outline: none; transition: all 0.2s;
        font-size: 1rem;
      }
      input:focus { border-color: var(--accent-emerald); background: rgba(255, 255, 255, 0.06); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
      
      .w-full { width: 100%; }
      .btn { padding: 16px; border-radius: 14px; font-weight: 700; cursor: pointer; border: none; font-size: 1rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .btn-primary { 
        background: linear-gradient(135deg, var(--accent-emerald), #10b981); 
        color: var(--bg-dark); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); 
      }
      .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); filter: brightness(1.1); }
      .btn:disabled { opacity: 0.7; cursor: not-allowed; filter: grayscale(0.5); }
      
      .error-msg { 
        padding: 12px 16px; background: rgba(244, 63, 94, 0.1); color: #fb7185; 
        border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 12px; 
        margin-bottom: 24px; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;
        font-weight: 500;
      }
      
      .auth-footer { margin-top: 32px; font-size: 0.95rem; color: var(--text-secondary); text-align: center; }
      .auth-footer a { color: var(--accent-emerald); font-weight: 700; text-decoration: none; margin-left: 4px; transition: color 0.2s; }
      .auth-footer a:hover { color: #34d399; text-decoration: underline; }

      .anim-slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
      @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

      .loader { width: 18px; height: 18px; border: 2px solid rgba(0,0,0,0.1); border-top-color: var(--bg-dark); border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite; margin-right: 8px; }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>

  `
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

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
