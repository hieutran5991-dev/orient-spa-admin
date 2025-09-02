import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  BookingListResponse,
  BookingResponse,
} from "@/types/booking";
import { BookingStatus } from "@/constants/booking-status";

// Get list of bookings
export const getBookings = async (): Promise<AxiosResponse<BookingListResponse>> => {
  return await request.get('bookings');
};

// Get single booking by ID
export const getBooking = async (id: number): Promise<AxiosResponse<BookingResponse>> => {
  return await request.get(`bookings/${id}`);
};

// Update booking status
export const updateBookingStatus = async (id: number, status: BookingStatus): Promise<AxiosResponse<BookingResponse>> => {
  return await request.post(`bookings/${id}/status`, { status });
};

