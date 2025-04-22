import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FaqService } from '@shared/services/faq.service';

@Component({
  selector: 'app-faq-upsert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './faq-upsert.component.html',
  styleUrls: ['./faq-upsert.component.scss']
})
export class FaqUpsertComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private faqService = inject(FaqService);
  private currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

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
      doctor_id: [this.currentUser.id]
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
      const id = this.route.snapshot.paramMap.get('id');
      const formData = this.form.value;

      const request = this.isEditing
        ? this.faqService.update(id!, formData)
        : this.faqService.create(formData);

      request.subscribe({
        next: () => {
          this.loading = false;
          this.faqService.refreshCache();
          this.router.navigate(['/faq']);
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
