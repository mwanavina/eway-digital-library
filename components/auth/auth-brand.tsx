export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="12" r="4" className="fill-secondary" />
      <circle cx="36" cy="30" r="4" className="fill-secondary" />
      <circle cx="12" cy="30" r="4" className="fill-secondary" />
      <line x1="24" y1="16" x2="35" y2="27" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="16" x2="13" y2="27" stroke="currentColor" strokeWidth="2" />
      <line x1="14" y1="30" x2="34" y2="30" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function AuthBrand() {
  return (
    <div className="mb-8 flex flex-col items-center gap-2.5">
      <BrandLogo className="size-12 text-primary" />
      <div className="text-[1.9rem] font-bold tracking-tight text-accent dark:text-foreground">
        e<span className="text-primary">-way</span>
      </div>
    </div>
  );
}
