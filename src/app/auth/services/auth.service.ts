import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '@auth/models/auth.model';
import { User } from '@shared/models/user.model';
import { ApiService } from '@core/services/api.service';
import { environment } from '@environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  private readonly routeUrl = 'auth/';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    }
  }

  private checkAuthStatus(): void {
    try {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('currentUser');
      
      let user: User | null = null;
      if (userJson) {
        try {
          user = JSON.parse(userJson);
        } catch (e) {
          console.error('Erro ao fazer parse do usuário:', e);
        }
      }
      
      if (token && user) {
        this.setAuthState(user, token);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      this.logout();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const cpf = credentials.username.replace(/[.-]/g, '');
    credentials.username = cpf;

    return this.apiService.post<LoginResponse>(this.routeUrl + 'login', credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setAuthState(response.user, response.token);
        }
      }),
      catchError(error => {
        console.error('Erro ao fazer login:', error);
        return throwError(() => error);
      })
    );
  }

  loginWithGoogle(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `${this.routeUrl}google/login`;
    }
  }

  handleGoogleCallback(token: string, user: Partial<User>): void {
    if (!token || !user) {
      console.error('Token ou usuário inválido recebido no AuthService');
      return;
    }

    try {
      this.setAuthState(user, token);
    } catch (error) {
      console.error('Erro ao atualizar estado de autenticação:', error);
      throw error;
    }
  }

  private setAuthState(user: Partial<User>, token: string): void {
    this.tokenSubject.next(token);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user as User);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  logout(): void {
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next({} as User);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('officeIds');
      localStorage.removeItem('officeId');
    }
    
    this.router.navigate(['/login']);
  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || this.tokenSubject.value || '';
    }
    return this.tokenSubject.value || '';
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser$;
  }
  
  get currentUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      if (this.currentUserSubject.value) {
        return this.currentUserSubject.value;
      }
      
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          this.currentUserSubject.next(user);
          return user;
        } catch (e) {
          console.error('Erro ao fazer parse do usuário:', e);
        }
      }
    }
    return this.currentUserSubject.value;
  }
} 