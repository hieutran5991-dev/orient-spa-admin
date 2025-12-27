'use client';

import { useState } from 'react';
import { createBooking } from '@/api/booking';
import { CreateBookingRequest } from '@/types/booking';
import { useAlert } from '@/context/AlertContext';
import { useAuth } from '@/context/AuthContext';
import InputField from '../form/input/InputField';
import Select from '../form/Select';
import DatePicker from '../form/date-picker';
import TimePicker from '../form/time-picker';
import GuestPicker from '../form/guest-picker';
import TreatmentSelector from './TreatmentSelector';
import { Product } from '@/types/product';
import { Agency } from '@/types/agency';
import { formatDateToAPI } from '@/lib/datetime';

interface CreateBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: Product[];
  agencies: Agency[];
}

interface BookingFormData {
  agency_id: string;
  booking_date: Date | null;
  booking_time: string;
  number_of_people: string;
  guestProducts: { [guestNumber: number]: number[] }; // Map guest number to product IDs
  applyToAll: boolean;
  full_name: string;
  email: string;
  phone: string;
  social_account_id: string;
  note: string;
}

interface BookingFormErrors {
  agency_id?: string;
  booking_date?: string;
  booking_time?: string;
  number_of_people?: string;
  guestProducts?: string;
  full_name?: string;
  email?: string;
  phone?: string;
}

