import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/auth.model';
import { timer } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: '<div class="d-flex justify-content-center align-items-center min-vh-100"><div class="spinner-border" role="status"></div></div>'
})
export class GoogleCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    console.log('=== GoogleCallbackComponent construído ===');
  }

  ngOnInit(): void {
    console.log('=== Iniciando Google Callback ===');
    
    if (isPlatformBrowser(this.platformId)) {
      console.log('URL completa:', window.location.href);
    }
    
    console.log('Query Params:', this.route.snapshot.queryParams);
    
    const params = this.route.snapshot.queryParams;
    const token = params['access_token'];
    
    if (!token) {
      console.error('Token não encontrado nos parâmetros');
      console.error('Parâmetros disponíveis:', params);
      
      timer(1000).subscribe(() => {
        this.router.navigate(['/login'], { 
          queryParams: { error: 'Token não encontrado' } 
        });
      });
      return;
    }

    try {
      console.log('Token encontrado:', token);
      
      const user: Partial<User> = {
        id: params['user_id'],
        full_name: params['name'],
        email: params['email'],
        picture_url: params['picture']
      };

      console.log('Dados do usuário construídos:', user);
      
      this.authService.handleGoogleCallback(token, user);
      console.log('Login processado com sucesso');
      
      timer(1000).subscribe(() => {
        console.log('Redirecionando para dashboard...');
        this.router.navigate(['/dashboard']);
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      
      timer(1000).subscribe(() => {
        this.router.navigate(['/login'], { 
          queryParams: { error: 'Erro ao processar autenticação do Google' } 
        });
      });
    }
  }
} 