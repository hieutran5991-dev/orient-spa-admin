import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  BookingListResponse,
  BookingResponse,
  CreateBookingRequest,
} from "@/types/booking";
import { BookingStatus } from "@/constants/booking-status";

// Get list of bookings
export const getBookings = async (page: number = 1, perPage: number = 10): Promise<AxiosResponse<BookingListResponse>> => {
  return await request.get('bookings', {
    params: {
      page,
      per_page: perPage,
    },
  });
};

// Get single booking by ID
export const getBooking = async (id: number): Promise<AxiosResponse<BookingResponse>> => {
  return await request.get(`bookings/${id}`);
};

// Update booking status
export const updateBookingStatus = async (id: number, status: BookingStatus): Promise<AxiosResponse<BookingResponse>> => {
  return await request.put(`bookings/${id}/status`, { status });
};

// Create new booking
export const createBooking = async (data: CreateBookingRequest): Promise<AxiosResponse<BookingResponse>> => {
  return await request.post('bookings', data);
};

