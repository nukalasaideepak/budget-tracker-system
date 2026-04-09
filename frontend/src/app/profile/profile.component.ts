import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService, UserProfile } from '../services/profile.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  template: `
    <header class="page-header">
      <h1>Account <span class="accent">Settings</span></h1>
      <p class="subtitle">Manage your personal information and financial targets.</p>
    </header>

    <section class="glass glass-card profile-section animate-fade">
      <div class="profile-header">
        <div class="avatar-large">{{ (profile()?.username || 'BW').substring(0, 2).toUpperCase() }}</div>
        <div class="profile-meta">
          <h2>{{ profile()?.username || 'Sai Deepak' }}</h2>
          <p>{{ (profile()?.email) || 'No email set' }} | <span class="tag">Active Account</span></p>
        </div>
      </div>

      <form [formGroup]="profileForm" class="profile-form">
        <div class="section-header-row">
          <div class="section-title">Account Security</div>
        </div>
        
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="example@mail.com">
          </div>
          
          <div class="form-group full-width" *ngIf="!showPasswordEdit">
            <button type="button" class="btn btn-outline" (click)="showPasswordEdit = true">
              🔒 Change Password
            </button>
          </div>

          <!-- Step 1: Verify Current Password -->
          <ng-container *ngIf="showPasswordEdit && !isCurrentPasswordVerified">
            <div class="form-group full-width">
              <label>Current Password</label>
              <div class="input-with-action">
                <input type="password" formControlName="currentPassword" placeholder="Enter current password to continue">
                <button type="button" class="btn btn-primary" (click)="verifyCurrentPassword()" [disabled]="!this.profileForm.get('currentPassword')?.value">
                  Verify
                </button>
              </div>
              @if (passwordError) {
                <p class="error-msg">{{ passwordError }}</p>
              }
              <button type="button" class="btn-text" (click)="cancelPasswordEdit()">Cancel</button>
            </div>
          </ng-container>

          <!-- Step 2: Enter New Password -->
          <ng-container *ngIf="showPasswordEdit && isCurrentPasswordVerified">
            <div class="form-group">
              <label>New Password</label>
              <input type="password" formControlName="password" placeholder="Min 6 characters">
            </div>
            
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" formControlName="confirmPassword" placeholder="Repeat new password">
              @if (profileForm.errors?.['mismatch'] && profileForm.get('confirmPassword')?.touched) {
                <p class="error-msg">Passwords do not match</p>
              }
            </div>
            
            <div class="form-group full-width">
              <button type="button" class="btn-text" (click)="cancelPasswordEdit()">Reset & Cancel</button>
            </div>
          </ng-container>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-primary" (click)="updateProfile()" [disabled]="profileForm.invalid || (showPasswordEdit && !isCurrentPasswordVerified)">
            Save Changes
          </button>
          @if (saveSuccess) {
            <p class="success-msg animate-fade">Credentials updated successfully! ✨</p>
          }
          <p class="hint">Security updates are processed with end-to-end encryption.</p>
        </div>
      </form>
    </section>

    <style>
      .page-header { margin-bottom: 40px; }
      .accent { color: var(--accent-emerald); }
      .subtitle { color: var(--text-secondary); margin-top: 4px; }
      
      .profile-section { padding: 40px; }
      .profile-header { display: flex; align-items: center; gap: 24px; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--glass-border); }
      .avatar-large { width: 80px; height: 80px; background: var(--accent-emerald); color: var(--bg-dark); font-size: 2rem; font-weight: 800; border-radius: 24px; display: flex; align-items: center; justify-content: center; }
      .profile-meta h2 { font-size: 1.8rem; margin-bottom: 4px; }
      .tag { padding: 2px 8px; background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald); border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
      
      .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .section-title { font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald); }
      
      .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
      .form-group { margin-bottom: 24px; }
      .full-width { grid-column: 1 / -1; }
      
      label { display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px; }
      input { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-primary); outline: none; transition: border 0.2s; }
      input:focus { border-color: var(--accent-emerald); }
      
      .input-with-action { display: flex; gap: 12px; }
      .input-with-action input { flex: 1; }
      
      .form-actions { margin-top: 40px; }
      .btn { padding: 14px 32px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
      
      .btn-outline { background: transparent; border: 1px dashed var(--glass-border); color: var(--text-secondary); width: fit-content; padding: 10px 20px; }
      .btn-outline:hover { border-color: var(--accent-emerald); color: var(--accent-emerald); }
      
      .btn-text { background: transparent; border: none; color: #f87171; font-size: 0.9rem; font-weight: 600; cursor: pointer; padding: 0; margin-top: 12px; display: block; }
      
      .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
      .hint { font-size: 0.8rem; color: var(--text-secondary); margin-top: 16px; }
      .success-msg { color: var(--accent-emerald); font-size: 0.9rem; margin-top: 12px; font-weight: 600; }
      .error-msg { color: #f87171; font-size: 0.8rem; margin-top: 4px; }
    </style>

  `
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly fb = inject(FormBuilder);

  profile = signal<UserProfile | null>(null);
  saveSuccess = false;
  showPasswordEdit = false;
  isCurrentPasswordVerified = false;
  passwordError = '';

  profileForm = this.fb.group({
    email: ['', [Validators.email]],
    currentPassword: [''],
    password: ['', [Validators.minLength(6)]],
    confirmPassword: ['']
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: any) {
    const password = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    if (!password) return null;
    return password === confirm ? null : { mismatch: true };
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe(p => {
      if (p && !('error' in p)) {
        this.profile.set(p);
        this.profileForm.patchValue({
          email: (p as any).email || ''
        });
      }
    });
  }

  verifyCurrentPassword() {
    const current = this.profileForm.get('currentPassword')?.value;
    if (!current) return;

    this.profileService.verifyCurrentPassword(current).subscribe({
      next: () => {
        this.isCurrentPasswordVerified = true;
        this.passwordError = '';
      },
      error: (err) => {
        this.passwordError = 'Incorrect current password. Please try again.';
        this.isCurrentPasswordVerified = false;
      }
    });
  }

  cancelPasswordEdit() {
    this.showPasswordEdit = false;
    this.isCurrentPasswordVerified = false;
    this.passwordError = '';
    this.profileForm.patchValue({ 
      currentPassword: '', 
      password: '', 
      confirmPassword: '' 
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const { email, password } = this.profileForm.value;
      this.profileService.updateProfile({ 
        email: email!, 
        password: password || undefined 
      }).subscribe({
        next: (updated) => {
          this.profile.set(updated);
          this.saveSuccess = true;
          this.cancelPasswordEdit();
          setTimeout(() => this.saveSuccess = false, 3000);
        },
        error: (err) => alert('Failed to update credentials')
      });
    }
  }
}
