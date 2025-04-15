import { auth } from "@/lib/auth";
import { SignoutButton } from "@/components/signout-button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <SignoutButton />
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
