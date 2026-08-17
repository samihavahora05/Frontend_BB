import useSWR from 'swr';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import React from 'react';

// Simulated Real-Time Notification Service
// Note: In production, this would use laravel-echo and pusher-js
export const NotificationService = {
  useRealTimeNotifications: () => {
    useEffect(() => {
      // Simulate receiving a WebSocket event every 45 seconds for demonstration purposes
      const interval = setInterval(() => {
        const events = [
          { type: 'JobApplication', title: 'New Job Application', msg: 'A student just applied for Software Engineer Intern' },
          { type: 'CourseQA', title: 'New Question Asked', msg: 'Someone asked a question in "React for Beginners"' },
        ];
        const evt = events[Math.floor(Math.random() * events.length)];
        
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-black text-gray-900">{evt.title}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">{evt.msg}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-black text-indigo-600 hover:text-indigo-500 focus:outline-none">
                Close
              </button>
            </div>
          </div>
        ), { duration: 5000 });
      }, 45000);

      return () => clearInterval(interval);
    }, []);
  }
};
