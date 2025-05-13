import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from '../models/chat.model';
import { BehaviorSubject, Observable, of, shareReplay, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public chatIdSubject = new BehaviorSubject<string | null>(null);
  chatId$ = this.chatIdSubject.asObservable();

  public messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private chatRequest$: Observable<{ id: string }> | null = null;

  createChat(): Observable<{ id: string }> {
    const cachedId = this.chatIdSubject.getValue();
    if (cachedId) {
      return of({ id: cachedId });
    }
    if (!this.chatRequest$) {
      this.chatRequest$ = this.http.post<{ id: string }>(`${this.apiUrl}chats`, {})
        .pipe(
          tap(result => {
            this.chatIdSubject.next(result.id);
          }),
          shareReplay(1)
        );
    }
    return this.chatRequest$;
  }

  sendMessage(chatId: string, messageText: string): Observable<Message> {
    const officeId = localStorage.getItem('officeId') || '';
    return this.http.post<Message>(`${this.apiUrl}chats/${chatId}/messages`, {
      message: messageText,
      content: {
        source: 1,
        sourceId: officeId
      },
      senderType: 1
    }).pipe(
      map(msg => this.adaptMessages([msg])[0]),
      tap((msg: Message) => {
        const current = this.messagesSubject.getValue();
        this.messagesSubject.next([...current, msg]);
      })
    );
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

  getChatHistory(chatId: string): Observable<Message[]> {
    const cachedMessages = this.messagesSubject.getValue();
    if (cachedMessages.length > 0) {
      return of(cachedMessages);
    }
    return this.http.get<any[]>(`${this.apiUrl}chats/${chatId}`)
      .pipe(
        map(rawMessages => this.adaptMessages(rawMessages)),
        tap(messages => {
          this.messagesSubject.next(messages || []);
        }),
        map(messages => messages || [])
      );
  }

  clearCache(): void {
    this.chatIdSubject.next(null);
    this.messagesSubject.next([]);
    this.chatRequest$ = null;
  }
}
