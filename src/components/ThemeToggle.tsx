'use client';

import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  // Handle SSR - only render theme UI after mount on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use context directly with fallback for SSR (avoid throwing error)
  const context = useContext(ThemeContext);
  
  // Fallback values for SSR when context is not available
  const theme = context?.theme ?? 'system';
  const resolvedTheme = context?.resolvedTheme ?? 'light';
  const setTheme = context?.setTheme ?? (() => {});
  const toggleTheme = context?.toggleTheme ?? (() => {});

  const getIcon = () => {
    if (theme === 'system') return <Monitor className="w-4 h-4" />;
    if (resolvedTheme === 'dark') return <Moon className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    if (theme === 'dark') return 'Dark';
    return 'Light';
  };

  // Prevent hydration mismatch - render placeholder during SSR
  if (!mounted) {
    return (
      <div className="flex items-center gap-1" aria-hidden="true">
        <div className="p-2 rounded-full opacity-50">
          <Monitor className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 opacity-80 hover:opacity-100"
        aria-label={`Current theme: ${getLabel()}`}
      >
        {getIcon()}
      </button>
      
      {/* Dropdown for direct selection */}
      <div className="relative group">
        <button className="p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="absolute right-0 top-full mt-1 py-1 w-32 bg-white dark:bg-[#1c1c1e] rounded-xl shadow-lg border border-[var(--apple-border)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <button
            onClick={() => setTheme('light')}
            className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme === 'light' ? 'text-[var(--accent)]' : ''}`}
          >
            <Sun className="w-3.5 h-3.5" /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme === 'dark' ? 'text-[var(--accent)]' : ''}`}
          >
            <Moon className="w-3.5 h-3.5" /> Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme === 'system' ? 'text-[var(--accent)]' : ''}`}
          >
            <Monitor className="w-3.5 h-3.5" /> System
          </button>
        </div>
      </div>
    </div>
  );
}
