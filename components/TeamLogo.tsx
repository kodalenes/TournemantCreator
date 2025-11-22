import React, { useState, useMemo } from 'react';

interface TeamLogoProps {
  url: string;
  name: string;
  colors: string;
  className?: string;
  showInitials?: boolean;
}

// Helper to map Turkish color names to CSS colors
const getColorCode = (colorName: string): string => {
  const map: Record<string, string> = {
    'sarı': '#FFD700',
    'kırmızı': '#DC2626',
    'lacivert': '#000080',
    'siyah': '#171717',
    'beyaz': '#F8FAFC',
    'bordo': '#800000',
    'mavi': '#2563EB',
    'yeşil': '#16A34A',
    'turuncu': '#F97316',
    'mor': '#7E22CE',
    'gök mavisi': '#0EA5E9',
    'eflatun': '#C084FC',
    'gri': '#64748B',
    'kahverengi': '#78350F'
  };
  
  if (!colorName) return '#94A3B8';
  const key = colorName.toLowerCase().trim();
  return map[key] || '#94A3B8'; // Default slate-400
};

export const TeamLogo: React.FC<TeamLogoProps> = ({ url, name, colors, className = "w-12 h-12", showInitials = true }) => {
  const [error, setError] = useState(false);

  // Parse colors for the fallback shield
  const { bg1, bg2, textCol } = useMemo(() => {
    // Split colors string like "Sarı Kırmızı"
    const parts = colors ? colors.split(' ').filter(c => c.length > 0) : [];
    const c1 = parts[0] ? getColorCode(parts[0]) : '#334155';
    const c2 = parts[1] ? getColorCode(parts[1]) : c1;
    
    // Determine text color (simple logic)
    const isDark = (color: string) => {
        return ['#000080', '#171717', '#800000', '#78350F', '#7E22CE', '#16A34A'].includes(color);
    };
    const txt = (isDark(c1) || isDark(c2)) ? '#F8FAFC' : '#1E293B';

    return { bg1: c1, bg2: c2, textCol: txt };
  }, [colors]);

  const initials = useMemo(() => {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }, [name]);

  // If no URL provided, force error state immediately
  if ((!url || url.trim() === '') && !error) {
      setError(true);
  }

  if (error) {
    return (
      <div className={`${className} relative flex items-center justify-center drop-shadow-md`} title={name}>
        {/* Dynamic SVG Shield */}
        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={`grad-${name?.replace(/\s/g, '')}-${bg1}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="45%" stopColor={bg1} />
                    <stop offset="55%" stopColor={bg2} />
                </linearGradient>
            </defs>
            <path 
                d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z" 
                fill={`url(#grad-${name?.replace(/\s/g, '')}-${bg1})`} 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="1"
            />
        </svg>
        {showInitials && (
            <span 
                className="absolute inset-0 flex items-center justify-center font-bold text-[10px] sm:text-xs"
                style={{ color: textCol, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
                {initials}
            </span>
        )}
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt={name} 
      className={`${className} object-contain drop-shadow-md transition-opacity duration-300`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};