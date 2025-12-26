'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ComponentCard from '../common/ComponentCard';
import { createBooking } from '@/api/booking';
import { getProducts } from '@/api/product';
import { CreateBookingRequest } from '@/types/booking';
import { useAlert } from '@/context/AlertContext';
import InputField from '../form/input/InputField';
import DatePicker from '../form/date-picker';
import TimePicker from '../form/time-picker';
import GuestPicker from '../form/guest-picker';
import PhoneInputWithPrefix from '../form/PhoneInputWithPrefix';
import AppIdInput from '../form/AppIdInput';
import TreatmentSelector from './TreatmentSelector';
import { Product } from '@/types/product';
import { formatDateToAPI } from '@/lib/datetime';

interface BookingFormData {
  agency_id: string;
  booking_date: Date | null;
  booking_time: string;
  number_of_people: string;
  guestProducts: { [guestNumber: number]: number[] };
  applyToAll: boolean;
  full_name: string;
  email: string;
  tel_prefix: string;
  phone: string;
  vn_phone_number: string;
  app_type: string;
  social_account_id: string;
  note: string;
}

interface BookingFormErrors {
  booking_date?: string;
  booking_time?: string;
  number_of_people?: string;
  guestProducts?: string;
  full_name?: string;
  email?: string;
  phone?: string;
}

export default function CreateBookingPageForm() {
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    agency_id: '1', // Default agency ID
    booking_date: null,
    booking_time: '',
    number_of_people: '1',
    guestProducts: {},
    applyToAll: false,
    full_name: '',
    email: '',
    tel_prefix: '+84',
    phone: '',
    vn_phone_number: '',
    app_type: '',
    social_account_id: '',
    note: '',
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numberOfGuests = parseInt(formData.number_of_people) || 1;

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const productsResponse = await getProducts(1, 100); // Get up to 100 products

        if (productsResponse.data?.data) {
          setProducts(productsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        showError('Error', 'Failed to load products. Please refresh the page.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [showError]);

  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking_details as object with products for each guest
      const bookingDetails: { [key: string]: number[] } = {};
      const numGuests = parseInt(formData.number_of_people) || 1;

      for (let i = 1; i <= numGuests; i++) {
        const guestProducts = formData.guestProducts[i] || [];
        bookingDetails[`guest_${i}_services`] = guestProducts;
      }

      const bookingData: CreateBookingRequest = {
        agency_id: parseInt(formData.agency_id),
        booking_date: formatDateToAPI(formData.booking_date!),
        booking_time: formData.booking_time,
        number_of_people: parseInt(formData.number_of_people),
        booking_details: bookingDetails, // Send as object, not stringified
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        ...(formData.tel_prefix && { tel_prefix: formData.tel_prefix }),
        ...(formData.vn_phone_number.trim() && { vn_phone_number: formData.vn_phone_number.trim() }),
        ...(formData.app_type && { social_app: formData.app_type }),
        ...(formData.social_account_id.trim() && { social_account_id: formData.social_account_id.trim() }),
        ...(formData.note.trim() && { note: formData.note.trim() }),
      };

      await createBooking(bookingData);
      showSuccess('Success', 'Booking created successfully!');
      router.push('/bookings');
    } catch (error: any) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create booking. Please try again.';
      showError('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Booking
        </h1>
        <Link
          href="/bookings"
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Back to List
        </Link>
      </div>

      <ComponentCard title="Booking Information">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Booking Date, Time, and Number of People */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full name <span className="text-red-500">*</span>
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

            {/* Phone Number */}
            <div>
              <PhoneInputWithPrefix
                id="phone"
                label="Phone number"
                value={formData.phone}
                prefix={formData.tel_prefix}
                onPrefixChange={(prefix) => {
                  setFormData(prev => ({ ...prev, tel_prefix: prefix }));
                }}
                onPhoneChange={(phone) => {
                  setFormData(prev => ({ ...prev, phone }));
                  if (errors.phone) {
                    setErrors(prev => ({ ...prev, phone: undefined }));
                  }
                }}
                placeholder="Phone number"
                error={!!errors.phone}
                hint={errors.phone}
                required={true}
              />
            </div>
          </div>

          {/* VN Phone Number and App ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* VN Phone Number */}
            <div>
              <PhoneInputWithPrefix
                id="vn_phone_number"
                label="VN Phone Number"
                value={formData.vn_phone_number}
                prefix="+84"
                onPrefixChange={() => {}} // Prefix is fixed, no change handler needed
                onPhoneChange={(phone) => {
                  setFormData(prev => ({ ...prev, vn_phone_number: phone }));
                }}
                placeholder="Temporary Vietnam Phone Number"
              />
            </div>

            {/* App ID */}
            <div>
              <AppIdInput
                id="app_id"
                label="App ID"
                appType={formData.app_type}
                appId={formData.social_account_id}
                onAppTypeChange={(appType) => {
                  setFormData(prev => ({ ...prev, app_type: appType }));
                }}
                onAppIdChange={(appId) => {
                  setFormData(prev => ({ ...prev, social_account_id: appId }));
                }}
                placeholder="app ID"
              />
            </div>
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
            <Link
              href="/bookings"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

