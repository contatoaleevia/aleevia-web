export interface FAQ {
  id: string;
  question: string;
  answer: string;
  classification: string;
  doctor_id: string;
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