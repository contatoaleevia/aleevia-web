import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  navigateTo(route: string) {
    this.router.navigate([route], { relativeTo: this.route });
  }
}
