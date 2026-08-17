import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../../src/layout/AdminDashboardLayout';
import { Copy, FileText, FileSpreadsheet, File, Printer, Columns, Plus, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { CertificateApiService } from '../../../../src/lib/api/admin/CertificateApiService';

export default function CertificateFontsPage() {
  const { data: fonts, mutate, isLoading } = CertificateApiService.useFonts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFontName, setNewFontName] = useState('');
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFontFile(e.target.files[0]);
    }
  };

  const handleAddFont = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFontName || !fontFile) return toast.error('Name and font file are required');
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', newFontName);
      formData.append('font_file', fontFile);
      
      await CertificateApiService.createFont(formData);
      toast.success('Font uploaded successfully');
      mutate();
      setIsModalOpen(false);
      setNewFontName('');
      setFontFile(null);
    } catch (e) {
      toast.error('Failed to upload font');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure you want to delete this font?')) {
      try {
        await CertificateApiService.deleteFont(id);
        toast.success('Font deleted');
        mutate();
      } catch (e) {
        toast.error('Failed to delete font');
      }
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Certificate Fonts | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">CERTIFICATE FONTS</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Font List</h2>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm">
              <Plus size={16} /> Add Font
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#C9A227]">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>Show entries</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="QUICK SEARCH" className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227] w-64" />
              </div>
              <div className="flex border border-gray-200 rounded-md overflow-hidden text-gray-500">
                <button className="px-2.5 py-1.5 border-r border-gray-200 hover:bg-gray-50"><Copy size={14}/></button>
                <button className="px-2.5 py-1.5 border-r border-gray-200 hover:bg-gray-50"><FileSpreadsheet size={14}/></button>
                <button className="px-2.5 py-1.5 border-r border-gray-200 hover:bg-gray-50"><FileText size={14}/></button>
                <button className="px-2.5 py-1.5 border-r border-gray-200 hover:bg-gray-50"><File size={14}/></button>
                <button className="px-2.5 py-1.5 border-r border-gray-200 hover:bg-gray-50"><Printer size={14}/></button>
                <button className="px-2.5 py-1.5 hover:bg-gray-50"><Columns size={14}/></button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[200px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase w-20">SL</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">NAME <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">FILE <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase w-32 text-right">ACTION <span className="text-gray-300 ml-1">↓</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-gray-400 font-bold">Loading...</td>
                  </tr>
                ) : fonts?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-gray-400 font-bold">No Fonts Available</td>
                  </tr>
                ) : (
                  fonts?.map((font: any, idx: number) => (
                    <tr key={font.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-500">{idx + 1}</td>
                      <td className="py-4 px-4 text-sm text-gray-600 font-medium">{font.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-500 break-all">{font.file_path}</td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => handleDelete(font.id)} className="inline-flex items-center gap-1 px-4 py-1.5 border border-red-500 text-red-500 text-xs font-bold rounded hover:bg-red-50">
                          <Trash2 size={14}/> DELETE
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div>Showing 1 to 2 of 2 entries</div>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&lt;</button>
              <button className="w-8 h-8 rounded-full bg-[#C9A227] text-white flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Upload New Font</h2>
            <form onSubmit={handleAddFont} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Font Name</label>
                <input 
                  required
                  type="text" 
                  value={newFontName}
                  onChange={(e) => setNewFontName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
                  placeholder="e.g. Roboto" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Font File (.ttf)</label>
                <div className="flex border border-gray-200 rounded-md overflow-hidden">
                  <input type="text" readOnly value={fontFile ? fontFile.name : ''} placeholder="BROWSE FILE" className="flex-1 px-4 py-2 text-sm text-gray-500 bg-gray-50 focus:outline-none" />
                  <label className="bg-[#1B2A6B] text-white px-4 py-2 text-sm font-semibold cursor-pointer flex items-center">
                    <Upload size={16} className="mr-2"/> Browse
                    <input type="file" className="hidden" accept=".ttf" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-gray-200 rounded-md font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-[#C9A227] text-white rounded-md font-semibold">
                  {isSubmitting ? 'Uploading...' : 'Upload Font'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}
