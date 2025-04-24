import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = true;
  
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
