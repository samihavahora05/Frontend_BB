import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Trash2, Edit2, CheckSquare, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export interface Column<T> {
  key: keyof T | 'actions' | 'serial' | (string & {});
  label: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  bulkActions?: boolean;
  onBulkDelete?: (selectedRows: T[]) => void;
  onBulkStatusChange?: (selectedRows: T[], status: string) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id?: string | number }>({
  title,
  data,
  columns,
  searchable = true,
  onEdit,
  onDelete,
  bulkActions = true,
  onBulkDelete,
  onBulkStatusChange,
  isLoading = false
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Search logic
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id!).filter(Boolean)));
    }
  };

  const toggleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };



  const handleBulkStatus = (status: string) => {
    if (selectedRows.size === 0) return toast.error("No rows selected");
    if (onBulkStatusChange) {
      onBulkStatusChange(data.filter(d => selectedRows.has(d.id!)), status);
    } else {
      toast.success(`Changed status to ${status} for ${selectedRows.size} items`);
    }
    setSelectedRows(new Set());
  };

  const handleBulkDel = () => {
    if (selectedRows.size === 0) return toast.error("No rows selected");
    if (onBulkDelete) {
      onBulkDelete(data.filter(d => selectedRows.has(d.id!)));
    } else {
      toast.success(`Deleted ${selectedRows.size} items`);
    }
    setSelectedRows(new Set());
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-3">
          {title && <h2 className="text-lg font-bold text-[#0d1635]">{title}</h2>}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 flex-1">
          {searchable && (
            <div className="relative flex-1 md:flex-none md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent w-full transition-all"
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {bulkActions && selectedRows.size > 0 && (
            <div className="flex items-center gap-2 bg-[#1B2A6B]/5 px-3 py-1.5 rounded-lg border border-[#1B2A6B]/10 mr-2">
              <span className="text-xs font-bold text-[#1B2A6B]">{selectedRows.size} Selected</span>
              <div className="w-px h-4 bg-[#1B2A6B]/20 mx-1"></div>
              <select 
                onChange={(e) => {
                  if(e.target.value === 'delete') handleBulkDel();
                  else if(e.target.value) handleBulkStatus(e.target.value);
                  e.target.value = '';
                }}
                className="text-xs font-semibold bg-transparent border-none text-gray-600 focus:ring-0 p-0 cursor-pointer"
              >
                <option value="">Bulk Actions</option>
                <option value="Approved">Mark Approved</option>
                <option value="Rejected">Mark Rejected</option>
                <option value="Pending">Mark Pending</option>
                <option value="delete">Delete Selected</option>
              </select>
            </div>
          )}

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {bulkActions && (
                <th className="py-3 px-4 w-10">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-[#1B2A6B] transition-colors">
                    {selectedRows.size === paginatedData.length && paginatedData.length > 0 ? <CheckSquare size={18} className="text-[#1B2A6B]"/> : <Square size={18} />}
                  </button>
                </th>
              )}
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => col.sortable !== false && col.key !== 'actions' && col.key !== 'serial' && handleSort(col.key as keyof T)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {bulkActions && <td className="py-3 px-4"><div className="w-4 h-4 bg-gray-200 rounded"></div></td>}
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                const isSelected = selectedRows.has(row.id!);
                return (
                  <tr key={row.id || index} className={`hover:bg-[#1B2A6B]/5 transition-colors group ${isSelected ? 'bg-[#1B2A6B]/5' : ''}`}>
                    {bulkActions && (
                      <td className="py-3 px-4 w-10">
                        <button onClick={() => toggleSelectRow(row.id!)} className="text-gray-300 group-hover:text-gray-400 hover:text-[#1B2A6B] transition-colors">
                          {isSelected ? <CheckSquare size={18} className="text-[#1B2A6B]"/> : <Square size={18} />}
                        </button>
                      </td>
                    )}
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="py-3 px-4 text-sm text-gray-600">
                        {col.key === 'serial' ? (
                          <span className="font-semibold text-gray-400">{globalIndex}</span>
                        ) : col.key === 'actions' ? (
                          <div className="flex items-center gap-2">
                            {col.render ? col.render(row, globalIndex) : (
                              <>
                                {onEdit && <button onClick={() => onEdit(row)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>}
                                {onDelete && <button onClick={() => onDelete(row)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>}
                              </>
                            )}
                          </div>
                        ) : col.render ? (
                          col.render(row, globalIndex)
                        ) : (
                          <span className="font-medium">{(row as any)[col.key]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (bulkActions ? 1 : 0)} className="py-8 text-center text-gray-400 text-sm font-medium">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-200 rounded p-1 text-xs focus:ring-[#1B2A6B] focus:border-[#1B2A6B]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          <span>Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries</span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Simple logic to show pages around current page
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - 4 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                    currentPage === pageNum 
                      ? 'bg-[#1B2A6B] text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
