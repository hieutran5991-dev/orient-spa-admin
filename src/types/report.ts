export interface ReportSummary {
  total_bookings: number;
  total_revenue_vnd: number;
  total_revenue_usd: number;
  average_booking_vnd: number;
  average_booking_usd: number;
  total_customers: number;
}

export interface BookingsByStatus {
  booked: number;
  done: number;
  cancelled: number;
}

export interface RevenueStats {
  total_vnd: number;
  total_usd: number;
  today_vnd: number;
  today_usd: number;
  this_week_vnd: number;
  this_week_usd: number;
  this_month_vnd: number;
  this_month_usd: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  count: number;
  revenue_vnd: number;
  revenue_usd: number;
}

export interface TopAgency {
  agency_id: number;
  agency_name: string;
  count: number;
  revenue_vnd: number;
  revenue_usd: number;
}

export interface TopCategory {
  category_id: number;
  category_name: string;
  count: number;
  revenue_vnd: number;
  revenue_usd: number;
}

export interface BookingByDate {
  date: string;
  count: number;
  revenue_vnd: number;
  revenue_usd: number;
}

export interface BookingByMonth {
  month: string;
  count: number;
  revenue_vnd: number;
  revenue_usd: number;
}

export interface ReportData {
  summary: ReportSummary;
  bookings_by_status: BookingsByStatus;
  revenue: RevenueStats;
  top_products: TopProduct[];
  top_categories: TopCategory[];
  bookings_by_date: BookingByDate[];
  bookings_by_month?: BookingByMonth[];
}

export interface ReportResponse {
  message: string;
  data: ReportData;
}

