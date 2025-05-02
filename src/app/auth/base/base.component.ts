import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-base',
  imports: [RouterModule],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {
  constructor(private router: Router) {}

  get isRegisterRoute(): boolean {
    return this.router.url.includes('/register');
  }

  goBack() {
    this.router.navigate(['/auth/welcome']);
  }
}