export default function CreateBookingForm({
  isOpen,
  onClose,
  onSuccess,
  products,
  agencies,
}: CreateBookingFormProps) {
  const { showSuccess, showError } = useAlert();
  const { user } = useAuth();
  const [formData, setFormData] = useState<BookingFormData>({
    agency_id: '',
    booking_date: null,
    booking_time: '',
    number_of_people: '1',
    guestProducts: {},
    applyToAll: false,
    full_name: '',
    email: '',
    phone: '',
    social_account_id: '',
    note: '',
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numberOfGuests = parseInt(formData.number_of_people) || 1;

  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};

    if (!formData.agency_id) {
      newErrors.agency_id = 'Agency is required';
    }
    if (!formData.booking_date) {
      newErrors.booking_date = 'Booking date is required';
    }
    if (!formData.booking_time) {
      newErrors.booking_time = 'Booking time is required';
    }
    if (!formData.number_of_people || parseInt(formData.number_of_people) < 1) {
      newErrors.number_of_people = 'Number of people must be at least 1';
    }
    
    // Validate that each guest has at least one product selected
    const numGuests = parseInt(formData.number_of_people) || 1;
    for (let i = 1; i <= numGuests; i++) {
      const guestProducts = formData.guestProducts[i] || [];
      if (guestProducts.length === 0) {
        newErrors.guestProducts = `Guest ${i} must select at least one treatment`;
        break;
      }
    }
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof BookingFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates && selectedDates.length > 0) {
      setFormData(prev => ({ ...prev, booking_date: selectedDates[0] }));
      if (errors.booking_date) {
        setErrors(prev => ({ ...prev, booking_date: undefined }));
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BookingFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format booking_date to ISO string with time
      const bookingDateTime = new Date(formData.booking_date!);
      const [hours, minutes] = formData.booking_time.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Create booking_details as JSON string with products for each guest
      const bookingDetails: { [key: string]: number[] } = {};
      const numGuests = parseInt(formData.number_of_people) || 1;
      
      for (let i = 1; i <= numGuests; i++) {
        const guestProducts = formData.guestProducts[i] || [];
        if (guestProducts.length > 0) {
          bookingDetails[`guest_${i}_services`] = guestProducts;
        }
      }

      const bookingData: CreateBookingRequest = {
        agency_id: parseInt(formData.agency_id),
        booking_date: formatDateToAPI(formData.booking_date!),
        booking_time: formData.booking_time,
        number_of_people: parseInt(formData.number_of_people),
        booking_details: bookingDetails,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        ...(formData.social_account_id.trim() && { social_account_id: formData.social_account_id.trim() }),
        ...(formData.note.trim() && { note: formData.note.trim() }),
        ...(user?.id && { user_id: user.id }),
      };

      await createBooking(bookingData);
      showSuccess('Success', 'Booking created successfully!');
      
      // Reset form
      setFormData({
        agency_id: '',
        booking_date: null,
        booking_time: '',
        number_of_people: '1',
        guestProducts: {},
        applyToAll: false,
        full_name: '',
        email: '',
        phone: '',
        social_account_id: '',
        note: '',
      });
      setErrors({});
      
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error creating booking:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create booking. Please try again.';
      showError('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        agency_id: '',
        booking_date: null,
        booking_time: '',
        number_of_people: '1',
        guestProducts: {},
        applyToAll: false,
        full_name: '',
        email: '',
        phone: '',
        social_account_id: '',
        note: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Create New Booking
            </h3>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agency */}
            <div>
              <label htmlFor="agency_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agency <span className="text-red-500">*</span>
              </label>
              <Select
                options={agencies.map(agency => ({
                  value: agency.id.toString(),
                  label: agency.name
                }))}
                placeholder="Select an agency"
                value={formData.agency_id}
                onChange={(value) => handleSelectChange('agency_id', value)}
                className={errors.agency_id ? 'border-red-500' : ''}
              />
              {errors.agency_id && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.agency_id}</p>
              )}
            </div>

            {/* Booking Date */}
            <div>
              <label htmlFor="booking_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Booking Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="booking_date"
                mode="single"
                placeholder="Select date"
                defaultDate={formData.booking_date || undefined}
                value={formData.booking_date ? formatDateToAPI(formData.booking_date) : ''}
                onChange={handleDateChange}
              />
              {errors.booking_date && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.booking_date}</p>
              )}
            </div>

            {/* Booking Time */}
            <div>
              <TimePicker
                id="booking_time"
                label="Booking Time"
                placeholder="Select time"
                value={formData.booking_time}
                selectedDate={formData.booking_date}
                onChange={(time) => {
                  setFormData(prev => ({ ...prev, booking_time: time }));
                  if (errors.booking_time) {
                    setErrors(prev => ({ ...prev, booking_time: undefined }));
                  }
                }}
                error={!!errors.booking_time}
                hint={errors.booking_time}
              />
            </div>

            {/* Number of People */}
            <div>
              <GuestPicker
                id="number_of_people"
                label="Number of People"
                placeholder="Select number of guests"
                value={formData.number_of_people}
                onChange={(value) => {
                  setFormData(prev => {
                    const newNum = parseInt(value) || 1;
                    const newGuestProducts: { [key: number]: number[] } = {};
                    for (let i = 1; i <= newNum; i++) {
                      newGuestProducts[i] = prev.guestProducts[i] || [];
                    }
                    return { ...prev, number_of_people: value, guestProducts: newGuestProducts };
                  });
                  if (errors.number_of_people) {
                    setErrors(prev => ({ ...prev, number_of_people: undefined }));
                  }
                }}
                error={!!errors.number_of_people}
                hint={errors.number_of_people}
                min={1}
                max={10}
              />
            </div>

            {/* Treatment Selection for Each Guest */}
            <div className="space-y-6">
              {Array.from({ length: numberOfGuests }, (_, index) => {
                const guestNumber = index + 1;
                const isFirstGuest = guestNumber === 1;
                return (
                  <TreatmentSelector
                    key={guestNumber}
                    guestNumber={guestNumber}
                    products={products}
                    selectedProductIds={formData.guestProducts[guestNumber] || []}
                    onProductsChange={(productIds) => {
                      setFormData(prev => {
                        const newGuestProducts = { ...prev.guestProducts };
                        newGuestProducts[guestNumber] = productIds;
                        
                        // If applyToAll is checked, apply to all guests
                        if (prev.applyToAll && isFirstGuest) {
                          for (let i = 1; i <= numberOfGuests; i++) {
                            newGuestProducts[i] = productIds;
                          }
                        }
                        
                        return { ...prev, guestProducts: newGuestProducts };
                      });
                      if (errors.guestProducts) {
                        setErrors(prev => ({ ...prev, guestProducts: undefined }));
                      }
                    }}
                    applyToAll={formData.applyToAll}
                    onApplyToAllChange={(apply) => {
                      setFormData(prev => {
                        const newGuestProducts = { ...prev.guestProducts };
                        
                        if (apply && isFirstGuest) {
                          // Apply first guest's products to all guests
                          const firstGuestProducts = prev.guestProducts[1] || [];
                          for (let i = 1; i <= numberOfGuests; i++) {
                            newGuestProducts[i] = firstGuestProducts;
                          }
                        }
                        
                        return { ...prev, applyToAll: apply, guestProducts: newGuestProducts };
                      });
                    }}
                    isFirstGuest={isFirstGuest}
                  />
                );
              })}
              {errors.guestProducts && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.guestProducts}</p>
              )}
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  error={!!errors.full_name}
                  hint={errors.full_name}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  error={!!errors.email}
                  hint={errors.email}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <InputField
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                error={!!errors.phone}
                hint={errors.phone}
              />
            </div>

            {/* Optional Fields */}
            <div>
              <label htmlFor="social_account_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Social Account ID (Optional)
              </label>
              <InputField
                type="text"
                id="social_account_id"
                name="social_account_id"
                value={formData.social_account_id}
                onChange={handleInputChange}
                placeholder="Enter social account ID"
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"
                placeholder="Enter any special requests or notes"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

