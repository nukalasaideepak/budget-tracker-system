import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService, UserProfile } from '../services/profile.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar glass">
      <div class="sidebar-header">
        <div class="brand">BudgetWise</div>
      </div>
      
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
          <span class="icon">📊</span> Dashboard
        </a>
        <a routerLink="/history" routerLinkActive="active" class="nav-link">
          <span class="icon">💸</span> Transactions
        </a>
        <a routerLink="/savings" routerLinkActive="active" class="nav-link">
          <span class="icon">🎯</span> Budgets
        </a>
        <a routerLink="/reports" routerLinkActive="active" class="nav-link">
          <span class="icon">📊</span> Reports
        </a>
        <a routerLink="/export" routerLinkActive="active" class="nav-link">
          <span class="icon">📂</span> Export
        </a>
        <a routerLink="/profile" routerLinkActive="active" class="nav-link">
          <span class="icon">⚙️</span> Settings
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="profile-card" routerLink="/profile">
          <div class="avatar">{{ (profile()?.username || 'BW').substring(0,2).toUpperCase() }}</div>
          <div class="profile-info">
            <p class="name">{{ profile()?.username || 'Sai Deepak' }}</p>
            <p class="status">Premium User</p>
          </div>
          <span class="icon logout-btn" (click)="$event.stopPropagation(); logout()" title="Logout">🚪</span>
        </div>
      </div>
    </aside>

    <style>
      .sidebar { 
        width: 280px; height: 100vh; position: sticky; top: 0; 
        display: flex; flex-direction: column; padding: 32px 0; 
        border-right: 1px solid var(--glass-border); 
      }
      .sidebar-header { padding: 0 32px 40px; }
      .brand { 
        font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; 
        background: linear-gradient(to right, var(--accent-emerald), var(--accent-violet)); 
        background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
      }
      .sidebar-nav { padding: 0 16px; flex: 1; }
      .nav-link { 
        display: flex; align-items: center; padding: 12px 16px; color: var(--text-secondary); 
        text-decoration: none; border-radius: 12px; margin-bottom: 4px; transition: all 0.2s; font-weight: 500; 
      }
      .nav-link .icon { margin-right: 12px; font-size: 1.2rem; }
      .nav-link:hover, .nav-link.active { color: var(--text-primary); background: rgba(255, 255, 255, 0.05); }
      .nav-link.active { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
      
      .sidebar-footer { padding: 24px 16px; border-top: 1px solid var(--glass-border); }
      .profile-card { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 16px; cursor: pointer; }
      .profile-card:hover { background: rgba(255,255,255,0.03); }
      .avatar { 
        width: 40px; height: 40px; border-radius: 12px; background: var(--accent-emerald); 
        display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--bg-dark); 
      }
      .name { font-weight: 600; font-size: 0.9rem; }
      .status { font-size: 0.75rem; color: var(--text-secondary); }
      .logout-btn { 
        margin-left: auto; transition: transform 0.2s; 
        padding: 4px; border-radius: 4px;
      }
      .logout-btn:hover { 
        transform: scale(1.1); background: rgba(244, 63, 94, 0.1); 
      }
    </style>
  `
})
export class SidebarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  
  profile = signal<UserProfile | null>(null);

  ngOnInit() {
    this.profileService.getProfile().subscribe(p => {
      if (p && !('error' in p)) this.profile.set(p);
    });
  }

  logout() {
    this.authService.logout();
  }
}
