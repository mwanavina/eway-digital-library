'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDarkTheme = currentTheme === 'dark';

  const handleSelectTheme = (value: 'light' | 'dark') => {
    setTheme(value);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <button
          className="inline-flex items-center justify-center p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
          aria-label="Select theme"
          title="Select theme"
        >
          {isDarkTheme ? (
            <Moon size={20} className="text-slate-700 dark:text-yellow-300" />
          ) : (
            <Sun size={20} className="text-yellow-300 dark:text-slate-700" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-36 p-2" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant={theme === 'light' ? 'default' : 'ghost'}
            size="sm"
            className="justify-start"
            onClick={() => handleSelectTheme('light')}
          >
            <Sun size={16} className="mr-2" />
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'ghost'}
            size="sm"
            className="justify-start"
            onClick={() => handleSelectTheme('dark')}
          >
            <Moon size={16} className="mr-2" />
            Dark
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
