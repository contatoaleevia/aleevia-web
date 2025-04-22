import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from '../models/chat.model';

@Component({
  selector: 'app-messages',
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  @Input() messages: Message[] = [];
}
