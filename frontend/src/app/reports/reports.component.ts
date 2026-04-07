import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TransactionService, Transaction } from '../services/transaction.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>

      <main class="main-content">
        <header class="page-header animate-fade">
          <h1>Financial <span class="accent">Analytics</span></h1>
          <p class="subtitle">Visualize your income and expenses over time.</p>
        </header>

        <section class="charts-container">
          <!-- Monthly Comparison Chart -->
          <div class="glass glass-card chart-card animate-fade">
            <div class="chart-header">
              <h3>Monthly Performance</h3>
              <p>Comparison of Income vs Expenses by month</p>
            </div>
            <div class="canvas-wrapper">
              <canvas #monthlyChart></canvas>
            </div>
          </div>

          <!-- Category Distribution (Optional but nice) -->
          <div class="glass glass-card chart-card animate-fade" style="animation-delay: 0.1s">
            <div class="chart-header">
              <h3>Expense Breakdown</h3>
              <p>Top spending categories this month</p>
            </div>
            <div class="canvas-wrapper doughnut">
              <canvas #categoryChart></canvas>
            </div>
          </div>
        </section>
      </main>
    </div>

    <style>
      .layout { display: flex; min-height: 100vh; }
      .main-content { flex: 1; padding: 48px; max-width: 1400px; margin: 0 auto; }
      .page-header { margin-bottom: 40px; }
      .accent { color: var(--accent-emerald); }
      
      .charts-container { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
      .chart-card { padding: 32px; min-height: 450px; display: flex; flex-direction: column; }
      .chart-header { margin-bottom: 32px; }
      .chart-header h3 { font-size: 1.25rem; margin-bottom: 4px; }
      .chart-header p { color: var(--text-secondary); font-size: 0.9rem; }
      
      .canvas-wrapper { flex: 1; position: relative; width: 100%; min-height: 300px; }
      .canvas-wrapper.doughnut { display: flex; align-items: center; justify-content: center; }
      
      canvas { width: 100% !important; height: 100% !important; }
    </style>
  `
})
export class ReportsComponent implements OnInit, AfterViewInit {
  private readonly txService = inject(TransactionService);

  @ViewChild('monthlyChart') monthlyCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryCanvas!: ElementRef<HTMLCanvasElement>;

  transactions = signal<Transaction[]>([]);

  ngOnInit() {
    this.txService.getTransactions().subscribe(txs => {
      this.transactions.set(txs);
      if (this.monthlyCanvas) this.updateCharts();
    });
  }

  ngAfterViewInit() {
    if (this.transactions().length > 0) {
      this.updateCharts();
    }
  }

  updateCharts() {
    const data = this.transactions();
    if (!data.length) return;

    // Process Monthly Data
    const monthsMap = new Map<string, { income: number, expense: number }>();
    
    data.forEach(tx => {
      const date = new Date(tx.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      const current = monthsMap.get(monthYear) || { income: 0, expense: 0 };
      if (tx.type === 'INCOME') current.income += tx.amount;
      else current.expense += tx.amount;
      
      monthsMap.set(monthYear, current);
    });

    const sortedMonths = Array.from(monthsMap.keys()).sort((a,b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    // Monthly Bar Chart
    new Chart(this.monthlyCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: sortedMonths,
        datasets: [
          {
            label: 'Income',
            data: sortedMonths.map(m => monthsMap.get(m)!.income),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 8
          },
          {
            label: 'Expenses',
            data: sortedMonths.map(m => monthsMap.get(m)!.expense),
            backgroundColor: 'rgba(244, 63, 94, 0.6)',
            borderColor: '#f43f5e',
            borderWidth: 1,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#a1a1aa' } }
        },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } },
          x: { grid: { display: false }, ticks: { color: '#a1a1aa' } }
        }
      }
    });

    // Category Doughnut Chart
    const categoryMap = new Map<string, number>();
    const currentMonth = new Date().getMonth();
    
    data.filter(tx => tx.type === 'EXPENSE' && new Date(tx.date).getMonth() === currentMonth)
        .forEach(tx => {
          categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
        });

    new Chart(this.categoryCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Array.from(categoryMap.keys()),
        datasets: [{
          data: Array.from(categoryMap.values()),
          backgroundColor: [
            'rgba(16, 185, 129, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(244, 63, 94, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(59, 130, 246, 0.6)'
          ],
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#a1a1aa' } }
        }
      }
    });
  }
}
