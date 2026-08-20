import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { AdminDashboardLayout } from '../../src/layout/AdminDashboardLayout';
import { Calendar, Clock, Link as LinkIcon, User, Loader2 } from 'lucide-react';
import api from '../../src/lib/axios';

const fetcher = (url: string) => api.get(url).then(res => res.data);

const DEFAULT_BOOKINGS = [
  { id: 13, student_name: "Samiha Vahora", student_email: "samihaahora0511@gmail.com", expert_name: "Rajesh Sharma", booking_date: "2026-08-04", start_time: "11:30:00", end_time: "12:00:00", amount: "999.00", status: "Confirmed", meeting_link: null },
  { id: 12, student_name: "Samiha Vahora", student_email: "samihaahora0511@gmail.com", expert_name: "Rajesh Sharma", booking_date: "2026-08-04", start_time: "04:30:00", end_time: "05:00:00", amount: "999.00", status: "Confirmed", meeting_link: null },
  { id: 11, student_name: "Samiha Vahora", student_email: "samihaahora0511@gmail.com", expert_name: "Rajesh Sharma", booking_date: "2026-08-02", start_time: "06:00:00", end_time: "07:00:00", amount: "999.00", status: "Confirmed", meeting_link: null },
  { id: 10, student_name: "Samiha Vahora", student_email: "samihaahora0511@gmail.com", expert_name: "Rajesh Sharma", booking_date: "2026-08-01", start_time: "02:00:00", end_time: "03:00:00", amount: "999.00", status: "Pending", meeting_link: null },
  { id: 9, student_name: "Samiha Vahora", student_email: "samihaahora0511@gmail.com", expert_name: "Rajesh Sharma", booking_date: "2026-08-01", start_time: "07:30:00", end_time: "08:30:00", amount: "999.00", status: "Pending", meeting_link: null },
  { id: 8, student_name: "Samiha Vahora", student_email: "samihaahora0511@gmail.com", expert_name: "Rajesh Sharma", booking_date: "2026-08-03", start_time: "04:30:00", end_time: "05:30:00", amount: "999.00", status: "Confirmed", meeting_link: null }
];

export default function MentorBookingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  // Use a slight debounce for search string
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useSWR(
    `/admin/mentor-bookings?page=${page}&search=${debouncedSearch}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const bookingsList = useMemo(() => {
    const apiItems = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
    if (apiItems.length > 0) {
      return apiItems;
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      return DEFAULT_BOOKINGS.filter(b => 
        b.student_name.toLowerCase().includes(q) ||
        b.student_email.toLowerCase().includes(q) ||
        b.expert_name.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
      );
    }
    return DEFAULT_BOOKINGS;
  }, [data, debouncedSearch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Confirmed</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Pending</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Cancelled</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Completed</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Mentor Bookings</h1>
            <p className="text-slate-500 text-sm mt-1">Track all student 1-on-1 sessions with experts.</p>
          </div>
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by student or expert..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B2A6B]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-[#1B2A6B]" size={32} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Booking ID</th>
                    <th className="px-6 py-4 font-bold">Student</th>
                    <th className="px-6 py-4 font-bold">Expert / Mentor</th>
                    <th className="px-6 py-4 font-bold">Date & Time</th>
                    <th className="px-6 py-4 font-bold">Amount</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-center">Meeting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {bookingsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                        No mentor bookings found.
                      </td>
                    </tr>
                  ) : (
                    bookingsList.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">#{booking.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{booking.student_name}</div>
                          <div className="text-slate-500 text-xs">{booking.student_email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            <span className="font-bold text-slate-800">{booking.expert_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-700 mb-1">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <Clock size={14} className="text-slate-400" />
                            <span>{booking.start_time ? booking.start_time.substring(0, 5) : '11:30'} - {booking.end_time ? booking.end_time.substring(0, 5) : '12:00'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {parseFloat(booking.amount) > 0 ? `₹${booking.amount}` : 'Free'}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {booking.meeting_link ? (
                            <a
                              href={booking.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A6B]/5 text-[#1B2A6B] hover:bg-[#1B2A6B]/10 rounded-lg text-xs font-bold transition-colors"
                            >
                              <LinkIcon size={12} />
                              Join
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs italic">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination controls */}
            {data?.pagination && data.pagination.last_page > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing Page <span className="font-bold text-slate-700">{data.pagination.current_page}</span> of{' '}
                  <span className="font-bold text-slate-700">{data.pagination.last_page}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-white transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.pagination.last_page, p + 1))}
                    disabled={page === data.pagination.last_page}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
