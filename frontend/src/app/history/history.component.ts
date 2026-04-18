import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService, Transaction } from '../services/transaction.service';
import { CategoryLimitService } from '../services/category-limit.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AddTransactionComponent } from '../dashboard/add-transaction.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AddTransactionComponent],
  template: `
    <header class="page-header">
      <h1>Transaction <span class="accent">History</span></h1>
      <p class="subtitle">A complete record of your financial journey.</p>
    </header>

    <section class="glass glass-card table-container animate-fade">
      @if (categoryFilter()) {
        <div class="category-filter-banner">
          <div class="filter-info">
            <h3>Category: <span class="accent">{{ categoryFilter() }}</span></h3>
            <p class="spent-total">Total Spent: <strong>{{ totalSpentOnCategory() | currency:'INR':'symbol-narrow' }}</strong></p>
          </div>
          <button class="action-btn" (click)="categoryFilter.set(null)" title="Clear filter">❌</button>
        </div>
      }

      <table class="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Category Limit</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (tx of filteredTransactions(); track tx.id) {
            <tr>
              <td>{{ tx.date | date:'mediumDate' }}</td>
              <td>{{ tx.description }}</td>
              <td><span class="category-tag clickable" (click)="categoryFilter.set(tx.category)" title="Filter by {{ tx.category }}">{{ tx.category }}</span></td>
              <td>
                <span class="type-tag" [class.income]="tx.type === 'INCOME'">
                  {{ tx.type }}
                </span>
              </td>
              <td class="amount-cell" [class.negative]="tx.type === 'EXPENSE'">
                {{ tx.type === 'INCOME' ? '+' : '-' }}{{ tx.amount | currency:'INR':'symbol-narrow' }}
              </td>
              <td>
                <button *ngIf="tx.type === 'EXPENSE' && limitMap()[tx.category]" class="limit-tag" (click)="promptLimit(tx)" title="Click to edit global category limit">
                  {{ limitMap()[tx.category] | currency:'INR':'symbol-narrow' }} ✏️
                </button>
                <span *ngIf="tx.type === 'EXPENSE' && !limitMap()[tx.category]" style="color:var(--text-secondary);font-size:0.8rem">
                  <button class="set-limit-btn" (click)="promptLimit(tx)">Set Limit</button>
                </span>
              </td>

              <td>
                <div class="tx-actions">
                  <button class="action-btn edit" (click)="toggleAddModal(tx)" title="Edit">✏️</button>
                  <button class="action-btn delete" (click)="confirmDelete(tx.id)" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="empty-state">No transactions found.</td>
            </tr>
          }
        </tbody>
      </table>
    </section>

    <!-- Edit Modal Reused -->
    @if (showAddModal()) {
      <app-add-transaction 
        [transactionToEdit]="selectedTransaction()"
        (onClose)="toggleAddModal()" 
        (onSaved)="loadData()">
      </app-add-transaction>
    }

    <style>
      .page-header { margin-bottom: 40px; }
      .accent { color: var(--accent-emerald); }
      .subtitle { color: var(--text-secondary); margin-top: 4px; }
      
      .table-container { padding: 0; overflow: hidden; }
      .history-table { width: 100%; border-collapse: collapse; text-align: left; }
      .history-table th { padding: 20px; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; border-bottom: 1px solid var(--glass-border); }
      .history-table td { padding: 20px; font-size: 0.95rem; border-bottom: 1px solid rgba(255,255,255,0.03); }
      
      .category-tag { padding: 4px 12px; background: rgba(255,255,255,0.05); border-radius: 20px; font-size: 0.8rem; }
      .type-tag { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; background: rgba(244, 63, 94, 0.1); color: var(--accent-rose); }
      .type-tag.income { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
      
      .limit-tag { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.3); transition: 0.2s; cursor: pointer; }
      .limit-tag:hover { background: rgba(234, 179, 8, 0.2); }

      .set-limit-btn { background: transparent; border: 1px solid var(--glass-border); color: var(--text-secondary); border-radius: 6px; padding: 4px 8px; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
      .set-limit-btn:hover { color: var(--accent-emerald); border-color: var(--accent-emerald); }

      .amount-cell { font-weight: 700; }
      .amount-cell.negative { color: var(--accent-rose); }
      .empty-state { text-align: center; padding: 60px; color: var(--text-secondary); }

      /* Action Buttons */
      .tx-actions { display: flex; gap: 8px; }
      .action-btn { 
        background: rgba(255, 255, 255, 0.05); border: none; border-radius: 8px; 
        padding: 6px 10px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
      }
      .action-btn:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
      .action-btn.edit:hover { color: var(--accent-emerald); }
      .action-btn.delete:hover { color: var(--accent-rose); }
      
      .clickable { cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
      .clickable:hover { border-color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); }
      
      .category-filter-banner { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 2px solid rgba(255,255,255,0.05); background: rgba(16, 185, 129, 0.03); }
      .category-filter-banner h3 { margin: 0; font-size: 1.1rem; }
      .spent-total { margin: 4px 0 0 0; color: var(--text-secondary); font-size: 0.95rem; }
      .spent-total strong { color: var(--accent-rose); }
    </style>

  `
})
export class HistoryComponent implements OnInit {
  private readonly txService = inject(TransactionService);
  private readonly limitService = inject(CategoryLimitService);
  private readonly route = inject(ActivatedRoute);
  
  transactions = signal<Transaction[]>([]);
  limitMap = signal<Record<string, number>>({});
  showAddModal = signal(false);
  selectedTransaction = signal<Transaction | null>(null);
  categoryFilter = signal<string | null>(null);

  filteredTransactions = computed(() => {
    const filter = this.categoryFilter();
    if (!filter) return this.transactions();
    return this.transactions().filter(tx => tx.category === filter);
  });

  totalSpentOnCategory = computed(() => {
    const filter = this.categoryFilter();
    if (!filter) return 0;
    return this.transactions()
      .filter(tx => tx.category === filter && tx.type === 'EXPENSE')
      .reduce((acc, tx) => acc + Number(tx.amount), 0);
  });

  ngOnInit() {
    this.loadData();
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.categoryFilter.set(params['category']);
      }
    });
  }

  loadData() {
    this.txService.getTransactions().subscribe(txs => this.transactions.set(txs));
    this.limitService.getLimits().subscribe(limits => {
      const map: Record<string, number> = {};
      limits.forEach(l => {
        if (l.limitAmount > 0) map[l.category] = l.limitAmount;
      });
      this.limitMap.set(map);
    });
  }

  toggleAddModal(tx: Transaction | null = null) {
    this.selectedTransaction.set(tx);
    this.showAddModal.set(!this.showAddModal());
  }

  confirmDelete(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.txService.deleteTransaction(id).subscribe({
        next: () => this.loadData(),
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete transaction');
        }
      });
    }
  }

  promptLimit(tx: Transaction) {
    const currentVal = this.limitMap()[tx.category] || '';
    const userInput = prompt(`Set global alert limit for '${tx.category}' (₹):\nType 0 or leave blank to remove limit.`, currentVal.toString());
    if (userInput !== null) {
      const limit = Number(userInput);
      if (!isNaN(limit) && limit >= 0) {
        this.limitService.saveLimit({
          category: tx.category,
          limitAmount: (limit === 0 || userInput.trim() === '') ? 0 : limit
        }).subscribe({
          next: () => this.loadData(),
          error: () => alert('Failed to set category limit. Check backend connection.')
        });
      } else {
        alert('Please enter a valid number.');
      }
    }
  }


}
