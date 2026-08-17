import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  PhoneCall, Save, MessageSquare, Check, Power, Send
} from "lucide-react";
import toast from "react-hot-toast";

export default function WhatsAppSetupPage() {
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    provider: "meta",
    phoneNumberId: "",
    businessAccountId: "",
    accessToken: "",
    webhookVerifyToken: "",
    welcomeMessage: "Welcome to [App_Name]! We are glad to have you.",
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("WhatsApp settings saved successfully!");
    }, 800);
  };

  const handleTestMessage = () => {
    toast.success("Test message sent to your registered number!");
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-green-500" />
              WhatsApp Integration
            </h1>
            <p className="text-gray-500 mt-1">
              Configure WhatsApp Business API for automated messaging.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={handleTestMessage}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              <Send className="w-4 h-4" />
              Send Test
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 font-medium text-sm"
            >
              {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              Save Configuration
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Power className={`w-5 h-5 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  API Credentials
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className={`space-y-5 ${!isActive && 'opacity-50 pointer-events-none'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select 
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="meta">Meta Official API (Cloud API)</option>
                    <option value="twilio">Twilio WhatsApp API</option>
                    <option value="messagebird">MessageBird</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number ID
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 10123456789"
                      value={formData.phoneNumberId}
                      onChange={(e) => setFormData({...formData, phoneNumberId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Account ID
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 10456789012"
                      value={formData.businessAccountId}
                      onChange={(e) => setFormData({...formData, businessAccountId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permanent Access Token
                  </label>
                  <input 
                    type="password"
                    placeholder="EAAGm0PX4ZCQ..."
                    value={formData.accessToken}
                    onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Verify Token (For inbound messages)
                  </label>
                  <input 
                    type="text"
                    placeholder="my_secure_webhook_token"
                    value={formData.webhookVerifyToken}
                    onChange={(e) => setFormData({...formData, webhookVerifyToken: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                Default Messages
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welcome Message (Sent on new signup)
                </label>
                <textarea 
                  rows={4}
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-green-800 font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-green-700 mb-4">
                To get your Meta official WhatsApp API credentials, you need to create an app in the Meta Developer Portal.
              </p>
              <ul className="text-sm text-green-700 space-y-2 list-disc pl-4">
                <li>Go to developers.facebook.com</li>
                <li>Create an App (Business Type)</li>
                <li>Add WhatsApp Product</li>
                <li>Copy Phone Number ID & Token</li>
              </ul>
              <a href="#" className="inline-block mt-4 text-sm font-bold text-green-800 hover:underline">
                Read full guide &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
