import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Link2, Search, CheckCircle2, XCircle, Settings, X, 
  MapPin, CreditCard, Mail, MessageSquare, Video, Shield, Database, Cloud, Eye, EyeOff, Lock
} from "lucide-react";
import toast from "react-hot-toast";
import { SettingService } from "../../../src/lib/api/admin/SettingService";

const INTEGRATIONS_METADATA = [
  { id: "google_oauth", name: "Google OAuth", category: "Auth", icon: Shield, description: "Enable Google login for users." },
  { id: "google_maps", name: "Google Maps", category: "Maps", icon: MapPin, description: "Display maps and location autosuggest." },
  { id: "cloudinary", name: "Cloudinary", category: "Media", icon: Cloud, description: "Cloud media storage and CDN." },
  { id: "razorpay", name: "Razorpay", category: "Payment", icon: CreditCard, description: "Indian payment gateway integration." },
  { id: "stripe", name: "Stripe", category: "Payment", icon: CreditCard, description: "Global card payments." },
  { id: "zoom", name: "Zoom Meetings", category: "Communication", icon: Video, description: "Automated live class creation." },
  { id: "firebase", name: "Firebase", category: "Database", icon: Database, description: "Push notifications and real-time db." },
  { id: "twilio", name: "Twilio SMS", category: "Communication", icon: MessageSquare, description: "Send SMS notifications." },
  { id: "whatsapp", name: "WhatsApp API", category: "Communication", icon: MessageSquare, description: "WhatsApp business API messaging." },
  { id: "openai", name: "OpenAI", category: "AI", icon: Database, description: "GPT-4 powered course generation." },
  { id: "aws_s3", name: "AWS S3", category: "Media", icon: Cloud, description: "Secure cloud storage for assets." },
];

const CATEGORIES = ["All", "Auth", "Payment", "Communication", "Media", "AI", "Maps", "Database"];

export default function IntegrationsSettings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: dbIntegrations, mutate, isLoading } = SettingService.useApiCredentials();
  const [integrations, setIntegrations] = useState<any[]>([]);

  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [editForm, setEditForm] = useState({ status: false, api_key: '', api_secret: '', metadata: {} as any });
  
  const [isConnectionTesting, setIsConnectionTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Secret Viewing State
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (dbIntegrations) {
      const merged = INTEGRATIONS_METADATA.map(meta => {
        const dbCred = dbIntegrations.find((d: any) => d.provider === meta.id);
        return {
          ...meta,
          status: dbCred ? !!dbCred.status : false,
          api_key: dbCred ? dbCred.api_key : '',
          has_secret: dbCred ? dbCred.has_secret : false,
          metadata: dbCred && dbCred.metadata ? dbCred.metadata : {}
        };
      });
      setIntegrations(merged);
    }
  }, [dbIntegrations]);

  const openConfigure = (integration: any) => {
    setSelectedIntegration(integration);
    setEditForm({
      status: integration.status,
      api_key: integration.api_key || '',
      api_secret: '', // Empty initially because it's hidden
      metadata: integration.metadata || {}
    });
    setIsSecretVisible(false);
    setShowPasswordPrompt(false);
    setAdminPassword("");
  };

  const handleRevealSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await SettingService.showApiSecret(selectedIntegration.id, adminPassword);
      setEditForm(prev => ({
        ...prev,
        api_key: res.data.api_key,
        api_secret: res.data.api_secret
      }));
      setIsSecretVisible(true);
      setShowPasswordPrompt(false);
      toast.success('Secret revealed successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid password');
    } finally {
      setIsVerifying(false);
      setAdminPassword("");
    }
  };

  const handleTestConnection = async () => {
    setIsConnectionTesting(true);
    try {
      const res = await SettingService.testApiConnection(selectedIntegration.id);
      toast.success(res.data.message || "Connection successful!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Connection test failed.");
    } finally {
      setIsConnectionTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: any = {
        status: editForm.status,
        metadata: editForm.metadata
      };
      
      // Only send keys if they were actually modified (not masked)
      if (editForm.api_key && !editForm.api_key.includes('****')) {
        payload.api_key = editForm.api_key;
      }
      if (editForm.api_secret) {
        payload.api_secret = editForm.api_secret;
      }

      await SettingService.updateApiCredential(selectedIntegration.id, payload);
      toast.success(`${selectedIntegration.name} configuration saved!`);
      mutate(); // Refresh the list
      setSelectedIntegration(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Link2 className="w-6 h-6 text-indigo-600" />
            Integrations Manager
          </h1>
          <p className="text-gray-500 mt-1">
            Configure third-party APIs securely. Secrets are encrypted and hidden by default.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div 
                  key={integration.id}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      integration.status
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {integration.status ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{integration.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 h-10">{integration.description}</p>
                  
                  <button 
                    onClick={() => openConfigure(integration)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Configuration Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <selectedIntegration.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Configure {selectedIntegration.name}</h2>
                    <p className="text-sm text-gray-500">{selectedIntegration.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedIntegration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Integration</h4>
                    <p className="text-sm text-gray-500">Toggle to turn this integration on or off.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.checked})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key / Client ID
                    </label>
                    <input 
                      type="text"
                      placeholder="Enter API Key"
                      value={editForm.api_key}
                      onChange={e => setEditForm({...editForm, api_key: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between items-center">
                      <span>API Secret</span>
                      {selectedIntegration.has_secret && !isSecretVisible && !showPasswordPrompt && (
                        <button onClick={() => setShowPasswordPrompt(true)} className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                          <Eye size={12}/> Reveal Secret
                        </button>
                      )}
                      {isSecretVisible && (
                        <button onClick={() => {setIsSecretVisible(false); setEditForm({...editForm, api_secret: ''})}} className="text-xs text-slate-500 font-semibold flex items-center gap-1 hover:underline">
                          <EyeOff size={12}/> Hide Secret
                        </button>
                      )}
                    </label>
                    
                    {showPasswordPrompt ? (
                      <form onSubmit={handleRevealSecret} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock size={14} />
                        </div>
                        <input 
                          type="password"
                          autoFocus
                          placeholder="Admin Password"
                          value={adminPassword}
                          onChange={e => setAdminPassword(e.target.value)}
                          className="w-full pl-9 pr-16 py-2 border border-indigo-300 bg-indigo-50 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        />
                        <button type="submit" disabled={isVerifying} className="absolute inset-y-0 right-0 px-3 flex items-center bg-indigo-600 text-white text-xs font-bold rounded-r-lg hover:bg-indigo-700 disabled:opacity-50">
                          {isVerifying ? 'Wait...' : 'Verify'}
                        </button>
                      </form>
                    ) : (
                      <input 
                        type={isSecretVisible ? "text" : "password"}
                        placeholder={selectedIntegration.has_secret && !isSecretVisible ? "************************" : "Enter Secret Key"}
                        value={editForm.api_secret}
                        onChange={e => setEditForm({...editForm, api_secret: e.target.value})}
                        disabled={selectedIntegration.has_secret && !isSecretVisible}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 font-mono text-sm disabled:bg-gray-50 disabled:text-gray-400"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-2xl">
                <button 
                  onClick={handleTestConnection}
                  disabled={isConnectionTesting || !editForm.status}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50"
                  title={!editForm.status ? "Enable integration to test" : ""}
                >
                  {isConnectionTesting ? (
                    <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  Test Connection
                </button>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedIntegration(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSaving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
