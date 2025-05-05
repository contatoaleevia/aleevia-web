import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  getAddressByCep(cep: string): Observable<ViaCepResponse> {
    const cleanCep = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`${this.baseUrl}/${cleanCep}/json`);
  }
} 