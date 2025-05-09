import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  template: `
    <router-outlet></router-outlet>
    <app-loading></app-loading>
  `
})
export class AppComponent {
  title = 'aleevia-web';
}
