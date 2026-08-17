import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Award, Plus, Search, Edit, Trash2, Medal, Star, Trophy
} from "lucide-react";

const MOCK_BADGES = [
  { id: 1, name: "Fast Learner", description: "Complete a course in under 3 days.", type: "Achievement", icon: "Medal", color: "text-blue-500", bg: "bg-blue-100", date: "Oct 1, 2025" },
  { id: 2, name: "Top Contributor", description: "Answer 50 questions in the community forum.", type: "Community", icon: "Star", color: "text-yellow-500", bg: "bg-yellow-100", date: "Oct 5, 2025" },
  { id: 3, name: "Master Developer", description: "Earn 100% on 3 consecutive quizzes.", type: "Skill", icon: "Trophy", color: "text-purple-500", bg: "bg-purple-100", date: "Oct 10, 2025" },
  { id: 4, name: "Early Bird", description: "Submit the first job application of the day.", type: "Activity", icon: "Award", color: "text-green-500", bg: "bg-green-100", date: "Oct 12, 2025" },
];

export default function BadgesPage() {
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('bb_gamification');
    if (stored) {
      setBadges(JSON.parse(stored));
    } else {
      setBadges(MOCK_BADGES);
      localStorage.setItem('bb_gamification', JSON.stringify(MOCK_BADGES));
    }
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("Achievement");

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this badge?")) {
      const updated = badges.filter(b => b.id !== id);
      setBadges(updated);
      localStorage.setItem('bb_gamification', JSON.stringify(updated));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newName.trim()) return;
    const newBadge = {
      id: Date.now(),
      name: newName,
      description: newDesc,
      type: newType,
      icon: "Award",
      color: "text-indigo-500",
      bg: "bg-indigo-100",
      date: new Date().toLocaleDateString()
    };
    const updated = [newBadge, ...badges];
    setBadges(updated);
    localStorage.setItem('bb_gamification', JSON.stringify(updated));
    setIsAdding(false);
    setNewName("");
    setNewDesc("");
  };

  const getIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case "Medal": return <Medal className={`w-8 h-8 ${colorClass}`} />;
      case "Star": return <Star className={`w-8 h-8 ${colorClass}`} />;
      case "Trophy": return <Trophy className={`w-8 h-8 ${colorClass}`} />;
      default: return <Award className={`w-8 h-8 ${colorClass}`} />;
    }
  };

  const filteredBadges = badges.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Gamification Badges
            </h1>
            <p className="text-gray-500 mt-1">
              Create and manage unlockable achievements to engage students.
            </p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? "Cancel" : "Create Badge"}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Create New Badge</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Code Ninja"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Category
                  </label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Achievement">Achievement</option>
                    <option value="Skill">Skill</option>
                    <option value="Community">Community</option>
                    <option value="Activity">Activity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unlock Condition Description
                </label>
                <textarea 
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Complete 5 React courses with 90% or higher."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Icon & Color
                </label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200 cursor-pointer">
                    <Award className="w-8 h-8 text-indigo-500" />
                  </div>
                  <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    Change Icon
                  </button>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg mr-3 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Save Badge
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Badge Library</h2>
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x border-b">
            {filteredBadges.map((badge, index) => (
              <div key={badge.id} className={`p-6 hover:bg-gray-50 transition-colors ${index > 1 ? 'border-t' : ''}`}>
                <div className="flex gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${badge.bg}`}>
                    {getIcon(badge.icon, badge.color)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{badge.name}</h3>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{badge.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(badge.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBadges.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No badges found matching your search.
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
