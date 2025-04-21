import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@app/shared/models/user.model';

@Component({
  selector: 'app-chat-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatHeaderComponent {
  @Input() currentUser: User = {} as User;
}
