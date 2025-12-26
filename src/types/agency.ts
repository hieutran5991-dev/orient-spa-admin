import { PaginationInfo } from "./booking";

export interface AgencyLanguages {
  [languageCode: string]: {
    name: string;
    address: string;
  };
}

export interface Agency {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  open_time: string;
  close_time: string;
  capacity: number;
  created_at?: string;
  updated_at?: string;
  translations: AgencyLanguage[];
}

export interface AgencyLanguage {
  language_code: string;
  name: string;
  address: string;
}


export interface AgencyListResponse {
  message: string;
  data: Agency[];
  pagination: PaginationInfo;
}

export interface AgencyByIdResponse {
  message: string;
  data: Agency;
}

export interface CreateAgencyRequest {
  phone: string;
  email: string;
  open_time: string;
  close_time: string;
  capacity: number;
  translations: AgencyLanguages;
}

export interface UpdateAgencyRequest extends Partial<CreateAgencyRequest> {
  id: number;
}

export interface AgencyResponse {
  message: string;
  errors: string[];
}
