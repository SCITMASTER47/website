import CertifyLogo from "@/_ui/logo/logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen place-items-center">
      <div className="w-full max-w-xs mx-auto flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center group">
          <span className="block text-xs text-primary text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Let&apos;s go Home
          </span>
          <CertifyLogo />
        </Link>
        {children}
      </div>
    </main>
  );
}
