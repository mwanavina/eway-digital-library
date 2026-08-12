import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const LOGO_SRC = '/ewaylogo.png';
export const LOGO_ALT = 'e-way Digital Library';

type BrandLogoVariant = 'header' | 'admin' | 'auth';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  href?: string;
}

const variantConfig = {
  header: {
    container:
      'relative h-11 w-11 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-white/30 transition-transform hover:scale-[1.03] md:h-12 md:w-12 dark:ring-slate-600/40',
    sizes: '48px',
    priority: true,
  },
  admin: {
    container:
      'relative h-11 w-11 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-600/50',
    sizes: '44px',
    priority: true,
  },
  auth: {
    container:
      'relative h-24 w-24 overflow-hidden rounded-full bg-white sm:h-28 sm:w-28 md:h-32 md:w-32',
    sizes: '(max-width: 640px) 96px, (max-width: 768px) 112px, 128px',
    priority: true,
  },
} as const;

export function BrandLogo({ variant = 'header', className, href }: BrandLogoProps) {
  const config = variantConfig[variant];
  const linkHref = href ?? (variant === 'header' ? '/' : variant === 'admin' ? '/admin' : undefined);

  const logo = (
    <div className={cn(config.container, className)}>
      <Image
        src={LOGO_SRC}
        alt={LOGO_ALT}
        fill
        priority={config.priority}
        sizes={config.sizes}
        className="rounded-full bg-white object-contain p-1 sm:p-1.5"
      />
    </div>
  );

  if (linkHref) {
    return (
      <Link
        href={linkHref}
        className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1782C5] dark:focus-visible:ring-offset-slate-900"
        aria-label={LOGO_ALT}
      >
        {logo}
      </Link>
    );
  }

  return logo;
}
