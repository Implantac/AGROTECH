import React from 'react';

interface AgroTechLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const AgroTechIcon: React.FC<{
  size?: number;
  className?: string;
}> = ({
  size = 36,
  className = ''
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 select-none transition-transform duration-200 group-hover:scale-105 ${className}`}
    >
      <img
        src="/logo-emblem.png"
        alt="AGROTECH Emblem"
        width={size}
        height={size}
        className="w-full h-full object-contain filter drop-shadow-sm"
        onError={(e) => {
          // Fallback gracioso se imagem estática ainda estiver em cache
          const target = e.currentTarget;
          target.onerror = null;
          target.src = '/favicon.svg';
        }}
      />
    </div>
  );
};

export const AgroTechLogo: React.FC<AgroTechLogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
  showBadge = true
}) => {
  const iconSizes: Record<string, number> = {
    sm: 30,
    md: 40,
    lg: 48,
    xl: 60
  };

  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <AgroTechIcon size={iconSizes[size]} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      <AgroTechIcon size={iconSizes[size]} />

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-['Outfit',sans-serif] tracking-[-0.03em] font-extrabold text-[18px] sm:text-[21px] transition-colors ${
              isDark ? 'text-white' : 'text-[#1B4332]'
            }`}
          >
            AGRO
            <span className="text-[#22C55E] font-extrabold ml-[1px]">
              TECH
            </span>
          </span>

          {showBadge && (
            <span
              className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded transition-colors ${
                isDark
                  ? 'bg-[#183827] border border-[#22C55E]/30 text-[#86EFAC]'
                  : 'bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D]'
              }`}
            >
              OS
            </span>
          )}
        </div>

        {variant === 'full' && (
          <span
            className={`text-[9px] tracking-wide font-semibold mt-0.5 uppercase transition-colors ${
              isDark ? 'text-[#8DA697]' : 'text-[#52796F]'
            }`}
          >
            Sistema Operacional Rural
          </span>
        )}
      </div>
    </div>
  );
};

export default AgroTechLogo;
