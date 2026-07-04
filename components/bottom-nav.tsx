'use client';

import { Home, Search, Bookmark, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BottomNavProps {
  activeTab?: 'browse' | 'search' | 'bookmarks' | 'account';
  onTabChange?: (tab: string) => void;
}

interface UserSessionProps {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
}

export function BottomNav({ activeTab = 'browse', onTabChange, UserSession }: BottomNavProps & { UserSession?: UserSessionProps }) {
  const currentUser = UserSession?.user;
  const tabs = [
    { id: 'browse', label: 'Browse', icon: Home, href: '/' },
    { id: 'search', label: 'Search', icon: Search, href: '/search' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
    { id: 'account', label: 'Account', icon: User, href: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 md:hidden z-30">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs font-semibold transition-colors relative ${
                isActive
                  ? 'text-[#1782C5] dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <div className="relative">
                {tab.id === 'account' && currentUser?.image ? (
                  <Image
                    src={currentUser.image}
                    alt="User profile"
                    width={24}
                    height={24}
                    className="mb-0.5 h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <IconComponent size={24} className="mb-0.5" />
                )}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#1782C5] dark:bg-blue-400 rounded-full"></div>
                )}
              </div>
              <span className="line-clamp-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
