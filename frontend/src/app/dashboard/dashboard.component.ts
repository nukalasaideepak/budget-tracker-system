import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService, Transaction } from '../services/transaction.service';
import { ProfileService, UserProfile } from '../services/profile.service';
import { BudgetService, Budget } from '../services/budget.service';
import { AuthService } from '../services/auth.service';
import { AddTransactionComponent } from './add-transaction.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AddTransactionComponent, SidebarComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly txService = inject(TransactionService);
  private readonly profileService = inject(ProfileService);
  private readonly budgetService = inject(BudgetService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  // Quick Add Form
  quickAddForm = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    type: ['', [Validators.required]],
    category: ['', [Validators.required]],
    description: ['']
  });

  // Reactive state
  transactions = signal<Transaction[]>([]);
  profile = signal<UserProfile | null>(null);
  budgets = signal<Budget[]>([]);
  showAddModal = signal(false);
  selectedTransaction = signal<Transaction | null>(null);

  // Computed totals
  totalBalance = computed(() => {
    return this.transactions().reduce((acc, tx) => {
      const amt = Number(tx.amount);
      return tx.type === 'INCOME' ? acc + amt : acc - amt;
    }, 0);
  });

  totalIncome = computed(() => {
    return this.transactions()
      .filter(tx => tx.type === 'INCOME')
      .reduce((acc, tx) => acc + Number(tx.amount), 0);
  });

  totalExpenses = computed(() => {
    return this.transactions()
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((acc, tx) => acc + Number(tx.amount), 0);
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.txService.getTransactions().subscribe({
      next: (txs) => this.transactions.set(txs),
      error: () => console.log('Wait for backend or check auth')
    });
    
    this.profileService.getProfile().subscribe({
      next: (p) => {
        if (p && !('error' in p)) this.profile.set(p);
      }
    });

    this.budgetService.getBudgets().subscribe({
      next: (b) => this.budgets.set(b)
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
        error: (err) => alert('Failed to delete transaction')
      });
    }
  }

  isOtherSelected() {
    return this.quickAddForm.get('category')?.value === 'Others';
  }

  onQuickAdd() {
    if (this.quickAddForm.valid) {
      const val = this.quickAddForm.value;
      const transaction = {
        amount: val.amount,
        category: val.category,
        description: val.category === 'Others' ? val.description : val.category,
        type: val.type,
        date: new Date().toISOString().split('T')[0],
        username: this.authService.currentUser() || 'User',
        account: 'Cash'
      };

      this.txService.addTransaction(transaction as any).subscribe({
        next: () => {
          this.quickAddForm.reset({ type: '', category: '' });
          this.loadData();
        },
        error: (err) => console.error('Quick add failed', err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
