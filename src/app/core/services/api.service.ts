import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Realiza uma requisição GET
   * @param path Caminho da API
   * @param params Parâmetros da requisição
   * @param options Opções adicionais
   * @returns Observable com a resposta
   */
  get<T>(path: string, params: HttpParams = new HttpParams(), options = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, { params, ...options });
  }

  /**
   * Realiza uma requisição POST
   * @param path Caminho da API
   * @param body Corpo da requisição
   * @param options Opções adicionais
   * @returns Observable com a resposta
   */
  post<T>(path: string, body: any = {}, options = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, options);
  }

  /**
   * Realiza uma requisição PUT
   * @param path Caminho da API
   * @param body Corpo da requisição
   * @param options Opções adicionais
   * @returns Observable com a resposta
   */
  put<T>(path: string, body: any = {}, options = {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, body, options);
  }

  /**
   * Realiza uma requisição DELETE
   * @param path Caminho da API
   * @param options Opções adicionais
   * @returns Observable com a resposta
   */
  delete<T>(path: string, options = {}): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`, options);
  }

  /**
   * Realiza uma requisição PATCH
   * @param path Caminho da API
   * @param body Corpo da requisição
   * @param options Opções adicionais
   * @returns Observable com a resposta
   */
  patch<T>(path: string, body: any = {}, options = {}): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${path}`, body, options);
  }
} 