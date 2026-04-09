import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { SavingsComponent } from './savings/savings.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';
import { ExportComponent } from './export/export.component';
import { VerifyEmailComponent } from './auth/verify-email.component';
import { ResetPasswordComponent } from './auth/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'history', 
    component: HistoryComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'savings', 
    component: SavingsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'reports', 
    component: ReportsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'export', 
    component: ExportComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
