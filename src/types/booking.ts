export interface Booking {
  id: number;
  agency_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  booking_details: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  note?: string;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
  
  // Relations
  agency?: {
    id: number;
    name: string;
    address: string;
  };
}

export interface CreateBookingRequest {
  agency_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  booking_details: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  note?: string;
  total_price: number;
  currency: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  id: number;
  status?: 0 | 1 | 2;
}

export interface BookingListResponse {
  data: Booking[];
  message: string;
  status: number;
}

export interface BookingResponse {
  data: Booking;
  message: string;
  status: number;
}
