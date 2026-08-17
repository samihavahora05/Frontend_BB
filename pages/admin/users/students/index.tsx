import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AdminDashboardLayout } from '../../../../src/layout/AdminDashboardLayout';
import { StatusBadge } from '../../../../src/components/StatusBadge';
import { 
  Plus, Search, Filter, Download, RefreshCw, 
  ChevronLeft, ChevronRight, Edit2, Trash2, 
  Upload, Users, CheckCircle, XCircle, FileWarning
} from 'lucide-react';
import toast from 'react-hot-toast';
import { StudentService } from '../../../../src/lib/api/admin/StudentService';

export default function StudentList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: students, meta, isLoading, isError, mutate } = StudentService.useStudents({
    search: debouncedSearch,
    status: statusFilter,
    page: currentPage,
    per_page: perPage
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(students.map((s: any) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'active' | 'suspended' | 'archived') => {
    if (selectedIds.length === 0) return;
    
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} students?`)) return;
    } else {
      if (!confirm(`Are you sure you want to mark ${selectedIds.length} students as ${action}?`)) return;
    }

    setIsBulkLoading(true);
    try {
      if (action === 'delete') {
        await StudentService.bulkDelete(selectedIds);
      } else {
        await StudentService.bulkUpdateStatus(selectedIds, action);
      }
      toast.success(`Action applied successfully to ${selectedIds.length} students`);
      setSelectedIds([]);
      mutate();
    } catch (error) {
      toast.error('Failed to apply bulk action');
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await StudentService.deleteStudent(id);
      toast.success('Student deleted');
      mutate();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleExport = () => {
    toast.success('Exporting students...');
    StudentService.exportCSV({
      search: debouncedSearch,
      status: statusFilter
    });
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Students | Admin Panel</title>
      </Head>
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all registered students on the platform.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => router.push('/admin/users/students/add')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B2A6B] hover:bg-[#15225a] text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
            >
              <Plus size={18} /> Add New Student
            </button>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
            
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C9A227] appearance-none text-sm bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => mutate()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200" title="Refresh">
                <RefreshCw size={18} />
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 font-medium rounded-lg transition-colors text-sm">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-[#1B2A6B]/5 border-b border-[#1B2A6B]/10 p-3 flex items-center justify-between px-6">
              <span className="text-sm font-semibold text-[#1B2A6B]">
                {selectedIds.length} student(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button disabled={isBulkLoading} onClick={() => handleBulkAction('active')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-md hover:bg-emerald-200 transition-colors">
                  <CheckCircle size={14} /> Mark Active
                </button>
                <button disabled={isBulkLoading} onClick={() => handleBulkAction('suspended')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors">
                  <FileWarning size={14} /> Suspend
                </button>
                <button disabled={isBulkLoading} onClick={() => handleBulkAction('delete')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]"
                      checked={selectedIds.length === students?.length && students?.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 font-medium">Student Info</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Course/College</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded mb-2"></div><div className="h-3 w-24 bg-gray-100 rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-200 rounded mb-2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-200 rounded mb-2"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-6 w-20 bg-gray-200 rounded-full mx-auto"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-gray-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                      Failed to load students. Please try again.
                    </td>
                  </tr>
                ) : students?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Users size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No Students Found</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-sm">
                          {searchTerm || statusFilter 
                            ? "We couldn't find any students matching your filters." 
                            : "There are no students in the system yet. Add one to get started."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students?.map((student: any) => (
                    <tr key={student.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(student.id) ? 'bg-[#1B2A6B]/5' : ''}`}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]"
                          checked={selectedIds.includes(student.id)}
                          onChange={() => handleSelectRow(student.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.student_profile?.profile_photo ? (
                            <img src={`/storage/${student.student_profile.profile_photo}`} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#1B2A6B]/10 flex items-center justify-center text-[#1B2A6B] font-bold border border-[#1B2A6B]/20">
                              {student.first_name[0]}{student.last_name[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-gray-800">{student.first_name} {student.last_name}</p>
                            <p className="text-xs text-gray-500">ID: STU-{student.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{student.email}</p>
                        <p className="text-xs text-gray-500">{student.phone || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">{student.student_profile?.course || 'N/A'}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{student.student_profile?.college_name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/users/students/${student.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </Link>
                          <button onClick={() => handleDelete(student.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && meta?.last_page > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-800">{meta.from || 0}</span> to <span className="font-medium text-gray-800">{meta.to || 0}</span> of <span className="font-medium text-gray-800">{meta.total}</span> students
              </span>
              <div className="flex items-center gap-2">
                <select 
                  value={perPage} 
                  onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#C9A227]"
                >
                  <option value={10}>10 / page</option>
                  <option value={15}>15 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                
                <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white text-gray-600 border-r border-gray-200 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                    Page {currentPage} of {meta.last_page}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(meta.last_page, p + 1))}
                    disabled={currentPage === meta.last_page}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white text-gray-600 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
