export interface LanguageListResponse {
  message: string;
  data: Language[];
}

export interface MultiLanguageValue {
  [languageCode: string]: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  is_default: boolean;
}