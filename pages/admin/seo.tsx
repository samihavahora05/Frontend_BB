import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../src/layout/MainLayout';
import { SEO } from '../../src/components/seo/SEO';
import api from '../../src/lib/axios';

export default function AdminSeoDashboard() {
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const res = await api.get('/admin/seo-metadata');
      setMetadata(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEO title="Admin | SEO Dashboard" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">SEO Dashboard</h1>
          <button className="bg-[#1B2A6B] text-white px-4 py-2 rounded-lg font-bold">
            + New Metadata Override
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">URL Path</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Title Override</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Robots</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : metadata.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No custom SEO metadata active. The system is currently using dynamic programmatic templates.
                  </td>
                </tr>
              ) : (
                metadata.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm text-[#1B2A6B]">{item.url_path}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700">
                        {item.robots || 'index, follow'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600 cursor-pointer hover:underline">
                      Edit
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
