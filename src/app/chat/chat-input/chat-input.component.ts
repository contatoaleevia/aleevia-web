import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent as InputSharedComponent } from '@shared/components/input/input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [ButtonComponent, InputSharedComponent, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Input() message: string = '';
  @Output() sendMessage = new EventEmitter<string>();

  sendMessageHandler() {
    if (this.message.trim()) {
      this.sendMessage.emit(this.message);
      this.message = '';
    }
  }
}
