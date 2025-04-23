import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FaqService } from '@shared/services/faq.service';
import { FAQ } from '@shared/models/faq.model';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, DeleteModalComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  private faqService = inject(FaqService);
  private router = inject(Router);
  
  faqs: FAQ[] = [];
  showDeleteModal = false;
  selectedFaq: FAQ = {} as FAQ;

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
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedFaq = {} as FAQ;
  }

  confirmDelete(): void {
    if (this.selectedFaq) {
      this.faqService.delete(this.selectedFaq.id).subscribe(() => {
        this.closeDeleteModal();
      });
    }
  }

  onEdit(id: string): void {
    this.router.navigate(['/faq/edit', id]);
  }

  onAdd(): void {
    this.router.navigate(['/faq/new']);
  }
}
