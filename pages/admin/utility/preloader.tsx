import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Loader, Save, RefreshCw, Upload, Smartphone, Monitor, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SettingService } from '../../../src/lib/api/admin/SettingService';

export default function PreloaderSettingsPage() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedType, setSelectedType] = useState('Blueboxx Logo Animation');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#1B2A6B');
  const [loadingText, setLoadingText] = useState('Preparing Your Learning Experience...');
  const [animationSpeed, setAnimationSpeed] = useState('Medium');
  const [previewMode, setPreviewMode] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [isSaving, setIsSaving] = useState(false);

  const { data: settingsData, isLoading } = SettingService.useSystemSettings('preloader');

  React.useEffect(() => {
    if (settingsData) {
      if (settingsData.isEnabled !== undefined) setIsEnabled(settingsData.isEnabled === 'true');
      if (settingsData.selectedType) setSelectedType(settingsData.selectedType);
      if (settingsData.bgColor) setBgColor(settingsData.bgColor);
      if (settingsData.accentColor) setAccentColor(settingsData.accentColor);
      if (settingsData.loadingText !== undefined) setLoadingText(settingsData.loadingText);
      if (settingsData.animationSpeed) setAnimationSpeed(settingsData.animationSpeed);
    }
  }, [settingsData]);

  const preloaderTypes = [
    'Blueboxx Logo Animation', 'Circular Spinner', 'Progress Bar',
    'Gradient Pulse', 'Book Opening Animation', 'Graduation Cap Animation',
    'AI Neural Network Animation', 'Orbit Loader', 'Cube Rotation',
    'Dot Loader', 'Minimal Fade'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SettingService.updateSystemSettings('preloader', {
        isEnabled: isEnabled ? 'true' : 'false',
        selectedType,
        bgColor,
        accentColor,
        loadingText,
        animationSpeed
      });
      toast.success('Preloader settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save preloader settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setIsEnabled(true);
    setSelectedType('Blueboxx Logo Animation');
    setBgColor('#ffffff');
    setAccentColor('#1B2A6B');
    setLoadingText('Preparing Your Learning Experience...');
    setAnimationSpeed('Medium');
    toast.success('Settings reset to default');
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Preloader Settings | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Preloader Settings</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Configure the loading animation shown to users before the app loads.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={16} /> Reset
          </button>
          <button onClick={handleSave} disabled={isSaving || isLoading} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-70">
            {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />} Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Settings Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Loader size={18} className="text-[#C9A227]"/> Configuration
            </h2>
            <label className="flex items-center cursor-pointer gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isEnabled ? 'Enabled' : 'Disabled'}</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isEnabled ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
          
          <div className={`p-6 flex-1 overflow-y-auto admin-scrollbar space-y-6 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            
            {/* Preloader Type */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Preloader Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {preloaderTypes.map(type => (
                  <button 
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold border transition-all ${selectedType === type ? 'border-[#1B2A6B] bg-blue-50 text-[#1B2A6B] shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            {/* Custom Logo Upload */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Custom Logo Upload</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-bold text-slate-800">Click to upload or drag and drop</p>
                <p className="text-xs font-semibold text-slate-400 mt-1">SVG, PNG, or GIF (max. 2MB)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Colors */}
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Background Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 p-0.5 border border-slate-200 rounded cursor-pointer" />
                  <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-10 h-10 p-0.5 border border-slate-200 rounded cursor-pointer" />
                  <input type="text" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Loading Text</label>
              <input type="text" value={loadingText} onChange={e => setLoadingText(e.target.value)} placeholder="e.g. Preparing Your Learning Experience..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
            </div>

            {/* Animation Speed */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Animation Speed</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Slow', 'Medium', 'Fast'].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => setAnimationSpeed(speed)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${animationSpeed === speed ? 'bg-white text-[#1B2A6B] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-200px)] relative">
          <div className="absolute top-4 left-4 z-10 flex bg-slate-800/80 backdrop-blur p-1 rounded-lg border border-slate-700">
            <button onClick={() => setPreviewMode('Desktop')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'Desktop' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}><Monitor size={16}/></button>
            <button onClick={() => setPreviewMode('Mobile')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'Mobile' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}><Smartphone size={16}/></button>
          </div>
          
          <div className="absolute top-4 right-4 z-10 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Preview
          </div>

          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-slate-950 pattern-grid">
            {/* The actual simulated frame */}
            <div 
              style={{ backgroundColor: bgColor }} 
              className={`relative overflow-hidden flex flex-col items-center justify-center shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${previewMode === 'Desktop' ? 'w-full h-full rounded-xl max-w-2xl max-h-96' : 'w-[320px] h-[600px] rounded-[2rem] border-8 border-slate-800'}`}
            >
              {isEnabled ? (
                <>
                  {/* Mock Animation based on Speed & Type */}
                  <div className="relative mb-8 flex justify-center items-center h-24 w-full">
                    
                    {selectedType === 'Blueboxx Logo Animation' && (
                      <div className="relative w-28 h-28 flex items-center justify-center perspective-[800px]">
                        {/* Outer Glow & Spinning Rings */}
                        <div className={`absolute inset-0 rounded-2xl border-2 border-[#C9A227]/30 ${animationSpeed === 'Fast' ? 'animate-[spin_1s_linear_infinite]' : animationSpeed === 'Slow' ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_2.5s_linear_infinite]'}`}></div>
                        <div className={`absolute inset-2 rounded-xl border-t-2 border-l-2 border-[#1B2A6B] ${animationSpeed === 'Fast' ? 'animate-[spin_0.5s_linear_infinite_reverse]' : animationSpeed === 'Slow' ? 'animate-[spin_3s_linear_infinite_reverse]' : 'animate-[spin_1.5s_linear_infinite_reverse]'}`}></div>
                        <div className="absolute inset-0 bg-[#C9A227]/10 rounded-2xl animate-pulse blur-xl"></div>
                        
                        {/* Core Logo Container */}
                        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-[#1B2A6B] to-[#0f173b] rounded-xl shadow-2xl flex items-center justify-center border border-[#1B2A6B]/50 overflow-hidden group">
                           {/* Shine effect */}
                           <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                           <div className="text-[#C9A227] font-black text-3xl italic tracking-tighter drop-shadow-lg">B</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedType === 'Circular Spinner' && (
                      <div style={{ borderTopColor: accentColor }} className={`w-16 h-16 border-4 border-slate-200 rounded-full ${animationSpeed === 'Fast' ? 'animate-[spin_0.5s_linear_infinite]' : animationSpeed === 'Slow' ? 'animate-[spin_1.5s_linear_infinite]' : 'animate-[spin_1s_linear_infinite]'}`}></div>
                    )}

                    {selectedType === 'Progress Bar' && (
                      <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full animate-pulse" style={{ backgroundColor: accentColor, width: '60%', animationDuration: animationSpeed === 'Fast' ? '0.5s' : animationSpeed === 'Slow' ? '2s' : '1s' }}></div>
                      </div>
                    )}

                    {selectedType === 'Gradient Pulse' && (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1B2A6B] to-[#C9A227] animate-pulse" style={{ animationDuration: animationSpeed === 'Fast' ? '0.5s' : animationSpeed === 'Slow' ? '2s' : '1s' }}></div>
                    )}

                    {selectedType === 'Book Opening Animation' && (
                      <div className="relative w-16 h-12 flex justify-center perspective-[500px]">
                        <div style={{ backgroundColor: accentColor }} className="w-1/2 h-full rounded-l-md origin-right animate-[ping_2s_ease-in-out_infinite] opacity-80"></div>
                        <div style={{ backgroundColor: accentColor }} className="w-1/2 h-full rounded-r-md"></div>
                      </div>
                    )}

                    {selectedType === 'Graduation Cap Animation' && (
                      <div className={`text-[#1B2A6B] ${animationSpeed === 'Fast' ? 'animate-[bounce_0.5s_infinite]' : animationSpeed === 'Slow' ? 'animate-[bounce_1.5s_infinite]' : 'animate-[bounce_1s_infinite]'}`}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      </div>
                    )}

                    {selectedType === 'AI Neural Network Animation' && (
                      <div className={`flex gap-2 items-center ${animationSpeed === 'Fast' ? 'animate-[pulse_0.5s_ease-in-out_infinite]' : animationSpeed === 'Slow' ? 'animate-[pulse_2s_ease-in-out_infinite]' : 'animate-[pulse_1s_ease-in-out_infinite]'}`}>
                        <div style={{ backgroundColor: accentColor }} className="w-4 h-4 rounded-full"></div>
                        <div className="w-6 h-0.5 bg-slate-300"></div>
                        <div className="flex flex-col gap-2">
                          <div style={{ backgroundColor: accentColor }} className="w-4 h-4 rounded-full"></div>
                          <div style={{ backgroundColor: accentColor }} className="w-4 h-4 rounded-full"></div>
                        </div>
                        <div className="w-6 h-0.5 bg-slate-300"></div>
                        <div style={{ backgroundColor: accentColor }} className="w-4 h-4 rounded-full"></div>
                      </div>
                    )}

                    {selectedType === 'Orbit Loader' && (
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div style={{ backgroundColor: accentColor }} className="w-4 h-4 rounded-full absolute"></div>
                        <div style={{ borderColor: accentColor }} className={`absolute inset-0 border-2 border-dashed rounded-full ${animationSpeed === 'Fast' ? 'animate-[spin_1s_linear_infinite]' : animationSpeed === 'Slow' ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_2s_linear_infinite]'}`}></div>
                      </div>
                    )}

                    {selectedType === 'Cube Rotation' && (
                      <div style={{ backgroundColor: accentColor }} className={`w-12 h-12 ${animationSpeed === 'Fast' ? 'animate-[spin_0.5s_linear_infinite]' : animationSpeed === 'Slow' ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_1s_linear_infinite]'}`}></div>
                    )}

                    {selectedType === 'Dot Loader' && (
                      <div className="flex gap-2">
                        <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0s', animationDuration: animationSpeed === 'Fast' ? '0.5s' : animationSpeed === 'Slow' ? '1.5s' : '1s' }}></div>
                        <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0.15s', animationDuration: animationSpeed === 'Fast' ? '0.5s' : animationSpeed === 'Slow' ? '1.5s' : '1s' }}></div>
                        <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0.3s', animationDuration: animationSpeed === 'Fast' ? '0.5s' : animationSpeed === 'Slow' ? '1.5s' : '1s' }}></div>
                      </div>
                    )}

                    {selectedType === 'Minimal Fade' && (
                      <div className="w-12 h-12 rounded opacity-50 animate-pulse" style={{ backgroundColor: accentColor, animationDuration: animationSpeed === 'Fast' ? '0.5s' : animationSpeed === 'Slow' ? '2s' : '1s' }}></div>
                    )}

                  </div>
                  
                  {loadingText && (
                    <p style={{ color: accentColor }} className="text-sm font-black tracking-wide text-center px-6 animate-pulse">
                      {loadingText}
                    </p>
                  )}
                  
                  <p className="text-[10px] font-bold text-slate-400 mt-4 px-6 text-center">
                    Type: {selectedType}
                  </p>
                </>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Loader size={32} className="mx-auto mb-2 opacity-50"/>
                  <p className="text-sm font-bold">Preloader is Disabled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Pattern CSS for Preview */}
      <style>{`
        .pattern-grid {
          background-image: linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </AdminDashboardLayout>
  );
}
