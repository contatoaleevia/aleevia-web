export interface FAQ extends CreateFaqDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqDTO {
  question: string;
  answer: string;
  faqCategory: FaqCategory;
  sourceId: string;
  sourceType: number;
}

export interface FaqCategory {
  categoryType: string;
  categoryTypeName: string;
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

