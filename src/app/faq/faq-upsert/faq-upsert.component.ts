import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FaqService } from '@shared/services/faq.service';
import { LoadingService } from '@core/services/loading.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-faq-upsert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './faq-upsert.component.html',
  styleUrls: ['./faq-upsert.component.scss']
})
export class FaqUpsertComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly faqService = inject(FaqService);
  private readonly currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  private readonly loadingService = inject(LoadingService);

  form!: FormGroup;
  isEditing = false;
  loading = false;
  currentDate = new Date();

  classificationOptions = [
    { label: 'Orientações ao cliente', value: 0 },
    { label: 'Sobre o profissional', value: 1 },
    { label: 'Sobre a clínica', value: 2 },
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadFaqData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      faqCategory: ['', [Validators.required]],
      sourceId: [this.currentUser.id],
      sourceType: [0]
    });
  }

  private loadFaqData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loading = true;
      this.faqService.getById(id).subscribe({
        next: (faq) => {
          this.form.patchValue({
            question: faq.question,
            answer: faq.answer,
            faqCategory: faq.faqCategory
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/faq']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.loadingService.loadingOn();
      const id = this.route.snapshot.paramMap.get('id');
      const formData = this.form.value;
      // const faq = localStorage.getItem('faq');

      // if (faq && !this.isEditing) {
      //   const faqArray = JSON.parse(faq);
      //   faqArray.push(formData);
      //   localStorage.setItem('faq', JSON.stringify(faqArray));
      // } else {
      //   localStorage.setItem('faq', JSON.stringify([formData]));
      // }

      // if (this.isEditing && faq) {
      //   const faqArray = JSON.parse(faq);
      //   const index = faqArray.findIndex((faq: any) => faq.id === id);
      //   faqArray[index] = formData;
      //   localStorage.setItem('faq', JSON.stringify(faqArray));
      // }
      // this.loadingService.loadingOff();
      // this.loading = false;
      // Swal.fire({
      //   toast: true,
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'Pergunta salva com sucesso!',
      //   showConfirmButton: false,
      //   timer: 2000,
      //   timerProgressBar: true,
      //   background: '#22c55e',
      //   color: '#fff',
      //   iconColor: '#fff',
      //   customClass: {
      //     popup: 'swal2-toast-green'
      //   }
      // }).then(() => {
      //   this.router.navigate(['/faq']);
      // });
      const request = this.isEditing
        ? this.faqService.update(id!, formData)
        : this.faqService.create(formData);

      request.subscribe({
        next: () => {
          this.loading = false;
          this.faqService.refreshCache();
          this.router.navigate(['/faq']);
          this.loadingService.loadingOff();
        },
        error: () => {
          this.loading = false;
          this.loadingService.loadingOff();
        }
      });
    }
  }

  preview(): void {
    this.router.navigate(['/chat']);
  }

  onCancel(): void {
    this.router.navigate(['/faq']);
  }
}
