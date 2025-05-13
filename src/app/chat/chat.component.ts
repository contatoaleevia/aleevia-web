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
import { BaseChatComponent } from '@app/shared/components/base-chat/base-chat.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ChatHeaderComponent, FaqComponent, MessagesComponent, ChatInputComponent]
})
export class ChatComponent extends BaseChatComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly faqService = inject(FaqService);
  private readonly route = inject(ActivatedRoute);

  currentUser$ = this.authService.getCurrentUser();
  faqs$: Observable<FAQ[]> = new Observable<FAQ[]>();
  showWelcomeSection: boolean = this.route.snapshot.params['id'];

  constructor() {
    super();
    this.faqs$ = new Observable<FAQ[]>();
  }

  override ngOnInit() {
    this.chatId = this.chatService.chatIdSubject.getValue() || '';
    if (this.chatId) {
      this.loadExistingMessages();
    }
    if (this.showWelcomeSection) {
      this.loadSuggestedQuestions();
    }
  }

  private async loadSuggestedQuestions() {
    this.faqs$ = this.faqService.getAll();
  }
}
