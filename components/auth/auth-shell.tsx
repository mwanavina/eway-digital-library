import { AuthBrand } from "@/components/auth/auth-brand";
import { AuthCarousel } from "@/components/auth/auth-carousel";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh bg-muted md:grid-cols-2">
      <AuthCarousel />
      <div className="flex flex-col items-center justify-center bg-card px-6 py-10 md:px-14">
        <div className="w-full max-w-[400px]">
          <AuthBrand />
          {children}
        </div>
      </div>
    </div>
  );
}
