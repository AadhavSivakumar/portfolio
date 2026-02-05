import React from 'react';

interface GlassBadgeProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const GlassBadge: React.FC<GlassBadgeProps> = ({ children, className = '', onClick, style }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden
        px-5 py-2.5 rounded-xl
        bg-white/10 dark:bg-white/5 
        backdrop-blur-md backdrop-saturate-150
        border border-white/20 dark:border-white/10
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        text-sm font-medium text-primary
        hover:bg-white/20 dark:hover:bg-white/10
        hover:scale-105 active:scale-95
        transition-all duration-300 ease-out cursor-pointer pointer-events-auto
        ${className}
      `}
      style={style}
    >
        {children}
    </button>
  );
};

export default GlassBadge;