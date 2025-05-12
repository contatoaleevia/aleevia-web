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
  private readonly officeId = localStorage.getItem('officeId') || '{}';
  private readonly loadingService = inject(LoadingService);

  form!: FormGroup;
  isEditing = false;
  loading = false;
  currentDate = new Date();

  classificationOptions = [
    { label: 'Geral', value: 'Geral' },
    { label: 'Especialidade', value: 'Especialidade' },
    { label: 'Sobre o profissional', value: 'Sobre o profissional' },
    { label: 'Sobre a clínica', value: 'Sobre a clínica' },
    { label: 'Orientações ao paciente', value: 'Orientações ao paciente' },
    { label: 'Outro', value: 'Outro' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadFaqData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      classification: ['', [Validators.required]],
      sourceId: [this.officeId]
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
            classification: faq.classification
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
      formData.created_at = new Date();
      formData.updated_at = new Date();
      const faq = localStorage.getItem('faq');

      if (faq && !this.isEditing) {
        const faqArray = JSON.parse(faq);
        faqArray.push(formData);
        localStorage.setItem('faq', JSON.stringify(faqArray));
      } else {
        localStorage.setItem('faq', JSON.stringify([formData]));
      }

      if (this.isEditing && faq) {
        const faqArray = JSON.parse(faq);
        const index = faqArray.findIndex((faq: any) => faq.id === id);
        faqArray[index] = formData;
        localStorage.setItem('faq', JSON.stringify(faqArray));
      }
      this.loadingService.loadingOff();
      this.loading = false;
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Pergunta salva com sucesso!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#22c55e',
        color: '#fff',
        iconColor: '#fff',
        customClass: {
          popup: 'swal2-toast-green'
        }
      }).then(() => {
        this.router.navigate(['/faq']);
      });

      // const request = this.isEditing
      //   ? this.faqService.update(id!, formData)
      //   : this.faqService.create(formData);

      // request.subscribe({
      //   next: () => {
      //     this.loading = false;
      //     this.faqService.refreshCache();
      //     this.router.navigate(['/faq']);
      //   },
      //   error: () => {
      //     this.loading = false;
      //   }
      // });
    }
  }

  preview(): void {
    this.router.navigate(['/chat']);
  }

  onCancel(): void {
    this.router.navigate(['/faq']);
  }
}
