import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormComponent } from '@app/shared/components/form/form.component';
import { OfficeService } from '@app/shared/services/office.service';
import { Office } from '@app/shared/models/office.model';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './social-media.component.html',
  styleUrl: './social-media.component.scss'
})
export class SocialMediaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly officeService = inject(OfficeService);
  private readonly loadingService = inject(LoadingService);

  form: FormGroup = this.fb.group({
    site: [''],
    instagram: [''],
    youtube: [''],
    facebook: ['']
  });

  office: Office | null = null;
  officeId: string = '';

  ngOnInit(): void {
    this.officeId = localStorage.getItem('officeId') || '';
    if (this.officeId) {
      this.loadOfficeData();
    }
  }

  loadOfficeData(): void {
    this.loadingService.loadingOn();
    this.officeService.getOfficeById(this.officeId).pipe(
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: (office) => {
        this.office = office;
        if (office) {
          this.form.patchValue({
            site: office.site || '',
            instagram: office.instagram || '',
            youtube: '',
            facebook: ''
          });
        }
      },
      error: (error) => {
        console.error('Error loading office data:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Mostrar Swal de funcionalidade em desenvolvimento
      Swal.fire({
        title: 'Funcionalidade em desenvolvimento',
        icon: 'info',
        showConfirmButton: true,
      });

      // Código anterior comentado para preservação
      /*
      this.loadingService.loadingOn();

      // Preservamos todos os dados do office original e só atualizamos as propriedades que nos importam
      const socialMediaData: Partial<Office> = {
        ...this.office,
        site: this.form.value.site,
        instagram: this.form.value.instagram
        // youtube e facebook não fazem parte do modelo Office
      };

      this.officeService.createOffice(socialMediaData as Office).pipe(
        finalize(() => this.loadingService.loadingOff())
      ).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Redes sociais salvas com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: '#22c55e',
            color: '#fff',
            iconColor: '#fff',
            customClass: {
              popup: 'swal2-toast-green'
            }
          });
        },
        error: (error) => {
          console.error('Error saving social media:', error);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Erro ao salvar redes sociais',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: '#ef4444',
            color: '#fff',
            iconColor: '#fff',
            customClass: {
              popup: 'swal2-toast-red'
            }
          });
        }
      });
      */
    }
  }
}
