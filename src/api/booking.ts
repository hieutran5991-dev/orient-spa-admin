import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  BookingListResponse,
  BookingResponse,
} from "@/types/booking";

// Get list of bookings
export const getBookings = async (): Promise<AxiosResponse<BookingListResponse>> => {
  return await request.get('api/bookings');
};

// Get single booking by ID
export const getBooking = async (id: number): Promise<AxiosResponse<BookingResponse>> => {
  return await request.get(`api/bookings/${id}`);
};

// Update booking status
export const updateBookingStatus = async (id: number, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<AxiosResponse<BookingResponse>> => {
  return await request.patch(`api/bookings/${id}/status`, { status });
};

