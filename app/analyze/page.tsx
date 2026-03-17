import { redirect } from "next/navigation";

type AnalyzePageProps = {
  searchParams: Promise<{
    username?: string;
  }>;
};

export default async function AnalyzeRedirectPage({
  searchParams,
}: AnalyzePageProps) {
  const params = await searchParams;
  const username = params.username?.trim();

  if (!username) {
    redirect("/");
  }

  redirect(`/analyze/${encodeURIComponent(username)}`);
}
