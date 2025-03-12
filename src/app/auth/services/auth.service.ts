import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    try {
      const user = this.currentUserSubject.value;
      const token = this.getToken();
      
      if (token && user) {
        this.setAuthState(user, token);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      this.logout();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const cpf = credentials.cpf.replace(/[.-]/g, '');
    
    const formData = new FormData();
    formData.append('username', cpf);
    formData.append('password', credentials.password);
    
    return this.apiService.post<LoginResponse>('/login', formData).pipe(
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

  private setAuthState(user: User, token: string): void {
    this.tokenSubject.next(token);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/login']);
  }

  getToken(): string {
    return this.tokenSubject.value!;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('/users/me').pipe(
      tap(user => {
        if (user) {
          this.currentUserSubject.next(user);
        }
      })
    );
  }
} 