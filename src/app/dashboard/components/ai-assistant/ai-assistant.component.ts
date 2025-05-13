import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../chat/services/chat.service';
import { Message } from '../../../chat/models/chat.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent implements OnInit, AfterViewChecked {
  private readonly chatService = inject(ChatService);
  private readonly router = inject(Router);
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
      this.chatId = 'local-' + Date.now().toString();
      this.loadInitialMessage();
    }
  }

  getChatHistory() {
    this.chatService.getChatHistory(this.chatId).then((messages) => {
      this.messages = messages;
    });
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

  private async loadInitialMessage() {
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
              role: 'assistant',
              message: 'Olá! Sou sua assistente virtual. Como posso ajudar com sua clínica hoje?',
              chat_id: this.chatId,
              id: '1',
              sent_at: new Date().toISOString()
            }
          ];
        }
        this.messagesChanged = true;
      } catch (error) {
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
  }

  async sendMessage() {
    if (!this.message?.trim()) return;

    if (!this.chatId) {
      try {
        const chatData = await this.chatService.createChat();
        this.chatId = chatData.id;
      } catch (error) {
        console.error('Erro ao criar chat:', error);
        this.chatId = 'local-' + Date.now().toString();
      }
    }

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

  onExpand() {
    this.router.navigate(['/chat', this.chatId]);
  }
}
