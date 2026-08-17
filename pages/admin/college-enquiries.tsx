import React from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../src/layout/AdminDashboardLayout';
import { Copy, FileText, FileSpreadsheet, File, Printer, Columns } from 'lucide-react';

export default function CollegeEnquiriesPage() {
  return (
    <AdminDashboardLayout>
      <Head>
        <title>College Enquiries | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">COLLEGE ENQUIRIES</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">College Enquiries</h2>

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
                <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">NAME <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">EMAIL <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">PHONE <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">MESSAGE <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">DATE <span className="text-gray-300 ml-1">↓</span></th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">ACTION <span className="text-gray-300 ml-1">↓</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-400">1</td>
                  <td className="py-4 px-4 text-sm text-gray-600">Harshil Thakrar</td>
                  <td className="py-4 px-4 text-sm text-gray-500">thakrarharshil0@gmail.com</td>
                  <td className="py-4 px-4 text-sm text-gray-500">6351143538</td>
                  <td className="py-4 px-4 text-sm text-gray-500">Demooooo</td>
                  <td className="py-4 px-4 text-sm text-gray-500">12-Mar-2026 08:56</td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-4 py-1.5 border border-[#C9A227] text-[#C9A227] text-xs font-bold rounded hover:bg-indigo-50">
                      SELECT
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div>showing 1 to 1 of 1 entries</div>
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
