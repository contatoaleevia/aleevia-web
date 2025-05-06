import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  routeData$: Observable<{ title: string; subtitle: string }>;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.routeData$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let currentRoute = this.route.firstChild;
        while (currentRoute?.firstChild) {
          currentRoute = currentRoute.firstChild;
        }
        return currentRoute?.snapshot.data || {};
      }),
      map(data => ({
        title: data['title'] || '',
        subtitle: data['subtitle'] || ''
      }))
    );
  }

  goBack() {
    window.history.back();
  }
}
