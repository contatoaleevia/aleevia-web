import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputComponent, ButtonComponent, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  context: 'services' | 'professionals' = 'services';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const url = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(Boolean)
      .join('/');
    if (url.includes('add-professional')) {
      this.context = 'professionals';
    } else {
      this.context = 'services';
    }
  } 

  save() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: this.context === 'services' ? 'Serviço salvo com sucesso!' : 'Profissional salvo com sucesso!',
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

    if (this.context === 'services') {
      this.router.navigate(['/auth/register/individual/service-professional/services']);
    } else {
      this.router.navigate(['/auth/register/individual/service-professional/professionals']);
    }
  }
}
