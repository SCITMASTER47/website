import LoginForm from "@/_components/login_form";

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const error = params.error as string | undefined;
  const token = params.token as string | undefined;

  return <LoginForm token={token} error={error} />;
}
