import { Agency } from "./agency";
import { BookingStatus } from "@/constants/booking-status";
import { ProductPrices } from "./product";

export interface Booking {
  id: number;
  agency_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  booking_details: {
    guest_1_services?: BookingDetail[];
    [key: string]: BookingDetail[] | undefined;
  };
  full_name: string;
  email: string;
  tel_prefix?: string;
  phone: string;
  nation?: string;
  social_account_id?: string;
  gclid?: string;
  note?: string;
  total_prices: ProductPrices;
  total_price_VND?: number;
  total_price_USD?: number;
  status: BookingStatus;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  agency?: Agency;
}

export interface BookingDetail {
  id: number;
  name: string;
  description: string;
  duration: number;
  prices: ProductPrices;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface BookingListResponse {
  message: string;
  data: Booking[];
  pagination: PaginationInfo;
}

export interface CreateBookingRequest {
  agency_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  booking_details: string | { [key: string]: number[] };
  full_name: string;
  email: string;
  phone: string;
  tel_prefix?: string;
  vn_phone_number?: string;
  social_app?: string;
  social_account_id?: string;
  note?: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  id: number;
  status?: BookingStatus;
}

export interface BookingResponse {
  data: Booking
}
