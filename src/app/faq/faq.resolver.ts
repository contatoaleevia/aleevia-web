import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { FaqService } from "@app/shared/services/faq.service";
import { map } from "rxjs/operators";

export const faqResolver: ResolveFn<any> = () => {
  const faqService = inject(FaqService);

  return faqService.getAll().pipe(
    map((faqs) => {
      return faqs;
    })
  );
}