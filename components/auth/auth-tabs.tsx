"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/sign-up", label: "Create Account" },
  { href: "/sign-in", label: "Sign In" },
];

export function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-7 flex border-b-2 border-border">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex-1 border-b-2 pb-2.5 text-center text-sm font-semibold tracking-wide transition-colors -mb-0.5",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
