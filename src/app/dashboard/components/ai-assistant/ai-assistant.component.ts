import { Component, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChatComponent } from '@app/shared/components/base-chat/base-chat.component';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent extends BaseChatComponent implements AfterViewChecked {
  private readonly router = inject(Router);
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

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

  onExpand() {
    this.router.navigate(['/chat', this.chatId]);
  }
}
