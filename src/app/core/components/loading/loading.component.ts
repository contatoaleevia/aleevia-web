import { Component, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [NgIf, AsyncPipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
  
}
