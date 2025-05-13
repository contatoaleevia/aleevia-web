import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FaqService } from '@shared/services/faq.service';
import { FAQ } from '@shared/models/faq.model';
import { DeleteModalComponent } from '../shared/components/delete-modal/delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalConfig } from '../shared/components/delete-modal/delete-modal.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { InputComponent } from '../shared/components/input/input.component';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';
import { LoadingService } from '@app/core/services/loading.service';
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, InputComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  private faqService = inject(FaqService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private loadingService = inject(LoadingService);


  faqs: FAQ[] = [];
  selectedFaq?: FAQ;
  statusOptions = [
    { id: 'Ativo', name: 'Ativo' },
    { id: 'Inativo', name: 'Inativo' }
  ];
  filteredFaqs: FAQ[] = [];

  ngOnInit(): void {
    const faq = localStorage.getItem('faq');
    if (faq) {
      this.faqs = JSON.parse(faq);
      this.filteredFaqs = this.faqs;
    } else {
      this.loadFaqs();
    }
  }

  private loadFaqs(): void {
    this.loadingService.loadingOn();
    this.faqService.getAll().pipe(
      finalize(() => this.loadingService.loadingOff()),
    ).subscribe(faqs => {
      this.faqs = faqs;
      this.filteredFaqs = this.faqs;
    });
  }

  openDeleteModal(faq: FAQ): void {
    this.selectedFaq = faq;

    const modalConfig: DeleteModalConfig = {
      title: 'Excluir FAQ',
      message: 'Deseja excluir esta pergunta?',
      showPreview: true,
      previewTitle: 'Conteúdo a ser excluído',
      previewContent: {
        question: faq.question,
        answer: faq.answer,
        faqCategory: faq.faqCategory
      },
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    };

    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.config = modalConfig;

    modalRef.result.then(
      () => {
        if (this.selectedFaq) {
          this.loadingService.loadingOn();
          this.faqService.delete(this.selectedFaq.id).pipe(
            finalize(() => this.loadingService.loadingOff())
          ).subscribe({
            next: () => {
              this.faqs = this.faqs.filter(f => f.id !== this.selectedFaq?.id);
              this.filteredFaqs = this.filteredFaqs.filter(f => f.id !== this.selectedFaq?.id);

              Swal.fire({
                toast: true,
                position: 'top-right',
                title: 'Sucesso',
                text: 'FAQ excluída com sucesso',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#22c55e',
                color: '#fff',
                timerProgressBar: true,
                iconColor: '#fff',
                customClass: {
                  popup: 'swal2-toast-green'
                }
              });
            },
            error: (error) => {
              console.error('Error deleting FAQ:', error);
              Swal.fire({
                title: 'Erro',
                text: 'Não foi possível excluir a FAQ',
                icon: 'error'
              });
            }
          });
        }
      },
      () => {
        this.selectedFaq = undefined;
      }
    );
  }

  onSearch(value: any): void {
    const searchTerm = typeof value === 'string' ? value :
      value.target && value.target.value ? value.target.value : '';

    if (!searchTerm.trim()) {
      this.filteredFaqs = [...this.faqs];
      return;
    }

    this.filteredFaqs = this.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  soon(): void {
    Swal.fire({
      title: 'Em breve',
      text: 'Esta funcionalidade ainda não está disponível',
      icon: 'info'
    });
  }


  preview(): void {
    console.log('preview');
    this.router.navigate(['/chat']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/faq/edit', id]);
  }

  onAdd(): void {
    this.router.navigate(['/faq/new']);
  }
}
