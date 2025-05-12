import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Professional } from '@shared/components/form-professional/form-professional.component';

@Component({
  selector: 'app-view-professional',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-professional.component.html',
  styleUrl: './view-professional.component.scss'
})
export class ViewProfessionalComponent {
  @Input() professionals: Professional[] = [];
  @Input() enableAddNew: boolean = true;
  @Input() addNewPath: string | null = null;
  @Input() addNewText: string = 'profissional';

  @Output() edit = new EventEmitter<Professional>();
  @Output() delete = new EventEmitter<Professional>();

  onEdit(professional: Professional): void {
    this.edit.emit(professional);
  }

  onDelete(professional: Professional): void {
    this.delete.emit(professional);
  }
}
