import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Secrets() {
  const session = await auth();
  if (!session) return redirect("/");
  return <h1>Welcome to the secret content</h1>;
}
