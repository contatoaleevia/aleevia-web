import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SideBarComponent],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  pageTitle: string = '';
  currentUser: any;
  isDashboard: boolean = false;
  userName: string = '';

  private routeTitles: { [key: string]: string } = {
    '/dashboard': '',  
    '/schedule': 'Agenda',
    '/pacientes': 'Pacientes',
    '/prontuario': 'Prontuário'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setPageTitle();
    });

    this.setPageTitle();
  }

  private setPageTitle() {
    const currentRoute = this.router.url;
    this.isDashboard = currentRoute.includes('dashboard');
    
    if (this.isDashboard) {
      this.userName = this.currentUser?.preferred_name || this.currentUser?.full_name || 'Usuário';
    } else {
      this.pageTitle = this.routeTitles[currentRoute] || '';
    }
  }
}
