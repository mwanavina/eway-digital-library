'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDarkTheme = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkTheme ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
      aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDarkTheme ? (
        <Moon size={20} className="text-slate-700 dark:text-yellow-300" />
      ) : (
        <Sun size={20} className="text-yellow-300 dark:text-slate-700" />
      )}
    </button>
  );
}
