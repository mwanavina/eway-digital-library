'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      return;
    }

    if (theme === 'dark') {
      setTheme('system');
      return;
    }

    setTheme('light');
  };

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      onClick={cycleTheme}
      className="inline-flex items-center justify-center p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'system' ? (
        <Monitor size={20} className="text-slate-700 dark:text-yellow-300" />
      ) : currentTheme === 'dark' ? (
        <Sun size={20} className="text-yellow-300" />
      ) : (
        <Moon size={20} className="text-slate-700 dark:text-yellow-300" />
      )}
    </button>
  );
}
