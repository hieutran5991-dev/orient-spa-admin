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
}

export interface CreateAgencyRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  open_time: string;
  close_time: string;
  capacity: number;
}

export interface UpdateAgencyRequest extends Partial<CreateAgencyRequest> {
  id: number;
}

export interface AgencyListResponse {
  data: Agency[];
  message: string;
  status: number;
}

export interface AgencyResponse {
  data: Agency;
  message: string;
  status: number;
}

