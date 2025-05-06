import { Component } from '@angular/core';
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
  serviceLocation = JSON.parse(localStorage.getItem('serviceLocation') || '{}');

  get formattedAddress(): string {
    const f = this.serviceLocation;
    let address = `${f.street}, ${f.number}`;
    if (f.complement) address += ` ${f.complement}`;
    address += ` - ${f.neighborhood}, ${f.city} - ${f.state}, ${f.zipCode}`;
    return address;
  }

  constructor(private router: Router) {}

  onAction() {
    this.router.navigate(['/auth/register/individual/service-professional/services']);
  }

  onEdit() {
    this.router.navigate(['/auth/register/individual/service-location/address']);
  }
}
