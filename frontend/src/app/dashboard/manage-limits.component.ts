import { Component, inject, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryLimitService, CategoryLimit } from '../services/category-limit.service';

@Component({
  selector: 'app-manage-limits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay animate-fade" (click)="close()">
      <div class="glass glass-card modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Manage Category Limits</h2>
          <button class="btn-close" (click)="close()">×</button>
        </div>
        
        <p class="subtitle">Set a monthly spending limit for each category. We will email you if you exceed it!</p>

        <div class="limits-list">
          @if (loading()) {
            <p>Loading limits...</p>
          } @else {
            @for (cat of categories; track cat) {
              <div class="limit-row">
                <span class="cat-name">{{ cat }}</span>
                <div class="input-wrapper">
                  <span class="currency">₹</span>
                  <input type="number" [(ngModel)]="limitMap[cat]" placeholder="0" (change)="markDirty()">
                </div>
              </div>
            }
          }
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" (click)="close()">Cancel</button>
          <button type="button" class="btn btn-primary" [disabled]="saving() || !isDirty()" (click)="saveAll()">
            {{ saving() ? 'Saving...' : 'Save Limits' }}
          </button>
        </div>
      </div>
    </div>

    <style>
      .modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center; z-index: 1000;
      }
      .modal-content { width: 100%; max-width: 500px; padding: 32px; }
      .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .subtitle { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.4; }
      .btn-close { background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; }
      
      .limits-list { max-height: 350px; overflow-y: auto; padding-right: 8px; margin-bottom: 24px; }
      
      .limit-row { 
        display: flex; justify-content: space-between; align-items: center; 
        padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .cat-name { font-weight: 500; font-size: 0.95rem; }
      
      .input-wrapper { display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 0 12px; border: 1px solid var(--glass-border); }
      .currency { color: var(--text-secondary); margin-right: 4px; }
      .input-wrapper input {
        width: 100px; padding: 8px 0; background: transparent; border: none;
        color: var(--text-primary); outline: none; font-weight: 600; text-align: right;
      }
      
      .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
      .btn { padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
      .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); }
      .btn-secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      
      /* Webkit scrollbar for limits-list */
      .limits-list::-webkit-scrollbar { width: 6px; }
      .limits-list::-webkit-scrollbar-track { background: transparent; }
      .limits-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
    </style>
  `
})
export class ManageLimitsComponent implements OnInit {
  private readonly limitService = inject(CategoryLimitService);
  
  onClose = output<void>();
  loading = signal(true);
  saving = signal(false);
  isDirty = signal(false);
  
  categories = ['Food', 'Groceries', 'Entertainment', 'Shopping', 'Transportation', 'Travel', 'Rent', 'Others'];
  limitMap: Record<string, number> = {};

  ngOnInit() {
    this.categories.forEach(c => this.limitMap[c] = null as any);
    this.limitService.getLimits().subscribe({
      next: (data) => {
        data.forEach(item => {
          if (this.limitMap[item.category] !== undefined && item.limitAmount > 0) {
            this.limitMap[item.category] = item.limitAmount;
          }
        });
        this.loading.set(false);
      },
      error: () => {
        console.error('Failed to load limits');
        this.loading.set(false);
      }
    });
  }

  markDirty() {
    this.isDirty.set(true);
  }

  close() {
    this.onClose.emit();
  }

  saveAll() {
    this.saving.set(true);
    let pending = this.categories.length;
    let errors = 0;
    
    this.categories.forEach(cat => {
      this.limitService.saveLimit({
        category: cat,
        limitAmount: this.limitMap[cat] || 0
      }).subscribe({
        next: () => {
          pending--;
          if (pending === 0) this.finishSave(errors);
        },
        error: () => {
          errors++;
          pending--;
          if (pending === 0) this.finishSave(errors);
        }
      });
    });
  }

  private finishSave(errors: number) {
    this.saving.set(false);
    if (errors > 0) {
      alert(`Failed to save ${errors} limits. Please try again later.`);
    } else {
      this.close();
    }
  }
}
