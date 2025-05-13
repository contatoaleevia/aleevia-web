import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap, map, throwError, of } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { FAQ, CreateFaqDTO, UpdateFaqDTO, FaqResponse } from '@shared/models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private readonly path = 'faq';
  private faqs = new BehaviorSubject<FAQ[]>([]);
  private faqResponse = new BehaviorSubject<FaqResponse | null>(null);
  private loaded = false;
  private officeId = localStorage.getItem('officeId') || '{}';
  private apiService = inject(ApiService);


  getAll(): Observable<FaqResponse> {
    if (this.loaded && this.faqResponse.getValue()) {
      return of(this.faqResponse.getValue() as FaqResponse);
    }

    return this.apiService.get<FaqResponse>(`${this.path}/${this.officeId}`).pipe(
      tap(response => {
        this.faqs.next(response.faqs);
        this.faqResponse.next(response);
        this.loaded = true;
      })
    );
  }

  /**
   * Busca uma FAQ específica
   * @param id ID da FAQ
   * @returns Observable com a FAQ encontrada
   */
  getById(id: string): Observable<FAQ> {
    const faq = this.faqs.getValue().find(faq => faq.id === id);
    if (faq) {
      return new Observable<FAQ>(observer => {
        observer.next(faq);
        observer.complete();
      });
    }
    return this.apiService.get<FAQ>(`${this.path}/${id}`);
  }

  /**
   * Cria uma nova FAQ
   * @param data Dados da nova FAQ
   * @returns Observable com a FAQ criada
   */
  create(data: CreateFaqDTO): Observable<FAQ> {
    return this.apiService.post<FAQ>(`${this.path}/`, data).pipe(
      tap(newFaq => {
        const currentFaqs = this.faqs.getValue();
        this.faqs.next([...currentFaqs, newFaq]);
      })
    );
  }

  /**
   * Atualiza uma FAQ existente
   * @param id ID da FAQ
   * @param data Dados a serem atualizados
   * @returns Observable com a FAQ atualizada
   */
  update(id: string, data: UpdateFaqDTO): Observable<FAQ> {
    return this.apiService.put<FAQ>(`${this.path}/${id}`, data).pipe(
      tap(updatedFaq => {
        const currentFaqs = this.faqs.getValue();
        const index = currentFaqs.findIndex(faq => faq.id === id);
        if (index !== -1) {
          currentFaqs[index] = updatedFaq;
          this.faqs.next([...currentFaqs]);
        }
      })
    );
  }

  /**
   * Remove uma FAQ
   * @param id ID da FAQ
   * @returns Observable com a resposta da deleção
   */
  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`).pipe(
      tap(() => {
        const currentFaqs = this.faqs.getValue();
        this.faqs.next(currentFaqs.filter(faq => faq.id !== id));
      })
    );
  }

  /**
   * Força uma atualização dos dados do cache
   */
  refreshCache(): void {
    this.loaded = false;
    this.getAll();
  }
}
