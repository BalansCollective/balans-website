/**
 * Theme Hook - Balans Dark Mode Integration
 * 
 * Provides theme state and toggle with:
 * - System preference detection
 * - Local storage persistence
 * - Time-aware auto-switching (21:00-07:00)
 * - Manual override support
 */

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getTimeBasedTheme(): ResolvedTheme {
  const hour = new Date().getHours();
  // Late night: Always dark (BalansAI aware!)
  if (hour >= 21 || hour < 7) {
    return 'dark';
  }
  // Otherwise: System preference
  return getSystemTheme();
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'auto') {
    return getTimeBasedTheme();
  }
  return theme;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('weaver-theme');
    return (stored as Theme) || 'auto';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme)
  );

  useEffect(() => {
    // Update resolved theme
    const newResolvedTheme = resolveTheme(theme);
    setResolvedTheme(newResolvedTheme);

    // Apply to document
    if (newResolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Persist to localStorage
    localStorage.setItem('weaver-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes (only matters if theme is 'auto')
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      setResolvedTheme(getTimeBasedTheme());
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  useEffect(() => {
    // Re-check time-based theme every hour (only matters if theme is 'auto')
    if (theme !== 'auto') return;

    const interval = setInterval(() => {
      setResolvedTheme(getTimeBasedTheme());
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    // Cycle through: light → dark → auto → light
    setThemeState((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'auto';
      return 'light';
    });
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}

