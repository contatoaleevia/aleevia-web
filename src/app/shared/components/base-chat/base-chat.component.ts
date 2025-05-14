import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '@app/chat/services/chat.service';
import { Message } from '@app/chat/models/chat.model';
import { SoundService } from '@app/core/services/sound.service';
import { Observable, Subscription, finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-base-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ''
})
export class BaseChatComponent implements OnInit {
  protected readonly chatService = inject(ChatService);
  protected readonly soundService = inject(SoundService);
  protected readonly route = inject(ActivatedRoute);

  @Input() chatId: string = '';

  messages$: Observable<Message[]> = this.chatService.messages$;
  message: string = '';
  loading: boolean = false;
  messagesChanged: boolean = false;
  private messagesSub?: Subscription;

  ngOnInit() {
    if (this.chatId) {
      this.loadExistingMessages();
    }
  }

  ngOnDestroy() {
    this.messagesSub?.unsubscribe();
  }

  protected loadExistingMessages() {
    if (this.chatId) {
      this.chatService.getChatHistory(this.chatId).subscribe({
        next: (messages) => {
          if ((!messages || messages.length === 0)) {
            const welcomeMsg: Message = {
              content: { source: 'assistant', sourceId: 'system' },
              role: 'assistant',
              message: 'Olá! Sou sua assistente virtual. Como posso ajudar com sua clínica hoje?',
              chat_id: this.chatId,
              id: '1',
              sent_at: new Date().toISOString()
            };
            this.chatService.messagesSubject.next([welcomeMsg]);
          }
          this.soundService.playMessageSound();
        },
        error: () => {
          if (!this.route.snapshot.params['id']) {
            const fallbackMsg: Message = {
              content: { source: 'assistant', sourceId: 'system' },
              role: 'assistant',
              message: 'Não foi possível carregar a conversa. Tente novamente mais tarde.',
              chat_id: this.chatId,
              id: '1',
              sent_at: new Date().toISOString()
            };
            this.chatService.messagesSubject.next([fallbackMsg]);
          }
        }
      });
    }
  }

  sendMessage(content?: string) {
    const messageContent = content || this.message;
    if (!messageContent?.trim() || !this.chatId) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id || 'local-user';

    const userMessage: Message = {
      content: { source: 'user', sourceId: userId },
      message: messageContent.trim(),
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

    const current = this.chatService.messagesSubject.getValue();
    this.chatService.messagesSubject.next([...current, userMessage, placeholderMessage]);
    this.messagesChanged = true;
    this.message = '';
    this.loading = true;

    this.chatService.sendMessage(this.chatId, messageContent).pipe(
      finalize(() => {
        this.loading = false;
        this.soundService.playMessageSound();
      })
    ).subscribe({
      next: (messageData) => {
        const updated = this.chatService.messagesSubject.getValue().map(msg =>
          msg.isPlaceholder ? { ...messageData, isPlaceholder: false } : msg
        );
        this.chatService.messagesSubject.next(updated);
        this.messagesChanged = true;
      },
      error: (error) => {
        console.error('Erro ao enviar mensagem:', error);
        const fallbackResponse: Message = {
          content: { source: 'assistant', sourceId: 'system' },
          message: 'Erro ao responder, tente novamente mais tarde.',
          role: 'assistant',
          chat_id: this.chatId,
          id: Date.now().toString(),
          sent_at: new Date().toISOString()
        };
        const updated = this.chatService.messagesSubject.getValue().map(msg =>
          msg.isPlaceholder ? fallbackResponse : msg
        );
        this.chatService.messagesSubject.next(updated);
        this.messagesChanged = true;
      }
    });
  }
}
