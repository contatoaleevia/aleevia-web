import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'text' | 'pill';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'default' | 'pill' | 'outline';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() type: ButtonType = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() variant: ButtonVariant = 'default';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() ariaLabel: string = '';
  @Input() isNext: boolean = false;
  @Input() isPrevious: boolean = false;
  @Input() customClasses: string = '';
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes = [
      'btn',
      `btn-${this.type}`,
      `btn-${this.size}`,
      this.variant === 'pill' ? 'btn-pill' : '',
      this.variant === 'outline' ? 'btn-outline' : '',
      this.fullWidth ? 'w-100' : '',
      this.isNext ? 'next-button' : '',
      this.isPrevious ? 'previous-button' : '',
      this.customClasses
    ].filter(Boolean).join(' ');
    
    return classes;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
