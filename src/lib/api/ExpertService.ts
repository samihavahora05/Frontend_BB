import api from '../axios';
import useSWR from 'swr';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExpertProfile {
  id: number;
  name: string;
  avatar: string | null;
  designation: string;
  company: string | null;
  specialization: string | null;
  hourly_rate: number;
  average_rating: number;
  total_reviews: number;
}

export interface ExpertDetail extends ExpertProfile {
  bio: string | null;
  linkedin_url: string | null;
  sessions: Array<{
    id: number;
    title: string;
    duration_minutes: number;
    price: number;
  }>;
  availability: Array<{
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
}

export interface ExpertFilters {
  search?: string;
  specialization?: string;
  sort?: 'rating_high' | 'price_low' | 'price_high';
  page?: number;
  per_page?: number;
}

// ─── Expert Booking Service ───────────────────────────────────────────────────

export const ExpertService = {
  /**
   * SWR hook for expert listing
   */
  useExperts(filters: ExpertFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.append(k, String(v));
      }
    });
    const key = `/public/experts?${params.toString()}`;
    const { data, error, isLoading, mutate } = useSWR(key, (url) =>
      api.get(url).then((r) => r.data)
    );
    return {
      experts: (data?.data ?? []) as ExpertProfile[],
      pagination: data?.pagination ?? null,
      error,
      isLoading,
      mutate,
    };
  },

  /**
   * SWR hook for a single expert detail page
   */
  useExpert(id: string | number | null) {
    const { data, error, isLoading } = useSWR(
      id ? `/public/experts/${id}` : null,
      (url) => api.get(url).then((r) => r.data.data)
    );
    return { expert: (data ?? null) as ExpertDetail | null, error, isLoading };
  },

  /**
   * Step 1: Create a Razorpay order on the backend for a MentorSession
   */
  createBookingOrder: async (payload: {
    session_id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    notes?: string;
  }) => {
    const { session_id, ...data } = payload;
    const res = await api.post(`/public/experts/sessions/${session_id}/book`, data);
    return res.data.data;
  },

  /**
   * Step 2: Verify payment signature after Razorpay popup closes successfully
   */
  verifyBookingPayment: async (
    bookingId: number,
    payload: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ) => {
    const res = await api.post(`/public/experts/bookings/${bookingId}/verify`, payload);
    return res.data.data;
  },
};
