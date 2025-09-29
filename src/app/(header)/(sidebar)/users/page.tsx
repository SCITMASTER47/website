import UsersPageContent from "@/_components/users/UsersPageContent";
// 동적 렌더링 강제 - 쿠키 접근이 필요한 페이지
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  return <UsersPageContent />;
}
