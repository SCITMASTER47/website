import Header from "@/_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full pt-14">
      <Header />
      {children}
    </div>
  );
}
