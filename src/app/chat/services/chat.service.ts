import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from '../models/chat.model';
import { firstValueFrom, Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private chatRequest: Observable<{ id: string }> | null = null;
  private currentChatId: string | null = null;

  async createChat(): Promise<{ id: string }> {
    if (this.currentChatId) {
      return Promise.resolve({ id: this.currentChatId });
    }

    if (!this.chatRequest) {
      console.log('Creating new chat request');
      this.chatRequest = this.http.post<{ id: string }>(`${this.apiUrl}chats`, {})
        .pipe(
          shareReplay(1)
        );
    }

    try {
      const result = await firstValueFrom(this.chatRequest);
      this.currentChatId = result.id;
      return result;
    } catch (error) {
      this.chatRequest = null;
      throw error;
    }
  }

  async sendMessage(chatId: string, messageText: string): Promise<Message> {
    const officeId = localStorage.getItem('officeId') || '';

    return firstValueFrom(
      this.http.post<Message>(`${this.apiUrl}chats/${chatId}/messages`, {
        message: messageText,
        content: {
          source: 1,
          sourceId: officeId
        },
        senderType: 1
      })
    );
  }

  async getChatHistory(chatId: string): Promise<Message[]> {
    return firstValueFrom(
      this.http.get<Message[]>(`${this.apiUrl}chats/${chatId}`)
    );
  }
}
