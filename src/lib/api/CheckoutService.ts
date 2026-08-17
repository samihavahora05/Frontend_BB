import api from '../axios';
import useSWR from 'swr';

export const CheckoutService = {
  /**
   * Step 1: Create a Razorpay order on the backend
   */
  createOrder: async (courseId: number) => {
    const res = await api.post('/checkout/create-order', { course_id: courseId });
    return res.data.data;
  },

  /**
   * Step 2: Verify payment signature after Razorpay popup closes successfully
   */
  verifyPayment: async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const res = await api.post('/checkout/verify', payload);
    return res.data;
  },

  /**
   * Load the Razorpay checkout script dynamically
   */
  loadRazorpayScript: (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-sdk')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  /**
   * Full end-to-end flow: create order → open Razorpay popup → verify
   *
   * @param courseId     - The course to purchase
   * @param onSuccess    - Callback on confirmed payment
   * @param onError      - Callback on failure
   */
  initiatePurchase: async (
    courseId: number,
    onSuccess: () => void,
    onError: (msg: string) => void
  ) => {
    const loaded = await CheckoutService.loadRazorpayScript();
    if (!loaded) {
      onError('Failed to load payment gateway. Please try again.');
      return;
    }

    try {
      const orderData = await CheckoutService.createOrder(courseId);

      const options = {
        key: '', // key is NOT needed from frontend — Razorpay only needs the order_id
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BlueBoxx DA',
        description: 'Course Enrollment',
        order_id: orderData.gateway_order_id,
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
          contact: orderData.user.phone,
        },
        theme: { color: '#1B2A6B' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await CheckoutService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess();
          } catch {
            onError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            // User dismissed the popup without paying — do nothing
          },
        },
      };

      // @ts-ignore – Razorpay is loaded via CDN
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (err: any) => {
        onError(err?.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Could not initiate payment.';
      onError(msg);
    }
  },
};

// ─── Student Dashboard Services ───────────────────────────────────────────────

export const StudentService = {
  useMyCourses() {
    const { data, error, isLoading, mutate } = useSWR('/student/courses', (url) =>
      api.get(url).then((r) => r.data.data)
    );
    return { data: data ?? [], error, isLoading, mutate };
  },

  useMyCertificates() {
    const { data, error, isLoading, mutate } = useSWR('/student/certificates', (url) =>
      api.get(url).then((r) => r.data.data)
    );
    return { data: data ?? [], error, isLoading, mutate };
  },

  useMyOrders() {
    const { data, error, isLoading } = useSWR('/student/orders', (url) =>
      api.get(url).then((r) => r.data.data)
    );
    return { data: data ?? [], error, isLoading };
  },

  markLessonComplete: async (courseId: number, lessonId: number) => {
    const res = await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
    return res.data;
  },

  useQuiz: (lessonId?: number | null) => {
    const { data, error, isLoading } = useSWR(
      lessonId ? `/student/lessons/${lessonId}/quiz` : null,
      (url) => api.get(url).then((r) => r.data.data)
    );
    return { quiz: data ?? null, error, isLoading };
  },

  submitQuiz: async (
    quizId: number,
    answers: Array<{ question_id: number; answer_id: number }>
  ) => {
    const res = await api.post(`/student/quizzes/${quizId}/submit`, { answers });
    return res.data.data;
  },
};
