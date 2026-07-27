'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, LogOut, UserCircle2, BarChart3 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AdminHeaderProps {
  onSignOut: () => void;
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

export function AdminHeader({ onSignOut, userSession }: AdminHeaderProps & { userSession: UserSessionProps }) {
  return (
    <header className="bg-white shadow-sm dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1782C5] to-[#1F2557] p-1.5 shadow-sm">
            <Image
              src="/eway-logo.png"
              alt="Eway Library Logo"
              width={40}
              height={40}
              priority
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">Eway Library Admin</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Control center</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 md:flex"
          >
            <Home size={16} />
            <span className="hidden lg:inline">Home</span>
          </Link>
          <ThemeSwitcher />
          <Popover>
            <PopoverTrigger
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="Admin profile"
            >
              {userSession.user.image ? (
                <Image
                  src={userSession.user.image}
                  alt="Admin profile"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <UserCircle2 size={18} />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <PopoverHeader className="space-y-1">
                <PopoverTitle>Admin Account</PopoverTitle>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userSession.user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userSession.user.email}</p>
                <PopoverDescription>Manage your account and preferences.</PopoverDescription>
              </PopoverHeader>
              <div className="mt-3 flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/account">View Account</Link>
                </Button>
                <Button onClick={onSignOut} variant="destructive" className="w-full">
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
