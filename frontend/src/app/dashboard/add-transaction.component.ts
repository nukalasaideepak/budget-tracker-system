import { Component, inject, output, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService, Transaction } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay animate-fade" (click)="close()">
      <div class="glass glass-card modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ transactionToEdit() ? 'Edit' : 'Add' }} Transaction</h2>
          <button class="btn-close" (click)="close()">×</button>
        </div>

        <form [formGroup]="txForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Amount (₹)</label>
              <input type="number" formControlName="amount" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label>Type</label>
              <select formControlName="type">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Category</label>
            <select formControlName="category">
              <option value="Food">🍔 Food</option>
              <option value="Groceries">🛒 Groceries</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Transportation">🚗 Transportation</option>
              <option value="Travel">✈️ Travel</option>
              <option value="Rent">🏠 Rent/Bills</option>
              <option value="Salary">💰 Salary</option>
              <option value="Others">📦 Others</option>
            </select>
          </div>

          @if (txForm.get('category')?.value === 'Others') {
            <div class="form-group animate-slide-in">
              <label>Description</label>
              <input type="text" formControlName="description" placeholder="Specify detail...">
            </div>
          }

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="close()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="loading() || txForm.invalid">
              {{ loading() ? 'Saving...' : (transactionToEdit() ? 'Update' : 'Save') + ' Transaction' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <style>
      .modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center; z-index: 1000;
      }
      .modal-content { width: 100%; max-width: 500px; padding: 32px; }
      .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .btn-close { background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; }
      
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .form-group { margin-bottom: 20px; }
      label { display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px; }
      input, select {
        width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border); border-radius: 12px;
        color: var(--text-primary); outline: none;
      }
      select option {
        background: #1a1a26;
        color: white;
      }
      input:focus { border-color: var(--accent-emerald); }
      
      .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px; }
      .btn { padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
      .btn-secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    </style>
  `
})
export class AddTransactionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly txService = inject(TransactionService);
  private readonly authService = inject(AuthService);

  onClose = output<void>();
  onSaved = output<void>();
  loading = signal(false);
  transactionToEdit = input<Transaction | null>(null);

  txForm = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required]],
    category: ['Food', [Validators.required]],
    type: ['EXPENSE' as 'INCOME' | 'EXPENSE', [Validators.required]],
    account: ['Cash']
  });

  ngOnInit() {
    const editData = this.transactionToEdit();
    if (editData) {
      this.txForm.patchValue({
        amount: editData.amount,
        description: editData.description,
        category: editData.category,
        type: editData.type,
        account: editData.account
      });
    }
  }

  close() {
    this.onClose.emit();
  }

  onSubmit() {
    if (this.txForm.valid) {
      this.loading.set(true);
      const transactionData = {
        ...this.txForm.value,
        description: this.txForm.get('category')?.value === 'Others' 
          ? this.txForm.get('description')?.value 
          : this.txForm.get('category')?.value,
        username: this.authService.currentUser() || 'User',
      };

      const editId = this.transactionToEdit()?.id;
      const request = editId 
        ? this.txService.updateTransaction(editId, transactionData as any)
        : this.txService.addTransaction({
            ...transactionData,
            date: new Date().toISOString().split('T')[0]
          } as any);

      request.subscribe({
        next: () => {
          this.onSaved.emit();
          this.close();
        },
        error: (err) => {
          console.error('Failed to save transaction', err);
          this.loading.set(false);
          alert('Failed to save transaction. Check backend connection.');
        }
      });
    }
  }
}
