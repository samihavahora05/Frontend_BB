import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import {
  LayoutDashboard, Users, BookOpen, Briefcase, Settings, GripVertical,
  Plus, Trash2, Edit3, X, ChevronDown, ChevronRight, RotateCcw,
  Image as ImageIcon, Trophy, Book, ClipboardList, ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";

const LIVE_PREVIEW_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, standalone: true },
  { label: "My Panel", icon: Users, children: ["My Topics", "Deposit", "My Certificate", "Logged In Device", "Referral", "Purchase History", "Refund & Cancellation"] },
  { label: "Media manager", icon: ImageIcon, children: ["All Files", "New Upload"] },
  { label: "Users", isHeader: true },
  { label: "All Internships", icon: ClipboardList, children: [] },
  { label: "Students", icon: Users, children: [] },
  { label: "All Jobs", icon: Briefcase, children: [] },
  { label: "All Contest", icon: Trophy, children: [] },
  { label: "Instructors", icon: Book, children: [] },
  { label: "User manager", icon: ShieldCheck, children: [] },
  { label: "Internship", icon: Briefcase, children: [] },
  { label: "Jobs Application", icon: ClipboardList, children: [] },
  { label: "Contest", icon: Trophy, children: [] },
  { label: "Post New Job", icon: Plus, standalone: true },
];

const MENU_LIST_ITEMS = [
  {
    id: 1, label: "Dashboard", children: []
  },
  {
    id: 2, label: "My Panel", expanded: true,
    children: ["My Topics", "Deposit", "My Certificate", "Logged In Device", "Referral", "Purchase History", "Refund & Cancellation"]
  },
  {
    id: 3, label: "Media manager", expanded: false,
    children: ["All Files", "New Upload", "Setting"]
  },
];

const AVAILABLE_ITEMS = [
  "Courses", "Quiz", "Virtual Class", "Certificate", "Report",
  "Enrollment", "All Blogs", "Gamification", "Notifications",
  "Communications", "Newsletter", "College Enquiries"
];

export default function AdminSidebarManagerPage() {
  const [menuItems, setMenuItems] = useState(MENU_LIST_ITEMS);
  const [expandedMenuItems, setExpandedMenuItems] = useState<Record<number, boolean>>({ 2: true });
  const [liveExpandedItems, setLiveExpandedItems] = useState<Record<string, boolean>>({ "My Panel": true });
  const confirmAction = useConfirm();

  const toggleMenu = (id: number) => {
    setExpandedMenuItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLiveItem = (label: string) => {
    setLiveExpandedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleClearCache = () => {
    toast.success("Cache cleared successfully!");
  };

  const handleResetDefault = async () => {
    if (await confirmAction({ title: "Reset Sidebar", description: "Reset sidebar to default settings? This cannot be undone.", isDestructive: true })) {
      setMenuItems(MENU_LIST_ITEMS);
      toast.success("Sidebar reset to default.");
    }
  };

  const handleDeleteItem = (id: number, childIdx?: number) => {
    if (childIdx !== undefined) {
      setMenuItems(prev => prev.map(item =>
        item.id === id
          ? { ...item, children: item.children.filter((_, i) => i !== childIdx) }
          : item
      ));
    } else {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
    toast.success("Item removed.");
  };

  return (
    <AdminDashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Sidebar Manager</h1>
          <p className="text-slate-500 text-sm font-medium">
            Customize the admin navigation sidebar — reorder, add, or remove items.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
          >
            Clear Cache
          </button>
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all"
          >
            <RotateCcw size={14} /> Reset To Default
          </button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Col 1: Add Section + Available Items */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <button className="w-full py-3 px-4 border-2 border-dashed border-[#1B2A6B]/30 hover:border-[#1B2A6B] text-[#1B2A6B] rounded-xl font-bold text-sm transition-all hover:bg-[#1B2A6B]/5">
              + Add Section
            </button>
          </div>
          <div className="p-5">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Available menu items</h3>
            <div className="min-h-[200px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-3 space-y-2">
              {AVAILABLE_ITEMS.map(item => (
                <div
                  key={item}
                  className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-100 text-xs font-bold text-slate-600 hover:border-[#1B2A6B]/30 hover:text-[#1B2A6B] cursor-grab transition-all"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical size={12} className="text-slate-300" />
                    {item}
                  </div>
                  <Plus size={12} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: Menu List (Drag Editor) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h2 className="text-base font-black text-slate-800">Menu List</h2>
          </div>
          <div className="p-4 space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 overflow-hidden">
                {/* Parent Row */}
                <div className="flex items-center gap-2 px-3 py-3 bg-slate-50 border-b border-slate-200">
                  <GripVertical size={16} className="text-slate-300 cursor-grab shrink-0" />
                  <span className="flex-1 text-sm font-bold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#1B2A6B] hover:bg-white transition-all">
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <X size={13} />
                    </button>
                    {item.children.length > 0 && (
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 transition-all"
                      >
                        {expandedMenuItems[item.id] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Children */}
                {expandedMenuItems[item.id] && item.children.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {item.children.map((child, cidx) => (
                      <div key={cidx} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 transition-all">
                        <GripVertical size={14} className="text-slate-200 cursor-grab shrink-0" />
                        <span className="flex-1 text-xs font-semibold text-slate-600">{child}</span>
                        <div className="flex items-center gap-1">
                          <button className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-[#1B2A6B] transition-all">
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, cidx)}
                            className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-red-500 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => toast("Drag items here to add them")}
              className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-[#1B2A6B]/30 text-slate-400 hover:text-[#1B2A6B] rounded-xl text-xs font-bold transition-all hover:bg-[#1B2A6B]/5"
            >
              + Add Menu Item
            </button>
          </div>
        </div>

        {/* Col 3: Live Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h2 className="text-base font-black text-slate-800">Live Preview</h2>
          </div>
          <div className="p-4 bg-[#0d1635] rounded-b-2xl min-h-[500px]">
            <div className="space-y-0.5">
              {LIVE_PREVIEW_ITEMS.map((item, idx) => {
                if (item.isHeader) {
                  return (
                    <p key={idx} className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-4 pb-1 px-2">
                      {item.label}
                    </p>
                  );
                }
                if (item.standalone) {
                  return (
                    <div key={idx} className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-300 text-xs font-bold">
                      {item.icon && <item.icon size={14} className="text-slate-500 shrink-0" />}
                      <span>{item.label}</span>
                    </div>
                  );
                }
                const isOpen = liveExpandedItems[item.label];
                return (
                  <div key={idx}>
                    <button
                      onClick={() => toggleLiveItem(item.label)}
                      className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-slate-300 hover:bg-white text-xs font-bold transition-all"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon size={14} className="text-slate-500 shrink-0" />}
                        <span>{item.label}</span>
                      </div>
                      {item.children && item.children.length > 0 && (
                        isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />
                      )}
                    </button>
                    {isOpen && item.children && item.children.length > 0 && (
                      <div className="ml-5 space-y-0.5 mt-0.5">
                        {item.children.map((child, cidx) => (
                          <div key={cidx} className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200 rounded cursor-pointer transition-colors">
                            {child}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
