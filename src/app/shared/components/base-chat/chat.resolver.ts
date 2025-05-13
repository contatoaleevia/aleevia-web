import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ChatService } from '@app/chat/services/chat.service';

@Injectable({ providedIn: 'root' })
export class ChatResolver implements Resolve<Observable<{ id: string }>> {
  constructor(private chatService: ChatService) {}

  resolve(): Observable<{ id: string }> {
    return this.chatService.createChat().pipe(
      map(chat => ({ id: chat.id }))
    );
  }
}

