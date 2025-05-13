import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccessProfilesData } from './access-profiles.model';

@Component({
  selector: 'app-access-profiles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './access-profiles.component.html',
  styleUrl: './access-profiles.component.scss'
})
export class AccessProfilesComponent {
  @Input() profilesData!: AccessProfilesData;

  viewAll() {
    // Navigation logic will be implemented later
    console.log('View all profiles');
  }
}
