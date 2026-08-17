import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Inactive' | 'Completed' | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'approved' || normalizedStatus === 'active' || normalizedStatus === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold uppercase tracking-wider shadow-sm">
        <CheckCircle2 size={12} /> {status}
      </span>
    );
  }
  
  if (normalizedStatus === 'rejected' || normalizedStatus === 'inactive') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-bold uppercase tracking-wider shadow-sm">
        <XCircle size={12} /> {status}
      </span>
    );
  }
  
  if (normalizedStatus === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-100 text-[11px] font-bold uppercase tracking-wider shadow-sm">
        <Clock size={12} /> {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold uppercase tracking-wider shadow-sm">
      {status}
    </span>
  );
}
