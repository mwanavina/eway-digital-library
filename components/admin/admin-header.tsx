'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, LogOut, UserCircle2 } from 'lucide-react';
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
    <header className="border-b border-slate-200/70 bg-[#1782C5] text-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 p-1.5 shadow-sm">
            <Image
              src="/eway-logo.png"
              alt="Eway Library Logo"
              width={40}
              height={40}
              priority
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <p className="text-base font-semibold">Eway Library</p>
            <p className="text-xs text-blue-100">Admin control center</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 sm:flex"
          >
            <Home size={16} />
            Back to app
          </Link>
          <ThemeSwitcher />
          <Popover>
            <PopoverTrigger
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-2 transition-colors hover:bg-white/20"
              aria-label="Admin profile"
            >
              {/* // Display user image if available, otherwise show a default icon */}
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
                <PopoverTitle>Admin account</PopoverTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userSession.user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userSession.user.email}</p>
                <PopoverDescription>Manage your workspace and sign out safely.</PopoverDescription>
              </PopoverHeader>
              <div className="mt-3 flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/account">View account</Link>
                </Button>
                <Button onClick={onSignOut} variant="destructive" className="w-full">
                  <LogOut size={16} className="mr-2" />
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
