export interface FAQ {
  id: string;
  question: string;
  answer: string;
  classification: string;
  sourceId: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFaqDTO {
  question: string;
  answer: string;
  classification: string;
}

export interface UpdateFaqDTO {
  question?: string;
  answer?: string;
  classification?: string;
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

