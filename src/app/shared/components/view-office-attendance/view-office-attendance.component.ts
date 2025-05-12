import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfficeAttendance } from '@shared/models/office-attendance.model';

@Component({
  selector: 'app-view-office-attendance',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  templateUrl: './view-office-attendance.component.html',
  styleUrl: './view-office-attendance.component.scss'
})
export class ViewOfficeAttendanceComponent {
  @Input() attendances: OfficeAttendance[] = [];
  @Input() enableAddNew: boolean = true;
  @Input() addNewPath: string | null = null;
  @Input() actionText: string = 'Cadastrar';

  @Output() edit = new EventEmitter<OfficeAttendance>();
  @Output() delete = new EventEmitter<OfficeAttendance>();
  @Output() addNew = new EventEmitter<void>();

  onAddNew(): void {
    this.addNew.emit();
  }

  onEdit(attendance: OfficeAttendance): void {
    this.edit.emit(attendance);
  }

  onDelete(attendance: OfficeAttendance): void {
    this.delete.emit(attendance);
  }
}
