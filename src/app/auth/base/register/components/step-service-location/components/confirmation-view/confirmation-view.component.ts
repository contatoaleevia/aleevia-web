import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
@Component({
  selector: 'app-confirmation-view',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './confirmation-view.component.html',
  styleUrl: './confirmation-view.component.scss'
})
export class ConfirmationViewComponent {
  private readonly router = inject(Router);
  serviceLocation = JSON.parse(localStorage.getItem('serviceLocation') || '{}');

  get formattedAddress(): string {
    const f = this.serviceLocation;
    let address = `${f.street}, ${f.number}`;
    if (f.complement) address += ` ${f.complement}`;
    address += ` - ${f.neighborhood}, ${f.city} - ${f.state}, ${f.zipCode}`;
    return address;
  }

  onAction() {
    this.router.navigate([`/auth/register/step/service-professional/services`]);
  }

  onEdit() {
    this.router.navigate([`/auth/register/step/service-location/address`]);
  }
}
