import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertOptions } from '@app/shared/models/alert-options.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly defaultToastOptions = {
    toast: true,
    position: 'top-end' as const,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    color: '#fff',
    iconColor: '#fff'
  };

  private readonly defaultSuccessOptions = {
    background: '#22c55e',
    customClass: {
      popup: 'swal2-toast-green'
    }
  };

  private readonly defaultErrorOptions = {
    background: '#ef4444',
    customClass: {
      popup: 'swal2-toast-red'
    }
  };

  private readonly defaultInfoOptions = {
    background: '#3b82f6',
    customClass: {
      popup: 'swal2-toast-blue'
    }
  };

  success(options: AlertOptions = {}) {
    return Swal.fire({
      ...this.defaultToastOptions,
      ...this.defaultSuccessOptions,
      icon: 'success',
      ...options
    });
  }

  error(options: AlertOptions = {}) {
    return Swal.fire({
      ...this.defaultToastOptions,
      ...this.defaultErrorOptions,
      icon: 'error',
      ...options
    });
  }

  info(options: AlertOptions = {}) {
    return Swal.fire({
      ...this.defaultToastOptions,
      ...this.defaultInfoOptions,
      icon: 'info',
      ...options
    });
  }

  warning(options: AlertOptions = {}) {
    return Swal.fire({
      ...this.defaultToastOptions,
      ...this.defaultInfoOptions,
      icon: 'warning',
      ...options
    });
  }

  custom(options: AlertOptions) {
    return Swal.fire(options);
  }

  successToast(title: string) {
    return this.success({ title });
  }

  errorToast(title: string) {
    return this.error({ title });
  }

  infoToast(title: string, text?: string) {
    return this.info({ title, text });
  }

  comingSoon() {
    return this.info({
      title: 'Em breve!',
      text: 'Esta funcionalidade estará disponível em breve.'
    });
  }

  confirmDelete(title: string, message: string) {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-4',
        title: 'fw-bold fs-2',
        htmlContainer: 'text-secondary fs-5',
        confirmButton: 'btn btn-danger btn-lg',
        cancelButton: 'btn btn-secondary btn-lg'
      },
      buttonsStyling: false
    });
  }

  passwordResetInstructions(email: string) {
    return Swal.fire({
      title: 'Instruções enviadas',
      html: `Enviamos as instruções de mudança de senha para o email ${this.formatEmail(email)}. Verifique sua caixa de spam`,
      confirmButtonText: 'Continuar',
      customClass: {
        popup: 'rounded-4',
        title: 'fw-bold fs-2',
        htmlContainer: 'text-secondary fs-5',
        confirmButton: 'btn btn-primary btn-lg w-100 mt-4'
      },
      buttonsStyling: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  private formatEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = '*'.repeat(username.length);
    return `${maskedUsername}@${domain}`;
  }
}
