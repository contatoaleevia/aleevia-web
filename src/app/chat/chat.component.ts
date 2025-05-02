import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../shared/components/input/input.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { ChatHeaderComponent } from './header/header.component';
import { AuthService } from '../auth/services/auth.service';
import { FaqService } from '../shared/services/faq.service';
import { ChatService } from './services/chat.service';
import { Observable } from 'rxjs';
import { FAQ } from '../shared/models/faq.model';
import { Message } from './models/chat.model';
import { FaqComponent } from './faq/faq.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatInputComponent } from './chat-input/chat-input.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ChatHeaderComponent, FaqComponent, MessagesComponent, ChatInputComponent]
})
export class ChatComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly faqService = inject(FaqService);
  private readonly chatService = inject(ChatService);

  currentUser$ = this.authService.getCurrentUser();
  faqs$: Observable<FAQ[]> = new Observable<FAQ[]>();
  messages: Message[] = [];
  message: string = '';
  chatId: string = '';
  showWelcomeSection: boolean = true;

  constructor() {
    this.faqs$ = this.faqService.getAll();
  }

  ngOnInit() {
    this.createChat();
  }

  private async createChat() {
    try {
      const chatData = await this.chatService.createChat();
      this.chatId = chatData.id;
      await this.loadExistingMessages();
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  }

  private async loadExistingMessages() {
    if (this.chatId && this.messages.length === 0) {
      try {
        const messages = await this.chatService.getChatHistory(this.chatId);
        this.messages = messages.map(msg => ({
          ...msg,
          isPlaceholder: false
        }));
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    }
  }

  async sendMessage(content: string) {
    if (!content?.trim() || !this.chatId || this.messages.length === 0) return;
    if(this.showWelcomeSection) this.showWelcomeSection = false;

    const userMessage: Message = {
      content: content.trim(),
      role: 'user',
      chat_id: this.chatId,
      id: Date.now().toString(),
      sent_at: new Date().toISOString()
    };

    const placeholderMessage: Message = {
      content: 'Digitando...',
      role: 'assistant',
      chat_id: this.chatId,
      id: (Date.now() + 1).toString(),
      sent_at: new Date().toISOString(),
      isPlaceholder: true
    };

    this.messages.push(userMessage, placeholderMessage);
    this.message = '';

    try {
      const messageData = await this.chatService.sendMessage(this.chatId, content);
      
      this.messages = this.messages.map(msg => 
        msg.isPlaceholder ? {
          ...messageData,
          isPlaceholder: false
        } : msg
      );
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      this.messages = this.messages.map(msg =>
        msg.isPlaceholder ? {
          ...msg,
          content: 'Erro ao carregar a resposta.',
          isPlaceholder: false
        } : msg
      );
    }
  }
}
