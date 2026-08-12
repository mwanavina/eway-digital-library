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
      'flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm ring-1 ring-white/30 transition-transform hover:scale-[1.03] md:h-12 md:w-12',
    image: 'h-full w-full object-contain',
    width: 64,
    height: 64,
    sizes: '48px',
    priority: true,
  },
  admin: {
    container:
      'flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700',
    image: 'h-full w-full object-contain',
    width: 64,
    height: 64,
    sizes: '44px',
    priority: true,
  },
  auth: {
    container:
      'flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-lg shadow-[#1782C5]/10 ring-1 ring-[#1782C5]/15 sm:h-28 sm:w-28 sm:p-2.5 md:h-32 md:w-32 dark:bg-slate-900 dark:shadow-slate-950/40 dark:ring-[#1782C5]/25',
    image: 'h-full w-full object-contain',
    width: 128,
    height: 128,
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
        width={config.width}
        height={config.height}
        priority={config.priority}
        sizes={config.sizes}
        className={config.image}
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
