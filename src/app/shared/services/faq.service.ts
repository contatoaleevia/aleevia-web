import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap, map, of } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { FAQ, CreateFaqDTO, UpdateFaqDTO, FaqResponse } from '@shared/models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private readonly path = 'faq';
  private faqsSubject = new BehaviorSubject<FAQ[]>([]);
  faqs$ = this.faqsSubject.asObservable();

  private faqByIdSubject = new BehaviorSubject<Map<string, FAQ>>(new Map());
  faqById$ = this.faqByIdSubject.asObservable();

  private loaded = false;
  private officeId = localStorage.getItem('officeId') || '{}';
  private apiService = inject(ApiService);

  getAll(): Observable<FAQ[]> {
    const currentFaqs = this.faqsSubject.getValue();
    if (this.loaded && currentFaqs.length > 0) {
      return of(currentFaqs);
    }

    return this.apiService.get<FaqResponse>(`${this.path}/${this.officeId}`).pipe(
      tap(response => {
        this.faqsSubject.next(response.faqs);
        this.loaded = true;
      }),
      map((response: FaqResponse) => response.faqs)
    );
  }

  getById(id: string): Observable<FAQ> {
    const cachedFaq = this.faqByIdSubject.getValue().get(id);
    if (cachedFaq) {
      return of(cachedFaq);
    }

    return this.apiService.get<FAQ>(`${this.path}/${id}`).pipe(
      tap(faq => {
        const currentMap = this.faqByIdSubject.getValue();
        currentMap.set(id, faq);
        this.faqByIdSubject.next(currentMap);
      })
    );
  }

  create(data: CreateFaqDTO): Observable<FAQ> {
    return this.apiService.post<FAQ>(`${this.path}/`, data).pipe(
      tap(newFaq => {
        const currentFaqs = this.faqsSubject.getValue();
        const completeFaq = {
          ...newFaq,
          faqCategory: {
            ...data.faqCategory,
            categoryTypeName: data.faqCategory.categoryTypeName
          }
        };
        this.faqsSubject.next([...currentFaqs, completeFaq]);

        const currentMap = this.faqByIdSubject.getValue();
        currentMap.set(completeFaq.id, completeFaq);
        this.faqByIdSubject.next(currentMap);
      })
    );
  }

  update(id: string, data: UpdateFaqDTO): Observable<FAQ> {
    return this.apiService.patch<FAQ>(`${this.path}`, {
      id,
      ...data
    }).pipe(
      tap(updatedFaq => {
        const currentFaqs = this.faqsSubject.getValue();
        const index = currentFaqs.findIndex(faq => faq.id === id);
        if (index !== -1) {
          currentFaqs[index] = updatedFaq;
          this.faqsSubject.next([...currentFaqs]);
        }

        const currentMap = this.faqByIdSubject.getValue();
        currentMap.set(id, updatedFaq);
        this.faqByIdSubject.next(currentMap);
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.path}`, {
      body: { id }
    }).pipe(
      tap(() => {
        const currentFaqs = this.faqsSubject.getValue();
        this.faqsSubject.next(currentFaqs.filter(faq => faq.id !== id));

        const currentMap = this.faqByIdSubject.getValue();
        currentMap.delete(id);
        this.faqByIdSubject.next(currentMap);
      })
    );
  }

  clearCache(): void {
    this.faqsSubject.next([]);
    this.faqByIdSubject.next(new Map());
    this.loaded = false;
  }
}
