import { AuthBrand } from "@/components/auth/auth-brand";
import { AuthCarousel } from "@/components/auth/auth-carousel";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh bg-muted md:grid-cols-2">
      <AuthCarousel />
      <div className="flex min-h-svh flex-col items-center justify-center bg-card px-6 py-8 md:min-h-0 md:px-14 md:py-8">
        <div className="w-full max-w-[400px]">
          <AuthBrand />
          {children}
        </div>
      </div>
    </div>
  );
}
