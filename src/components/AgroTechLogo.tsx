import React from 'react';

interface AgroTechLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const AgroTechIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-label="AGROTECH Logo"
    >
      <defs>
        {/* Gradiente de fundo do escudo */}
        <linearGradient id="agroBgGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B301E" />
          <stop offset="50%" stopColor="#114B2B" />
          <stop offset="100%" stopColor="#062013" />
        </linearGradient>

        {/* Gradiente da folha principal (Brotamento Tecnológico) */}
        <linearGradient id="agroLeafGrad" x1="16" y1="8" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Gradiente da folha secundária / broto */}
        <linearGradient id="agroSproutGrad" x1="22" y1="12" x2="38" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Gradiente das curvas de nível / sulcos de solo (Terra Fértil & Precisão) */}
        <linearGradient id="agroContourGrad" x1="10" y1="28" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
        </linearGradient>

        {/* Gradiente do Ponto Focal de Telemetria / Grão Dourado */}
        <linearGradient id="agroGoldGrad" x1="22" y1="6" x2="26" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>

        {/* Sombra sutil de profundidade */}
        <filter id="agroDropShadow" x="0" y="2" width="48" height="48" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#041E11" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Escudo / Base Geométrica Moderna */}
      <rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="13"
        fill="url(#agroBgGrad)"
        stroke="#22C55E"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        filter="url(#agroDropShadow)"
      />

      {/* Curvas de Nível Geodésicas do Talhão (Linhas Topográficas de Precisão) */}
      <path
        d="M8 35.5C12.5 31.8 19 31.2 24.5 33.2C29.5 35 34.5 34.2 40 31"
        stroke="url(#agroContourGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 40C15 36.8 21.5 36.2 27 38C31 39.3 35.5 39 38 37.5"
        stroke="url(#agroContourGrad)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.65"
      />

      {/* Folha Principal / Lâmina de Trigo & Silício */}
      <path
        d="M24 9C24 9 14 18 14 27C14 31.5 17.5 35 22 35C22.6 35 23.2 34.9 23.8 34.8C23.9 31.5 24.8 24 28 19C28 19 25 14 24 9Z"
        fill="url(#agroLeafGrad)"
      />

      {/* Folha Direita / Broto Conectado com Curvatura de Satélite */}
      <path
        d="M24 13C25.5 16 28 19 33 20C34.5 20.3 35.5 21.8 35 23.5C34.2 26 31.8 28.5 28.5 29C28.2 26 27.5 20.5 24 17V13Z"
        fill="url(#agroSproutGrad)"
        fillOpacity="0.95"
      />

      {/* Nervura Central Inteligente (Barramento de Dados em Fibra / Seiva) */}
      <path
        d="M24 12V34.5"
        stroke="#ECFDF5"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      {/* Ponto de Telemetria / Semente Dourada no Ápice */}
      <circle
        cx="24"
        cy="8.5"
        r="2"
        fill="url(#agroGoldGrad)"
        stroke="#FEF08A"
        strokeWidth="0.8"
      />
    </svg>
  );
};

export const AgroTechLogo: React.FC<AgroTechLogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
  showBadge = true
}) => {
  const isDark = theme === 'dark';

  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 52
  };

  const textSizes = {
    sm: 'text-sm tracking-tight',
    md: 'text-base sm:text-lg tracking-tight',
    lg: 'text-xl sm:text-2xl tracking-tight',
    xl: 'text-2xl sm:text-3xl tracking-tight'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs'
  };

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
            className={`font-black font-display font-sans ${textSizes[size]} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            AGRO<span className="text-emerald-500 font-extrabold">TECH</span>
          </span>

          {showBadge && (
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                isDark
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300/80'
              }`}
            >
              OS
            </span>
          )}
        </div>

        {variant === 'full' && (
          <span
            className={`font-semibold tracking-wider uppercase mt-0.5 ${subSizes[size]} ${
              isDark ? 'text-emerald-400/80' : 'text-emerald-700'
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
