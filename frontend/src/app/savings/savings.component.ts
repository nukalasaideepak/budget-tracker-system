import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService, Budget } from '../services/budget.service';
import { ProfileService, UserProfile } from '../services/profile.service';
import { RouterLink } from '@angular/router';
import { SavingsGoalService, SavingsGoal } from '../services/savings-goal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <header class="page-header">
      <h1>Savings & <span class="accent">Goals</span></h1>
      <p class="subtitle">Track your progress toward financial freedom.</p>
    </header>

    <!-- Savings Goals Section -->
    <section class="savings-goals-section animate-fade" style="animation-delay: 0.15s">
      <div class="section-header">
        <h2>Savings Goals</h2>
        <button class="btn btn-primary" (click)="openAddModal()">+ Add Goal</button>
      </div>
      
      <div class="goals-list-grid">
        @for (goal of savingsGoals(); track goal.id) {
          <div class="glass glass-card goal-item-card">
            <div class="goal-item-header">
              <div class="goal-top-info">
                <div class="category-info">
                  <span class="category-icon">{{ getCategoryIcon(goal.category) }}</span>
                  <span class="category-badge">{{ goal.category || 'Goal' }}</span>
                </div>
                <h4>{{ goal.goalName }}</h4>
                <span class="goal-target">{{ goal.targetAmount | currency:'INR':'symbol-narrow' }}</span>
              </div>
              <div class="item-actions">
                <button class="btn-icon edit-btn" (click)="openEditModal(goal)" title="Edit">✏️</button>
                <button class="btn-icon delete-btn" (click)="deleteGoal(goal.id!)" title="Delete">🗑️</button>
              </div>
            </div>
            
            <div class="progress-container">
              <div class="progress-bar">
                <div class="fill" [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100"></div>
              </div>
              <div class="progress-stats">
                <span>Saved: {{ goal.currentAmount | currency:'INR':'symbol-narrow' }}</span>
                <span>{{ (goal.currentAmount / goal.targetAmount) * 100 | number:'1.0-0' }}%</span>
              </div>
            </div>

            @if (goal.monthlyAllocationPercentage) {
              <div class="goal-allocation-badge">
                <span>Monthly Target: {{ goal.monthlyAllocationPercentage }}% of income</span>
              </div>
            }

            @if (goal.targetDate) {
              <div class="goal-footer">
                <span class="deadline">📅 Target: {{ goal.targetDate | date:'mediumDate' }}</span>
                <span class="days-left" [class.urgent]="isUrgent(goal.targetDate)">
                  {{ getDaysRemaining(goal.targetDate) }} days left
                </span>
              </div>
            }
          </div>
        } @empty {
          <div class="glass glass-card empty-goals">
            <p>No savings goals yet. Start planning for your future!</p>
          </div>
        }
      </div>
    </section>

    <!-- Add Goal Modal -->
    @if (showGoalModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="glass glass-card modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Edit' : 'Create' }} <span class="accent">{{ isEditing ? 'Goal' : 'New Goal' }}</span></h3>
            <button class="btn-icon" (click)="closeModal()">✕</button>
          </div>
          <form (submit)="saveGoal(); $event.preventDefault()" class="modal-form">
            <div class="form-group">
              <label>Goal Name</label>
              <input type="text" [(ngModel)]="newGoal.goalName" name="goalName" placeholder="e.g., Summer Trip, Wedding Fund" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="newGoal.category" name="category" class="glass-select">
                  <option value="Vacation">✈️ Vacation</option>
                  <option value="Home">🏠 Home</option>
                  <option value="Car">🚗 Car</option>
                  <option value="Education">🎓 Education</option>
                  <option value="Emergency">🏥 Emergency Fund</option>
                  <option value="Savings">💰 General Savings</option>
                  <option value="Other">🏷️ Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Target Date</label>
                <input type="date" [(ngModel)]="newGoal.targetDate" name="targetDate">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Target Amount</label>
                <input type="number" [(ngModel)]="newGoal.targetAmount" name="targetAmount" placeholder="0.00" required>
              </div>
              <div class="form-group">
                <label>Current Status</label>
                <input type="number" [(ngModel)]="newGoal.currentAmount" name="currentAmount" placeholder="0.00">
              </div>
            </div>

            <!-- New Monthly Allocation Section -->
            <div class="form-group" style="margin-top: 20px;">
              <label class="allocation-label">Monthly Allocation (%)</label>
              <div class="allocation-control">
                <input type="range" [(ngModel)]="newGoal.monthlyAllocationPercentage" name="allocation" min="0" max="100" step="1" class="allocation-slider">
                <span class="percentage-display">{{ newGoal.monthlyAllocationPercentage }}%</span>
              </div>
              @if (profile()) {
                <p class="allocation-calc">
                  ≈ {{ (newGoal.monthlyAllocationPercentage || 0) / 100 * (profile()?.income || 0) | currency:'INR':'symbol-narrow' }} from your monthly income
                </p>
              }
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Save Changes' : 'Create Goal' }}</button>
            </div>
          </form>
        </div>
      </div>
    }

    <style>
    /* Savings Specific Styles */
    .page-header { margin-bottom: 40px; }
    .subtitle { color: var(--text-secondary); margin-top: 4px; }
    .accent { color: var(--accent-emerald); }

    /* Progress Indicators */
    .progress-container { width: 100%; margin-top: 20px; }
    .progress-bar { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; overflow: hidden; }
    .fill { height: 100%; border-radius: 10px; background: linear-gradient(to right, var(--accent-emerald), var(--accent-violet)); }
    .progress-stats { display: flex; justify-content: space-between; margin-top: 12px; font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }
    
    .item-actions { display: flex; gap: 8px; align-self: flex-start; }
    .btn-icon { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 8px; padding: 6px; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-icon:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
    .edit-btn:hover { border-color: var(--accent-emerald); color: var(--accent-emerald); }
    .delete-btn:hover { border-color: var(--accent-rose); color: var(--accent-rose); }

    /* Savings Goals List */
    .savings-goals-section { margin-top: 56px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .goals-list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    
    .goal-item-card { padding: 28px; display: flex; flex-direction: column; }
    .goal-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .goal-top-info h4 { margin: 0; font-size: 1.15rem; font-weight: 600; color: var(--text-primary); }
    .goal-target { display: block; font-size: 1.4rem; font-weight: 700; color: var(--accent-emerald); margin-top: 6px; }

    /* Category Badges */
    .category-info { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .category-icon { font-size: 1.3rem; }
    .category-badge { font-size: 0.7rem; background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 20px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border: 1px solid rgba(255,255,255,0.05); }

    /* Goal Deadlines */
    .goal-footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); }
    .deadline { display: flex; align-items: center; gap: 6px; }
    .days-left { font-weight: 600; }
    .days-left.urgent { color: var(--accent-rose); background: rgba(244, 63, 94, 0.1); padding: 2px 8px; border-radius: 6px; }

    /* Allocation Slider Styles */
    .allocation-label { display: block; margin-bottom: 12px; font-weight: 600; color: var(--accent-emerald); }
    .allocation-control { display: flex; align-items: center; gap: 20px; background: rgba(0,0,0,0.2); padding: 12px 20px; border-radius: 12px; border: 1px solid var(--glass-border); }
    .allocation-slider { flex: 1; accent-color: var(--accent-emerald); cursor: pointer; }
    .percentage-display { font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald); min-width: 50px; }
    .allocation-calc { font-size: 0.8rem; margin-top: 8px; color: var(--text-secondary); padding-left: 4px; }
    
    .goal-allocation-badge { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 8px 12px; border-radius: 10px; margin-top: 16px; font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600; text-align: center; }

    /* Buttons */
    .btn { padding: 12px 24px; border-radius: 14px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
    .btn-primary { background: var(--accent-emerald); color: var(--bg-dark); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); }
    .btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3); }
    .btn-secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); border: 1px solid var(--glass-border); }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: fadeIn 0.3s ease; }
    .modal-content { width: 100%; max-width: 500px; padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .modal-header h3 { font-size: 1.5rem; margin: 0; }
    .modal-form { display: flex; flex-direction: column; gap: 24px; }
    .form-group { display: flex; flex-direction: column; gap: 10px; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--accent-emerald); text-transform: uppercase; letter-spacing: 1px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    
    input, .glass-select { width: 100%; padding: 14px 18px; background: rgba(255, 255, 255, 0.04); border: 1px solid var(--glass-border); border-radius: 14px; color: var(--text-primary); outline: none; transition: all 0.2s; font-family: inherit; }
    input:focus, .glass-select:focus { border-color: var(--accent-emerald); background: rgba(255, 255, 255, 0.08); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
    .glass-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 18px center; background-size: 18px; }
    .glass-select option { background: #121218; color: white; }
    
    .modal-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 12px; }
    
    .empty-goals { padding: 60px; text-align: center; border: 2px dashed var(--glass-border); border-radius: 24px; color: var(--text-secondary); grid-column: 1 / -1; }
    .empty-goals p { font-size: 1.1rem; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>

  `
})
export class SavingsComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly goalService = inject(SavingsGoalService);

  profile = signal<UserProfile | null>(null);
  savingsGoals = signal<SavingsGoal[]>([]);
  
  showGoalModal = false;
  isEditing = false;
  editingGoalId: number | null = null;

  newGoal: Partial<SavingsGoal> = {
    goalName: '',
    targetAmount: 0,
    currentAmount: 0,
    category: 'Vacation',
    targetDate: '',
    monthlyAllocationPercentage: 0
  };
  ngOnInit() {
    this.profileService.getProfile().subscribe(p => {
      if (p && !('error' in p)) {
        this.profile.set(p);
        this.loadGoals(p.username);
      }
    });
  }

  loadGoals(username: string) {
    this.goalService.getGoals(username).subscribe(goals => this.savingsGoals.set(goals));
  }

  openAddModal() {
    this.isEditing = false;
    this.editingGoalId = null;
    this.newGoal = { goalName: '', targetAmount: 0, currentAmount: 0, category: 'Vacation', targetDate: '', monthlyAllocationPercentage: 0 };
    this.showGoalModal = true;
  }

  openEditModal(goal: SavingsGoal) {
    this.isEditing = true;
    this.editingGoalId = goal.id || null;
    this.newGoal = {
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      category: goal.category,
      targetDate: goal.targetDate,
      monthlyAllocationPercentage: goal.monthlyAllocationPercentage || 0
    };
    this.showGoalModal = true;
  }

  closeModal() {
    this.showGoalModal = false;
    this.isEditing = false;
    this.editingGoalId = null;
  }

  saveGoal() {
    if (!this.profile()) return;
    
    // Ensure numeric values
    const targetAmount = Number(this.newGoal.targetAmount);
    const currentAmount = Number(this.newGoal.currentAmount || 0);

    const goal: SavingsGoal = {
      id: this.editingGoalId || undefined,
      goalName: this.newGoal.goalName!,
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      username: this.profile()!.username,
      category: this.newGoal.category,
      targetDate: this.newGoal.targetDate || undefined,
      monthlyAllocationPercentage: Number(this.newGoal.monthlyAllocationPercentage || 0)
    };

    const action = this.isEditing && this.editingGoalId 
      ? this.goalService.updateGoal(this.editingGoalId, goal)
      : this.goalService.addGoal(goal);

    action.subscribe({
      next: () => {
        alert(this.isEditing ? 'Goal updated successfully! ✨' : 'Goal created successfully! 🎯');
        this.loadGoals(this.profile()!.username);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving goal:', err);
        const errorMsg = err.error?.message || err.message || 'Server connection error';
        alert(`Failed to save goal: ${errorMsg}. Please ensure all fields are correct.`);
      }
    });
  }

  deleteGoal(id: number) {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      this.goalService.deleteGoal(id).subscribe(() => {
        this.loadGoals(this.profile()!.username);
      });
    }
  }

  getCategoryIcon(cat?: string): string {
    const icons: Record<string, string> = {
      'Vacation': '✈️',
      'Home': '🏠',
      'Car': '🚗',
      'Education': '🎓',
      'Emergency': '🏥',
      'Savings': '💰',
      'Other': '🏷️'
    };
    return icons[cat || ''] || '🎯';
  }

  getDaysRemaining(dateStr: string): number {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  isUrgent(dateStr: string): boolean {
    return this.getDaysRemaining(dateStr) < 30;
  }
}
