import GoogleLogin from "@/_components/google_login";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full p-8  rounded-3xl shadow flex flex-col gap-6 border border-primary">
      {children}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className=" px-2 text-muted-foreground">또는</span>
        </div>
      </div>
      <GoogleLogin />
      <Link
        href="/auth/login"
        className="text-primary text-sm text-center hover:underline"
      >
        로그인
      </Link>
    </div>
  );
}
