export interface AlertOptions {
  title?: string;
  text?: string;
  html?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  showConfirmButton?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
  buttonsStyling?: boolean;
  customClass?: {
    popup?: string;
    title?: string;
    htmlContainer?: string;
    confirmButton?: string;
  };
}