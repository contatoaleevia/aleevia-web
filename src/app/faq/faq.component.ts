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
import { AlertService } from '@app/shared/services/alert.service';
import { finalize, BehaviorSubject, Observable, map, switchMap, first } from 'rxjs';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, InputComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  private faqService = inject(FaqService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  faqs$: Observable<FAQ[]>;
  filteredFaqs$: Observable<FAQ[]>;

  statusOptions = [
    { id: 'Ativo', name: 'Ativo' },
    { id: 'Inativo', name: 'Inativo' }
  ];

  constructor() {
    this.faqs$ = this.faqService.faqs$;

    this.filteredFaqs$ = this.searchTerm$.pipe(
      switchMap(searchTerm =>
        this.faqs$.pipe(
          map(faqs => {
            if (!searchTerm) {
              return faqs;
            }
            return faqs.filter(faq =>
              faq.question.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
        )
      )
    );
  }

  openDeleteModal(faq: FAQ): void {
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
        this.loadingService.loadingOn();
        this.faqService.delete(faq.id).pipe(
          finalize(() => this.loadingService.loadingOff())
        ).subscribe({
          next: () => {
            this.alertService.success({
              title: 'FAQ excluída com sucesso'
            });
          },
          error: (error) => {
            console.error('Error deleting FAQ:', error);
            this.alertService.error({
              title: 'Não foi possível excluir a FAQ'
            });
          }
        });
      }
    );
  }

  onSearch(value: any): void {
    const searchTerm = typeof value === 'string' ? value :
      value.target && value.target.value ? value.target.value : '';
    this.searchTermSubject.next(searchTerm);
  }

  soon(): void {
    this.alertService.info({
      title: 'Em breve',
      text: 'Esta funcionalidade ainda não está disponível'
    });
  }

  preview(): void {
    this.router.navigate(['/chat']);
  }

  onEdit(id: string): void {
    this.filteredFaqs$.pipe(
      first(),
      map(faqs => faqs.find(faq => faq.id === id))
    ).subscribe(faq => {
      if (faq) {
        this.router.navigate(['/faq/edit', id], { state: { faq } });
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/faq/new']);
  }
}
