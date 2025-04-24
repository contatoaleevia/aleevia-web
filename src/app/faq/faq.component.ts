import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FaqService } from '@shared/services/faq.service';
import { FAQ } from '@shared/models/faq.model';
import { DeleteModalComponent } from '../shared/components/delete-modal/delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalConfig } from '../shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  private faqService = inject(FaqService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  
  faqs: FAQ[] = [];
  selectedFaq?: FAQ;

  ngOnInit(): void {  
    this.loadFaqs();
  }

  private loadFaqs(): void {
    this.faqService.getAll().subscribe(faqs => {
      this.faqs = faqs;
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
        answer: faq.answer
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
          this.faqService.delete(this.selectedFaq.id).subscribe(() => {
            this.loadFaqs();
          });
        }
      },
      () => {
        this.selectedFaq = undefined;
      }
    );
  }

  onEdit(id: string): void {
    this.router.navigate(['/faq/edit', id]);
  }

  onAdd(): void {
    this.router.navigate(['/faq/new']);
  }
}
