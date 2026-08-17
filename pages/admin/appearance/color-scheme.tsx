import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { Plus, Copy, FileText, FileSpreadsheet, File, Printer, Columns } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThemeColorSchemePage() {
  const [globalColor, setGlobalColor] = useState('no');

  const THEMES = [
    { id: 1, title: 'Default Theme', theme: 'infix LMS Theme', p1: '#660AFB', p2: '#8F37FF', s1: '#202e3B', active: false },
    { id: 2, title: 'Theme 2', theme: 'infix LMS Theme', p1: '#d5701e', p2: '#305c2b', s1: '#415566', active: true },
  ];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Theme Color Scheme | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">THEME COLOR SCHEME</h1>
        </div>

        {/* Global Color Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">GLOBAL THEME COLOR</label>
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={globalColor === 'yes'} onChange={() => setGlobalColor('yes')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
              <span className="text-sm text-gray-600">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={globalColor === 'no'} onChange={() => setGlobalColor('no')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
              <span className="text-sm text-gray-600">No</span>
            </label>
          </div>
          <button onClick={() => toast.success("Updated")} className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> UPDATE
          </button>
        </div>

        {/* Theme Color Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Frontend Theme Color</h2>
            <button className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
              <Plus size={16} /> Add New
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none">
                <option>10</option>
                <option>25</option>
              </select>
              <span>Show entries</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="QUICK SEARCH" className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-full text-sm focus:outline-none w-64" />
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">SL <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">TITLE <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">THEME <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">PRIMARY COLOR <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">PRIMARY COLOR(2) <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">SECONDARY COLOR <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">STATUS <span className="text-gray-300 ml-1">↓</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {THEMES.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <div className="w-5 h-5 rounded-full bg-[#C9A227] text-white flex items-center justify-center text-xs">{t.id}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{t.title}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{t.theme}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {t.p1}
                        <div className="w-8 h-4 rounded-sm" style={{ backgroundColor: t.p1 }}></div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {t.p2}
                        <div className="w-8 h-4 rounded-sm" style={{ backgroundColor: t.p2 }}></div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {t.s1}
                        <div className="w-8 h-4 rounded-sm" style={{ backgroundColor: t.s1 }}></div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {t.active ? (
                        <button className="bg-[#C9A227] text-white px-4 py-1.5 rounded text-xs font-bold w-32 text-center">ACTIVE</button>
                      ) : (
                        <button className="bg-transparent border border-[#C9A227] text-[#C9A227] px-4 py-1.5 rounded text-xs font-bold w-32 text-center hover:bg-indigo-50">MAKE DEFAULT</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div>showing 1 to 2 of 2 entries</div>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&lt;</button>
              <button className="w-8 h-8 rounded-full bg-[#C9A227] text-white flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>
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
