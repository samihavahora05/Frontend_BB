import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../../src/components/reactbits/AnimatedContent";
import { Plus, Search, Trash2, Edit3, Folder, Tag } from "lucide-react";
import { Button } from "../../../../src/components/ui/Button";
import toast from "react-hot-toast";
import { useConfirm } from "../../../../src/context/ConfirmContext";
import { BlogService } from "../../../../src/lib/api/admin/BlogService";

export default function AdminBlogCategoriesPage() {
  const [search, setSearch] = useState("");
  const [newCat, setNewCat] = useState({ name: "", slug: "", status: "Active", description: "", parent_id: "", meta_title: "", meta_description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const confirmAction = useConfirm();

  const { data: categories, mutate } = BlogService.useCategories();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", newCat.name);
      formData.append("slug", newCat.slug);
      formData.append("status", newCat.status);
      formData.append("description", newCat.description);
      formData.append("parent_id", newCat.parent_id);
      formData.append("meta_title", newCat.meta_title);
      formData.append("meta_description", newCat.meta_description);
      if (imageFile) formData.append("image", imageFile);

      if (editingId) {
        await BlogService.updateCategory(editingId, formData);
        toast.success("Category updated!");
      } else {
        await BlogService.createCategory(formData);
        toast.success("Category created!");
      }
      setNewCat({ name: "", slug: "", status: "Active", description: "", parent_id: "", meta_title: "", meta_description: "" });
      setImageFile(null);
      setEditingId(null);
      mutate();
    } catch (err) {
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (cat: any) => {
    setNewCat({ 
      name: cat.name, 
      slug: cat.slug || "", 
      status: cat.status || "Active",
      description: cat.description || "",
      parent_id: cat.parent_id || "",
      meta_title: cat.meta_title || "",
      meta_description: cat.meta_description || ""
    });
    setImageFile(null);
    setEditingId(cat.id);
  };

  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete Category", description: "Delete this category?", isDestructive: true })) {
      try {
        await BlogService.deleteCategory(id);
        toast.success("Category deleted");
        mutate();
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };

  const filtered = categories?.filter((c:any) => c.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <AnimatedContent direction="up" delay={0.1}>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Folder className="text-[#1B2A6B]" />
              Blog Categories
            </h1>
            <p className="text-slate-500 text-sm font-medium">Organize your blog posts with categories.</p>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatedContent direction="up" delay={0.2} className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5">Add New Category</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                  <input required type="text" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</label>
                  <input type="text" value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} placeholder="Auto-generated if empty"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select value={newCat.status} onChange={(e) => setNewCat({ ...newCat, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#1B2A6B] outline-none">
                    <option>Active</option>
                    <option>Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Category (Optional)</label>
                  <select value={newCat.parent_id} onChange={(e) => setNewCat({ ...newCat, parent_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#1B2A6B] outline-none">
                    <option value="">None</option>
                    {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image (Optional)</label>
                  <input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                </div>

                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Title</label>
                  <input type="text" value={newCat.meta_title} onChange={(e) => setNewCat({ ...newCat, meta_title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Description</label>
                  <textarea value={newCat.meta_description} onChange={(e) => setNewCat({ ...newCat, meta_description: e.target.value })} rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none" />
                </div>

                <Button variant="primary" type="submit" className="w-full shadow-md gap-2 mt-2">
                  <Plus size={16} /> {editingId ? "Update Category" : "Add Category"}
                </Button>
                {editingId && (
                  <Button variant="outline" type="button" onClick={() => { setEditingId(null); setNewCat({ name: "", slug: "", status: "Active", description: "", parent_id: "", meta_title: "", meta_description: "" }); setImageFile(null); }} className="w-full mt-2">
                    Cancel Edit
                  </Button>
                )}
              </form>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.3} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                />
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Category Name</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Slug</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">Posts</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                        <Tag size={14} className="text-slate-400" /> {cat.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{cat.slug}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">{cat.blogs_count || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          cat.status === 'Active' || cat.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {cat.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(cat)} className="p-1.5 text-slate-400 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded transition-colors"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
