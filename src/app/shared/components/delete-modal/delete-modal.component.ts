import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface DeleteModalConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showPreview?: boolean;
  previewTitle?: string;
  previewContent?: any;
  customContent?: string;
}

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  @Input() config: DeleteModalConfig = {
    title: 'Confirmar exclusão',
    message: 'Deseja excluir este item?',
    confirmText: 'Sim',
    cancelText: 'Não',
    showPreview: false
  };

  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = true;

  private activeModal = inject(NgbActiveModal);

  ngOnInit(): void {
    console.log('Modal config:', this.config);
  }

  onConfirm(): void {
    this.activeModal.close();
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
