import React from 'react';

interface PreloaderAnimationProps {
  selectedType?: string;
  animationSpeed?: string;
  accentColor?: string;
  bgColor?: string;
  loadingText?: string;
}

export const PreloaderAnimation = ({ 
  selectedType = 'Blueboxx Logo Animation', 
  animationSpeed = 'Normal (Default)', 
  accentColor = '#1B2A6B', 
  bgColor = '#ffffff', 
  loadingText = 'Loading...' 
}: PreloaderAnimationProps) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-all duration-500 w-full h-full"
    >
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
          <div style={{ color: accentColor }} className={`${animationSpeed === 'Fast' ? 'animate-[bounce_0.5s_infinite]' : animationSpeed === 'Slow' ? 'animate-[bounce_1.5s_infinite]' : 'animate-[bounce_1s_infinite]'}`}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
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

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
};
