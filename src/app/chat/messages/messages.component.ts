import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, Input, ElementRef, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { Message } from '../models/chat.model';

@Component({
  selector: 'app-messages',
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnChanges {
  @Input() messages: Message[] = [];
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages'] && !changes['messages'].firstChange) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 200);
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
}
