import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../chat/services/chat.service';
import { Message } from '../../../chat/models/chat.model';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent implements OnInit, AfterViewChecked {
  private readonly chatService = inject(ChatService);
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  message: string = '';
  chatId: string = '';
  loading: boolean = false;
  messagesChanged: boolean = false;

  ngOnInit() {
    this.createChat();
  }

  ngAfterViewChecked() {
    if (this.messagesChanged) {
      this.scrollToBottom();
      this.messagesChanged = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch(err) {
      console.error('Erro ao rolar para o final:', err);
    }
  }

  private async createChat() {
    try {
      const chatData = await this.chatService.createChat();
      this.chatId = chatData.id;
      await this.loadInitialMessage();
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      // Fallback to create a mock chat if the API fails
      this.chatId = 'local-' + Date.now().toString();
      this.loadInitialMessage();
    }
  }

  private async loadInitialMessage() {
    if (this.chatId && this.messages.length === 0) {
      this.messages = [
        {
          content: { source: 'assistant', sourceId: 'system' },
          role: 'assistant',
          message: 'Olá! Sou sua assistente virtual. Como posso ajudar com sua clínica hoje?',
          chat_id: this.chatId,
          id: '1',
          sent_at: new Date().toISOString()
        }
      ];
      this.messagesChanged = true;
    }
  }

  async sendMessage() {
    if (!this.message?.trim() || !this.chatId) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id || 'local-user';

    const userMessage: Message = {
      content: { source: 'user', sourceId: userId },
      message: this.message.trim(),
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
    this.messagesChanged = true;
    const messageToSend = this.message;
    this.message = '';
    this.loading = true;

    try {
      const messageData = await this.chatService.sendMessage(this.chatId, messageToSend);

      this.messages = this.messages.map(msg =>
        msg.isPlaceholder ? {
          ...messageData,
          isPlaceholder: false
        } : msg
      );
      this.messagesChanged = true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);

      const fallbackResponse: Message = {
        content: { source: 'assistant', sourceId: 'system' },
        message: 'Erro ao responder, tente novamente mais tarde.',
        role: 'assistant',
        chat_id: this.chatId,
        id: Date.now().toString(),
        sent_at: new Date().toISOString()
      };

      this.messages = this.messages.map(msg =>
        msg.isPlaceholder ? fallbackResponse : msg
      );
      this.messagesChanged = true;
    } finally {
      this.loading = false;
    }
  }
}
