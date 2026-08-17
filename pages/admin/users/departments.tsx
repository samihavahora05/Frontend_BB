import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Building2, Plus, Search, Edit, Trash2, MoreVertical
} from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";

const MOCK_DEPARTMENTS = [
  { id: 1, name: "Engineering", head: "Sarah Connor", employees: 45, status: "Active" },
  { id: 2, name: "Marketing", head: "John Doe", employees: 12, status: "Active" },
  { id: 3, name: "Human Resources", head: "Jane Smith", employees: 8, status: "Active" },
  { id: 4, name: "Sales", head: "Mike Johnson", employees: 24, status: "Active" },
  { id: 5, name: "Customer Support", head: "Emily Davis", employees: 30, status: "Active" },
];

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [isAdding, setIsAdding] = useState(false);
  const confirmAction = useConfirm();
  
  // New Department Form State
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptHead) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    const newDept = {
      id: Date.now(),
      name: newDeptName,
      head: newDeptHead,
      employees: 0,
      status: "Active"
    };
    
    setDepartments([newDept, ...departments]);
    setIsAdding(false);
    setNewDeptName("");
    setNewDeptHead("");
    toast.success("Department added successfully!");
  };

  const handleDelete = async (id: number, name: string) => {
    if (await confirmAction({ title: "Delete Department", description: `Are you sure you want to delete the ${name} department?`, isDestructive: true })) {
      setDepartments(departments.filter(d => d.id !== id));
      toast.success(`${name} deleted.`);
    }
  };

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              Departments
            </h1>
            <p className="text-gray-500 mt-1">
              Manage organization departments and their heads.
            </p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? "Cancel" : "Add Department"}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Department</h2>
            <form onSubmit={handleAddDepartment} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Finance"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Head
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Robert Clark"
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">All Departments</h2>
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department Name</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department Head</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900">{dept.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {dept.head.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{dept.head}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
                        {dept.employees} Users
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                        {dept.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(dept.id, dept.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDepartments.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No departments found matching your search.
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
