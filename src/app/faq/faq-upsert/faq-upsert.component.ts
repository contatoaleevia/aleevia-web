import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FaqService } from '@shared/services/faq.service';
import { LoadingService } from '@core/services/loading.service';
import { ProfessionalService } from '@shared/services/professional.service';
import { RegistrationContextService } from '@app/auth/base/register/registration-context.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';
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
  private readonly loadingService = inject(LoadingService);
  private readonly officeId = localStorage.getItem('officeId') || '{}';
  private readonly registrationContext = inject(RegistrationContextService);

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
      sourceId: [this.officeId],
      sourceType: [1]
    });
  }

  private loadFaqData(): void {
    const faq = history.state.faq;
    if (faq) {
      this.isEditing = true;
      this.form.patchValue({
        question: faq.question,
        answer: faq.answer,
        faqCategory: faq.faqCategory.categoryType
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.loadingService.loadingOn();
      const id = this.route.snapshot.paramMap.get('id');
      const formData = this.form.value;

      const request = this.isEditing
        ? this.faqService.update(id!, formData)
        : this.faqService.create(formData);

      request.pipe(finalize(() => this.loadingService.loadingOff())).subscribe({
        next: () => {
          this.loading = false;
          this.faqService.getAll().subscribe();
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
        },
        error: () => {
          this.loading = false;
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
