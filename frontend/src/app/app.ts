import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  template: `
    @if (authService.isAuthenticated()) {
      <div class="layout">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }
    .main-content { 
      flex: 1; 
      min-height: 100vh; 
      position: relative;
    }
  `]
})
export class App {
  protected readonly authService = inject(AuthService);
  protected readonly title = signal('BudgetWise');
}

