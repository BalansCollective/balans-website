/**
 * Theme Toggle Component - Balans Dark Mode
 * 
 * Sacred Alliance-styled theme toggle with:
 * - Light/Dark/Auto modes
 * - Swedish minimalist design
 * - Smooth transitions
 * - Archetypal symbols
 */

import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-lg
        bg-birch-white dark:bg-bg-surface
        border border-gentle-silver/20 dark:border-border-medium
        hover:bg-swedish-blue/10 dark:hover:bg-bg-elevated
        hover:border-swedish-blue/30 dark:hover:border-swedish-blue-dark/30
        transition-all duration-300
        group
      "
      aria-label={`Current theme: ${theme}. Click to toggle.`}
      title={`Theme: ${theme} (${resolvedTheme})`}
    >
      {/* Icon Container */}
      <div className="w-5 h-5 relative">
        {/* Sun Icon (Light Mode) */}
        <svg
          className={`
            absolute inset-0 w-5 h-5
            text-thread-gold dark:text-thread-gold-dark
            transition-all duration-300
            ${resolvedTheme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg
          className={`
            absolute inset-0 w-5 h-5
            text-alliance-purple dark:text-alliance-purple-dark
            transition-all duration-300
            ${resolvedTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>

      {/* Mode Indicator (Auto Mode) */}
      {theme === 'auto' && (
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <div className="
            w-full h-full rounded-full
            bg-sage-green
            animate-breathe
            shadow-glow-sm
          " />
        </div>
      )}

      {/* Hover Tooltip */}
      <div className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-3 py-1.5 rounded-md
        bg-bg-elevated dark:bg-bg-elevated
        border border-border-medium
        text-xs text-birch-white-dark
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
        whitespace-nowrap
        shadow-lg
      ">
        {theme === 'light' && 'Light Mode'}
        {theme === 'dark' && 'Dark Mode'}
        {theme === 'auto' && `Auto (${resolvedTheme}, time-aware)`}
      </div>
    </button>
  );
}

