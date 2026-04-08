import React from 'react';
import { Link } from 'react-router-dom';

const BrandMark = ({
  className = '',
  theme = 'dark',
  to,
}) => {
  const textColor = theme === 'light' ? 'text-white' : 'text-slate-900';
  const subtextColor = theme === 'light' ? 'text-white/65' : 'text-slate-500';
  const ringColor = theme === 'light' ? 'border-white/30 bg-white/10' : 'border-slate-900/10 bg-white/80';
  const innerColor = theme === 'light' ? 'bg-white' : 'bg-slate-900';

  const content = (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm backdrop-blur ${ringColor}`}>
        <span className={`absolute h-5 w-5 rounded-full ${innerColor}`} />
        <span className="absolute h-8 w-8 rounded-2xl border border-emerald-400/60" />
      </span>
      <span className="flex flex-col">
        <span className={`text-xl font-semibold tracking-[0.16em] uppercase ${textColor}`}>Fastride</span>
        <span className={`text-[10px] uppercase tracking-[0.32em] ${subtextColor}`}>City mobility</span>
      </span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};

export default BrandMark;
