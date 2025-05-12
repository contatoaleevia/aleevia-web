import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
@Component({
  selector: 'app-congratulations',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './congratulations.component.html',
  styleUrl: './congratulations.component.scss'
})
export class CongratulationsComponent implements OnInit {
  ngOnInit(): void {
    localStorage.removeItem('registrationType');
    localStorage.removeItem('serviceLocation');
    localStorage.removeItem('registrationData');
  }

}
