'use client';

import { Home, Search, Download, User } from 'lucide-react';

interface BottomNavProps {
  activeTab?: 'browse' | 'search' | 'downloads' | 'account';
  onTabChange?: (tab: string) => void;
}

export function BottomNav({ activeTab = 'browse', onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'browse', label: 'Browse', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 border-t-2 border-blue-600 -mt-2 pt-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent size={20} className="mb-1" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
