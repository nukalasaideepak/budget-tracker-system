import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FinanceAdviceService {
  private advices: string[] = [
    'Track your expenses to understand your spending habits.',
    'Set a monthly budget and stick to it.',
    'Save at least 10% of your income every month.',
    'Avoid unnecessary debt and pay off credit cards quickly.',
    'Build an emergency fund covering 3-6 months of expenses.',
    'Invest early to take advantage of compound interest.',
    'Review your subscriptions and cancel unused ones.',
    'Plan for retirement as early as possible.'
  ];

  getAdvice(question: string): string {
    // Simple keyword-based suggestion
    const q = question.toLowerCase();
    if (q.includes('save')) return 'Try to save a fixed percentage of your income every month.';
    if (q.includes('budget')) return 'Create a realistic budget and review it regularly.';
    if (q.includes('debt')) return 'Pay off high-interest debts first and avoid new debts.';
    if (q.includes('invest')) return 'Start investing early, even with small amounts.';
    if (q.includes('emergency')) return 'Build an emergency fund for unexpected expenses.';
    // Default random advice
    return this.advices[Math.floor(Math.random() * this.advices.length)];
  }
}
