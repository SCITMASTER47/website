import SignupForm from "@/_components/signup_form";
interface SignUpPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  const error = params.error as string | undefined;
  const token = params.token as string | undefined;

  return <SignupForm token={token} error={error} />;
}
