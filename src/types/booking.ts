import { Agency } from "./agency";
import { BookingStatus } from "@/constants/booking-status";

export interface Booking {
  id: number;
  agency_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  booking_details: {
    [key: number]: BookingDetail[];
  };
  full_name: string;
  email: string;
  phone: string;
  social_account_id?: string;
  note?: string;
  total_price: number;
  currency: string;
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
  duration: string;
  price: number;
  currency: string;
}

export interface BookingListResponse {
  data: Booking[];
}

export interface CreateBookingRequest {
  agency_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  booking_details: string;
  full_name: string;
  email: string;
  phone: string;
  social_account_id?: string;
  note?: string;
  total_price: number;
  currency: string;
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {
  id: number;
  status?: BookingStatus;
}

export interface BookingResponse {
  data: Booking
}
