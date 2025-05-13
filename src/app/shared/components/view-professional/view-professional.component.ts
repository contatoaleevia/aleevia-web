import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Professional } from '@shared/components/form-professional/form-professional.component';
import { OfficeProfessional } from '@app/shared/models/office.model';
@Component({
  selector: 'app-view-professional',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-professional.component.html',
  styleUrl: './view-professional.component.scss'
})
export class ViewProfessionalComponent {
  @Input() professionals: OfficeProfessional[] = [];
  @Input() enableAddNew: boolean = true;
  @Input() addNewPath: string | null = null;
  @Input() actionText: string = 'Cadastrar';

  @Output() edit = new EventEmitter<OfficeProfessional>();
  @Output() delete = new EventEmitter<OfficeProfessional>();
  @Output() addNew = new EventEmitter<void>();

  onEdit(professional: OfficeProfessional): void {
    this.edit.emit(professional);
  }

  onDelete(professional: OfficeProfessional): void {
    this.delete.emit(professional);
  }

  onAddNew(): void {
    this.addNew.emit();
    console.log('onAddNew');
  }
}
