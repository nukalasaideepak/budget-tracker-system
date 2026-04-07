import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>

      <main class="main-content">
        <header class="page-header bounce-fade">
          <h1>Data <span class="accent">Export</span></h1>
          <p class="subtitle">Securely export your data or backup to the BudgetWise Cloud.</p>
        </header>

        <div class="reports-grid">
          <!-- PDF Export -->
          <div class="glass glass-card report-card animate-fade">
            <div class="card-icon">📄</div>
            <h3>Financial Summary (PDF)</h3>
            <p>Professional, formatted report of all transactions, income, and expenses.</p>
            <button class="btn btn-primary w-full" (click)="exportPDF()">
              {{ exportingPDF() ? 'Generating...' : 'Download PDF' }}
            </button>
          </div>

          <!-- CSV Export -->
          <div class="glass glass-card report-card animate-fade" style="animation-delay: 0.1s">
            <div class="card-icon">📊</div>
            <h3>Raw Data (CSV)</h3>
            <p>Export all transaction records in a spreadsheet-friendly format.</p>
            <button class="btn btn-secondary w-full" (click)="exportCSV()">
              {{ exportingCSV() ? 'Preparing...' : 'Download CSV' }}
            </button>
          </div>

          <!-- Cloud Backup -->
          <div class="glass glass-card report-card sync-card animate-fade" style="animation-delay: 0.2s">
            <div class="card-icon sync-icon" [class.rotating]="syncing()">☁️</div>
            <h3>Cloud Backup</h3>
            <p>Synchronize your latest data with our secure Cloud storage.</p>
            
            <div class="sync-status" *ngIf="lastSync()">
              Last backup: <span>{{ lastSync() | date:'mediumTime' }}</span>
            </div>

            <button class="btn btn-accent w-full" (click)="syncCloud()" [disabled]="syncing()">
              {{ syncing() ? 'Synchronizing...' : 'Sync to Cloud' }}
            </button>
            <div class="progress-bar" *ngIf="syncing()">
              <div class="fill animate-progress"></div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <style>
      .layout { display: flex; min-height: 100vh; }
      .main-content { flex: 1; padding: 48px; max-width: 1200px; margin: 0 auto; }
      .page-header { margin-bottom: 48px; }
      .accent { color: var(--accent-emerald); }
      
      .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; }
      .report-card { padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; }
      .card-icon { font-size: 3rem; margin-bottom: 24px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 24px; }
      .report-card h3 { font-size: 1.4rem; margin-bottom: 12px; }
      .report-card p { color: var(--text-secondary); margin-bottom: 32px; font-size: 0.95rem; line-height: 1.6; }
      
      .w-full { width: 100%; }
      .btn { padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
      .btn-secondary { background: rgba(255,255,255,0.05); color: var(--text-primary); border: 1px solid var(--glass-border); }
      .btn-accent { background: linear-gradient(135deg, var(--accent-emerald), var(--accent-violet)); color: white; }
      .btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
      
      .sync-icon.rotating { animation: rotate 2s linear infinite; }
      .sync-status { margin-bottom: 16px; font-size: 0.85rem; color: var(--text-secondary); }
      .sync-status span { color: var(--accent-emerald); font-weight: 600; }
      
      .progress-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 24px; overflow: hidden; }
      .fill { height: 100%; background: var(--accent-emerald); border-radius: 10px; }
      
      @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes progress { 0% { width: 0; } 50% { width: 70%; } 100% { width: 100%; } }
      .animate-progress { animation: progress 1.5s ease-out; }
    </style>
  `
})
export class ExportComponent {
  private readonly exportService = inject(ExportService);

  exportingPDF = signal(false);
  exportingCSV = signal(false);
  syncing = signal(false);
  lastSync = signal<Date | null>(null);

  exportPDF() {
    this.exportingPDF.set(true);
    this.exportService.downloadPDF().subscribe({
      next: () => this.exportingPDF.set(false),
      error: () => this.exportingPDF.set(false)
    });
  }

  exportCSV() {
    this.exportingCSV.set(true);
    this.exportService.downloadCSV().subscribe({
      next: () => this.exportingCSV.set(false),
      error: () => this.exportingCSV.set(false)
    });
  }

  syncCloud() {
    this.syncing.set(true);
    this.exportService.syncToCloud().subscribe({
      next: () => {
        setTimeout(() => {
          this.syncing.set(false);
          this.lastSync.set(new Date());
        }, 1500); // Simulate network delay
      },
      error: () => this.syncing.set(false)
    });
  }
}
