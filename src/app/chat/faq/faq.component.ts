import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FAQ } from '@shared/models/faq.model';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-faq',
  imports: [NgFor],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  @Input() faqs: FAQ[] = [];
  @Output() questionClick = new EventEmitter<string>();

  onQuestionClick(question: string): void {
    this.questionClick.emit(question);
  }
}
