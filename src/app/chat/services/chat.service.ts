import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from '../models/chat.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async createChat(): Promise<{ id: string }> {
    return firstValueFrom(
      this.http.post<{ id: string }>(`${this.apiUrl}chats`, {})
    );
  }

  async sendMessage(chatId: string, messageText: string): Promise<Message> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id || '';

    return firstValueFrom(
      this.http.post<Message>(`${this.apiUrl}chats/${chatId}/messages`, {
        message: messageText,
        content: {
          source: 1,
          sourceId: userId
        },
        senderType: 2
      })
    );
  }

  async getChatHistory(chatId: string): Promise<Message[]> {
    return firstValueFrom(
      this.http.get<Message[]>(`${this.apiUrl}chats/${chatId}/messages`)
    );
  }
}
