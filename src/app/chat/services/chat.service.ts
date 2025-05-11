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

  async sendMessage(chatId: string, content: string): Promise<Message> {
    return firstValueFrom(
      this.http.post<Message>(`${this.apiUrl}chats/${chatId}/messages`, { message: content, content: content, senderType: 2 })
    );
  }

  async getChatHistory(chatId: string): Promise<Message[]> {
    return firstValueFrom(
      this.http.get<Message[]>(`${this.apiUrl}chats/${chatId}/messages`)
    );
  }
}