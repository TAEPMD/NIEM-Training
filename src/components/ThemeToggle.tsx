'use client';

import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const context = useContext(ThemeContext);
  const theme = context?.theme ?? 'system';
  const resolvedTheme = context?.resolvedTheme ?? 'light';
  const toggleTheme = context?.toggleTheme ?? (() => {});

  const getIcon = () => {
    if (theme === 'system') return <Monitor className="w-[18px] h-[18px]" strokeWidth={1.6} />;
    if (resolvedTheme === 'dark') return <Moon className="w-[18px] h-[18px]" strokeWidth={1.6} />;
    return <Sun className="w-[18px] h-[18px]" strokeWidth={1.6} />;
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    if (theme === 'dark') return 'Dark';
    return 'Light';
  };

  if (!mounted) {
    return (
      <div className="p-2" aria-hidden="true">
        <Monitor className="w-[18px] h-[18px] opacity-50" strokeWidth={1.6} />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
      aria-label={`Current theme: ${getLabel()}. Click to cycle.`}
      title={`Theme: ${getLabel()}`}
    >
      {getIcon()}
    </button>
  );
}
