'use client';

import { useState } from 'react';
import { Search, Settings, User, Sliders, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from './theme-switcher';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { signOut } from '@/lib/auth/sign-in';
import { authClient } from '@/lib/auth-client';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

export function Header({ onSearchChange, onMenuClick, onSearchClick, onFilterClick }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions:{
        onSuccess: () => {
          // setSigningOut(false);
          router.push('/sign-in');
        },
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1782C5] dark:bg-slate-900 text-white shadow-md dark:shadow-slate-950">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[#EDD899] rounded-full flex items-center justify-center font-bold text-[#1F2557] text-sm">
            <Image src="/eway-logo.png" alt="Eway Library Logo" width={28} height={28} />
          </div>
          <h1 className="hidden sm:block text-sm md:text-base font-bold">Eway Library</h1>
        </div>

        {/* Right Icons - Search, Filter, Settings, User */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Dashboard Button - Desktop Only */}
          <Link
            href="/dashboard"
            className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-[#1F2557] dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Dashboard"
          >
            <BarChart3 size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          {/* Admin Dashboard Button - Desktop Only */}
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-[#1F2557] dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Admin"
          >
            <Shield size={18} />
            <span className="text-sm font-medium">Admin</span>
          </Link>

          {/* Search Button - Mobile */}
          <button
            onClick={onSearchClick}
            className="md:hidden p-2 hover:bg-[#1F2557] dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Open search"
          >
            <Search size={18} />
          </button>

          {/* Search Button with Label - Desktop */}
          <button
            onClick={onSearchClick}
            className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-[#1F2557] dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Open search"
          >
            <Search size={18} />
            <span className="text-sm font-medium">Search</span>
          </button>

          {/* Filter Button - Mobile Only */}
          <button
            onClick={onFilterClick}
            className="md:hidden p-2 hover:bg-[#1F2557] dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Open filters"
          >
            <Sliders size={18} />
          </button>

          <ThemeSwitcher />
          
          {/* Settings Button - Desktop Only with Link */}
          <Link
            href="/settings"
            className="hidden md:flex p-2 hover:bg-[#1F2557] dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </Link>

          {/* User Profile Button - Desktop Only with Popover */}
          <Popover>
            <PopoverTrigger
              type="button"
              className="hidden md:flex p-2 hover:bg-[#1F2557] dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <User size={18} />
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <PopoverHeader className="space-y-1">
                <PopoverTitle>Account</PopoverTitle>
                <PopoverDescription>
                  Manage your profile or sign out.
                </PopoverDescription>
              </PopoverHeader>

              <div className="mt-3 flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/account">Go to account</Link>
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full"
                >
                  Sign out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
