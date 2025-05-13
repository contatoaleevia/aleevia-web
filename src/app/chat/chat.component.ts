import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatHeaderComponent } from './header/header.component';
import { AuthService } from '../auth/services/auth.service';
import { ChatService } from './services/chat.service';
import { Observable } from 'rxjs';
import { FAQ } from '@shared/models/faq.model';
import { Message } from './models/chat.model';
import { FaqComponent } from './faq/faq.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ActivatedRoute } from '@angular/router';
import { FaqService } from '@app/shared/services/faq.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ChatHeaderComponent, FaqComponent, MessagesComponent, ChatInputComponent]
})
export class ChatComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly faqService = inject(FaqService);

  currentUser$ = this.authService.getCurrentUser();
  faqs$: Observable<FAQ[]> = new Observable<FAQ[]>();
  messages: Message[] = [];
  message: string = '';
  chatId: string = '';
  showWelcomeSection: boolean = true;

  constructor() {
    this.faqs$ = new Observable<FAQ[]>();
  }

  ngOnInit() {
    if(this.route.snapshot.params['id']) {
      this.chatId = this.route.snapshot.params['id'];
      this.loadExistingMessages();
      this.loadSuggestedQuestions();
    } else {
      this.createChat();
    }
  }

  private async loadSuggestedQuestions() {
    this.faqs$ = this.faqService.getAll();
    console.log('faqs 1', this.faqs$);
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

  private adaptMessages(rawMessages: any[]): Message[] {
    return rawMessages.map((msg: any) => {
      const isAssistant = msg.senderType === 'IA';
      return {
        chat_id: msg.iaChatId || msg.chat_id || '',
        id: msg.id,
        message: msg.message,
        role: isAssistant ? 'assistant' : 'user',
        sent_at: msg.createdAt || msg.sent_at || new Date().toISOString(),
        content: isAssistant
          ? { source: 'assistant', sourceId: 'system' }
          : { source: 'user', sourceId: 'user' }
      };
    });
  }

  private async loadExistingMessages() {
    if (this.chatId && this.messages.length === 0) {
      try {
        const rawMessages = await this.chatService.getChatHistory(this.chatId);
        const messages = this.adaptMessages(rawMessages);
        if (messages && messages.length > 0) {
          this.messages = messages;
        } else {
          this.messages = [
            {
              content: { source: 'assistant', sourceId: 'system' },
              role: 'assistant' as 'assistant',
              message: 'Olá, como posso te ajudar?',
              chat_id: this.chatId,
              id: '1',
              sent_at: new Date().toISOString()
            }
          ].map(msg => ({ ...msg, isPlaceholder: false }));
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    }
  }

  async sendMessage(content: string) {
    if (!content?.trim() || !this.chatId || this.messages.length === 0) return;
    if(this.showWelcomeSection) this.showWelcomeSection = false;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id || '';

    const userMessage: Message = {
      content: { source: 'user', sourceId: userId },
      message: content.trim(),
      role: 'user',
      chat_id: this.chatId,
      id: Date.now().toString(),
      sent_at: new Date().toISOString()
    };

    const placeholderMessage: Message = {
      message: 'Digitando...',
      content: { source: 'assistant', sourceId: 'system' },
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
