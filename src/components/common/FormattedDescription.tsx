import React from 'react';
import { CheckCircle2, Sparkles, Target, Layers, HelpCircle, ArrowRight } from 'lucide-react';

interface FormattedDescriptionProps {
  content?: string;
  className?: string;
}

export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return <p className="text-slate-500 font-medium italic">Detailed description coming soon.</p>;
  }

  const raw = content.trim();

  // Check if content is already formatted HTML (e.g. contains <p>, <br>, <ul>, <h3>, etc.)
  const hasHtmlTags = /<\/?(p|div|ul|ol|li|h[1-6]|br|table|span|strong|em)\b[^>]*>/i.test(raw);

  if (hasHtmlTags) {
    return (
      <div 
        className={`prose prose-slate max-w-none prose-headings:font-bold prose-a:text-[#1B2A6B] prose-img:rounded-2xl ${className}`}
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }

  // Parse plain text with newlines, section headings, and bullet points
  const lines = raw.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentBullets: string[] = [];
  let bulletIndex = 0;

  const flushBullets = () => {
    if (currentBullets.length === 0) return;
    const bulletsToRender = [...currentBullets];
    const key = `bullet-group-${bulletIndex++}`;
    currentBullets = [];

    // If there are multiple bullets, render as a responsive modern 2-column grid
    elements.push(
      <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
        {bulletsToRender.map((b, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold text-slate-700 leading-snug">{b}</span>
          </div>
        ))}
      </div>
    );
  };

  const getHeaderIcon = (headerText: string) => {
    const lower = headerText.toLowerCase();
    if (lower.includes('learn') || lower.includes('outcome')) return <Sparkles size={18} className="text-[#C9A227]" />;
    if (lower.includes('project') || lower.includes('build')) return <Layers size={18} className="text-[#1B2A6B]" />;
    if (lower.includes('who') || lower.includes('audience') || lower.includes('for?')) return <HelpCircle size={18} className="text-blue-600" />;
    return <Target size={18} className="text-[#1B2A6B]" />;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushBullets();
      return;
    }

    // Check if line is a bullet item (starts with •, -, *, or numbered like 1.)
    const bulletMatch = trimmed.match(/^([•\-\*]|\d+\.)\s*(.*)$/);
    if (bulletMatch) {
      currentBullets.push(bulletMatch[2]);
      return;
    }

    // Check if line is a workflow chain like "Learn → Build → Test → Debug → Improve → Deploy"
    if (trimmed.includes('→') || trimmed.includes('->')) {
      flushBullets();
      const steps = trimmed.split(/→|->/).map(s => s.trim()).filter(Boolean);
      elements.push(
        <div key={`workflow-${idx}`} className="my-4 p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((step, sIdx) => (
              <React.Fragment key={sIdx}>
                <span className="px-3 py-1.5 bg-white text-[#1B2A6B] font-black text-xs rounded-lg shadow-xs border border-blue-200/60 uppercase tracking-wide">
                  {step}
                </span>
                {sIdx < steps.length - 1 && (
                  <ArrowRight size={14} className="text-blue-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
      return;
    }

    // Check if line is a major Section Heading (e.g. ALL CAPS or ends with a colon, and relatively short)
    const isHeading = 
      (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 80 && /[A-Z]/.test(trimmed)) ||
      (trimmed.endsWith(':') && trimmed.length < 60) ||
      /^(what you will learn|projects included|who is this course for\??|practical learning|final outcome|learning approach|prerequisites|requirements)/i.test(trimmed);

    if (isHeading) {
      flushBullets();
      const cleanHeader = trimmed.replace(/:$/, '');
      elements.push(
        <div key={`heading-${idx}`} className="mt-8 mb-3 pt-2">
          <h3 className="text-base sm:text-lg font-black text-[#0d1635] tracking-tight flex items-center gap-2.5 border-l-4 border-[#1B2A6B] pl-3 py-0.5">
            {getHeaderIcon(cleanHeader)}
            <span>{cleanHeader}</span>
          </h3>
        </div>
      );
      return;
    }

    // Standard paragraph line
    flushBullets();
    elements.push(
      <p key={`p-${idx}`} className="text-slate-600 text-[15px] font-medium leading-relaxed mb-3">
        {trimmed}
      </p>
    );
  });

  flushBullets();

  return (
    <div className={`space-y-1 ${className}`}>
      {elements}
    </div>
  );
};
