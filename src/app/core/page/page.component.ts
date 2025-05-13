import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

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
  showBackButton: boolean = false;

  private routeTitles: { [key: string]: string } = {
    'dashboard': '',
    'schedule': 'Agenda',
    'pacientes': 'Pacientes',
    'faq': 'Perguntas Frequentes',
    'configuration': 'Espaço de Saúde',
    'attendances': 'Serviços'
  };

  private mainRoutes: string[] = [
    'dashboard',
    'schedule',
    'pacientes',
    'faq',
    'configuration',
    'attendances'
  ];

  constructor(
    private router: Router,
    private location: Location
  ) {}

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

    // Verificar se deve mostrar o botão de voltar
    this.showBackButton = !this.mainRoutes.some(route =>
      currentRoute === '/' + route ||
      currentRoute === '/' ||
      (currentRoute.includes(route) && currentRoute.split('/').length <= 2)
    );

    if (this.isDashboard) {
      this.userName = this.currentUser.name || 'Usuário';
    } else {
      this.pageTitle = '';
      for (const [route, title] of Object.entries(this.routeTitles)) {
        if (currentRoute.includes(route) && route !== 'dashboard') {
          this.pageTitle = title;
          break;
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}
