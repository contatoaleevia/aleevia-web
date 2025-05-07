import { NgIf, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-base',
  imports: [RouterModule, NgIf, AsyncPipe],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {
  routeData$: Observable<{ title: string; subtitle: string }>;

  constructor(private router: Router, private route: ActivatedRoute) {
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

  get isArrowVisible(): boolean {
    return this.router.url.includes('/register') || this.router.url.includes('/reset-password');
  }

  goBack() {
    window.history.back();
  }
}
