'use client';

import { useState } from 'react';
import { Menu, Search, Settings, User } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  onMenuClick?: () => void;
  activeFilterCount?: number;
}

export function Header({ onSearchChange, onMenuClick, activeFilterCount = 0 }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1782C5] text-white shadow-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Menu and Logo */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-[#1F2557] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EDD899] text-[#1F2557] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EDD899] rounded-full flex items-center justify-center font-bold text-[#1F2557]">
              M
            </div>
            <h1 className="hidden md:block text-lg font-bold">Eway</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4 md:mx-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-opacity-80 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search courses, materials..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:bg-opacity-40 transition-all cursor-text"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeSwitcher />
          <button
            className="p-2 hover:bg-[#1F2557] rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <button
            className="p-2 hover:bg-[#1F2557] rounded-lg transition-colors"
            aria-label="User profile"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
