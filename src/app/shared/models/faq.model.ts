export interface FAQ extends CreateFaqDTO {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFaqDTO {
  question: string;
  answer: string;
  faqCategory: string;
  sourceId: string;
  sourceType: number;
}

export interface UpdateFaqDTO {
  question?: string;
  answer?: string;
  faqCategory?: string;
}

export interface FaqResponse {
  faqPage: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
  faqs: FAQ[];
}

