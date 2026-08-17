import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../../src/layout/AdminDashboardLayout';
import { DataTable } from '../../../../src/components/DataTable';
import { StatusBadge } from '../../../../src/components/StatusBadge';
import { Plus } from 'lucide-react';

const mockCompanies = [
  { id: '1', name: 'Google', industry: 'Technology', contact: 'hr@google.com', jobsPosted: 12, status: 'Approved' },
  { id: '2', name: 'Startup Inc', industry: 'Software', contact: 'jobs@startup.io', jobsPosted: 3, status: 'Pending' },
  { id: '3', name: 'Design Studio', industry: 'Design', contact: 'hello@designstudio.com', jobsPosted: 0, status: 'Rejected' },
];

export default function CompanyList() {
  const router = useRouter();

  const columns = [
    { key: 'serial', label: 'S.No', sortable: false },
    { key: 'name', label: 'Company Name' },
    { key: 'industry', label: 'Industry' },
    { key: 'contact', label: 'Contact Email' },
    { key: 'jobsPosted', label: 'Jobs Posted' },
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
        <title>Companies | Admin Panel</title>
      </Head>
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hiring Companies</h1>
            <p className="text-sm text-gray-500 mt-1">Manage company profiles and job posters.</p>
          </div>
          <button 
            onClick={() => router.push('/admin/users/companies/add')}
            className="flex items-center gap-2 px-4 py-2 bg-[#C9A227] hover:bg-[#b08d22] text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus size={18} /> Add Company
          </button>
        </div>

        <DataTable
          title="All Companies"
          data={mockCompanies}
          columns={columns as any}
          onEdit={(row) => router.push(`/admin/users/companies/edit/${row.id}`)}
          onDelete={(row) => console.log('Delete', row)}
        />
      </div>
    </AdminDashboardLayout>
  );
}
