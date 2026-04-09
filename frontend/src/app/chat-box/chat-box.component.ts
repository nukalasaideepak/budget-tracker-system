import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FinanceAdviceService } from '../services/finance-advice.service';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
  userMessage = '';
  messages: { sender: 'user' | 'bot', text: string }[] = [
    { sender: 'bot', text: 'Hi! Need finance advice? Ask me anything about budgeting, saving, or spending.' }
  ];
  isOpen = false;

  constructor(private adviceService: FinanceAdviceService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    this.messages.push({ sender: 'user', text: this.userMessage });
    const advice = this.adviceService.getAdvice(this.userMessage);
    this.messages.push({ sender: 'bot', text: advice });
    this.userMessage = '';
  }
}
