import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../../src/layout/AdminDashboardLayout';
import { DataTable } from '../../../../src/components/DataTable';
import { StatusBadge } from '../../../../src/components/StatusBadge';
import { Plus } from 'lucide-react';

const mockInstructors = [
  { id: '1', name: 'Dr. Alan Turing', email: 'alan@example.com', expertise: 'Computer Science', joined: '2025-01-15', status: 'Approved' },
  { id: '2', name: 'Ada Lovelace', email: 'ada@example.com', expertise: 'Mathematics', joined: '2025-02-10', status: 'Pending' },
  { id: '3', name: 'Grace Hopper', email: 'grace@example.com', expertise: 'Software Engineering', joined: '2025-03-01', status: 'Approved' },
  { id: '4', name: 'John von Neumann', email: 'john@example.com', expertise: 'Physics', joined: '2025-03-20', status: 'Rejected' },
];

export default function InstructorList() {
  const router = useRouter();

  const columns = [
    { key: 'serial', label: 'S.No', sortable: false },
    { key: 'name', label: 'Instructor Name' },
    { key: 'email', label: 'Email' },
    { key: 'expertise', label: 'Expertise Area' },
    { key: 'joined', label: 'Joined Date' },
    { 
      key: 'status', 
      label: 'Approval Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Instructors | Admin Panel</title>
      </Head>
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Instructors & Experts</h1>
            <p className="text-sm text-gray-500 mt-1">Manage instructor approvals and profiles.</p>
          </div>
          <button 
            onClick={() => router.push('/admin/users/instructors/add')}
            className="flex items-center gap-2 px-4 py-2 bg-[#C9A227] hover:bg-[#b08d22] text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus size={18} /> Add Instructor
          </button>
        </div>

        <DataTable
          title="All Instructors"
          data={mockInstructors}
          columns={columns as any}
          onEdit={(row) => router.push(`/admin/users/instructors/edit/${row.id}`)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </AdminDashboardLayout>
  );
}
