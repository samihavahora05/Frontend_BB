import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Palette, 
  Upload, 
  Save, 
  Image as ImageIcon,
  Type,
  Layout,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

export default function BrandingSettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  const [brandingData, setBrandingData] = useState({
    primaryColor: "#4F46E5",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    fontFamily: "Inter, sans-serif",
    headingFont: "Outfit, sans-serif",
    logoLight: null,
    logoDark: null,
    favicon: null,
    preloaderEnabled: true,
    preloaderStyle: "spinner",
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Branding settings saved successfully!");
    }, 800);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Palette className="w-6 h-6 text-indigo-600" />
              Website Branding
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your website's colors, typography, and logos globally.
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 font-medium"
          >
            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Logos & Assets */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                Brand Assets
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Logo (Light)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 group-hover:text-indigo-600 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload logo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, SVG up to 2MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Logo (Dark)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-900 group">
                    <Upload className="w-6 h-6 mx-auto text-gray-500 group-hover:text-white mb-2" />
                    <p className="text-sm text-gray-400">Click to upload light logo for dark backgrounds</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Upload Favicon</p>
                      <p className="text-xs text-gray-400">.ICO or .PNG (32x32)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Colors & Typography */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                Theme Colors
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData({...brandingData, primaryColor: e.target.value})}
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-1"
                    />
                    <input 
                      type="text" 
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData({...brandingData, primaryColor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData({...brandingData, secondaryColor: e.target.value})}
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-1"
                    />
                    <input 
                      type="text" 
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData({...brandingData, secondaryColor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={brandingData.accentColor}
                      onChange={(e) => setBrandingData({...brandingData, accentColor: e.target.value})}
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-1"
                    />
                    <input 
                      type="text" 
                      value={brandingData.accentColor}
                      onChange={(e) => setBrandingData({...brandingData, accentColor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Type className="w-5 h-5 text-indigo-600" />
                Typography
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Font Family
                  </label>
                  <select 
                    value={brandingData.fontFamily}
                    onChange={(e) => setBrandingData({...brandingData, fontFamily: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Open Sans, sans-serif">Open Sans</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading Font Family
                  </label>
                  <select 
                    value={brandingData.headingFont}
                    onChange={(e) => setBrandingData({...brandingData, headingFont: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Outfit, sans-serif">Outfit</option>
                    <option value="Montserrat, sans-serif">Montserrat</option>
                    <option value="Playfair Display, serif">Playfair Display</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Layout className="w-5 h-5 text-indigo-600" />
                Pre-loader Settings
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enable Pre-loader
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={brandingData.preloaderEnabled}
                      onChange={(e) => setBrandingData({...brandingData, preloaderEnabled: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pre-loader Style
                  </label>
                  <select 
                    value={brandingData.preloaderStyle}
                    onChange={(e) => setBrandingData({...brandingData, preloaderStyle: e.target.value})}
                    disabled={!brandingData.preloaderEnabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="spinner">Spinner</option>
                    <option value="pulse">Logo Pulse</option>
                    <option value="dots">Bouncing Dots</option>
                    <option value="progress">Progress Bar</option>
                  </select>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
