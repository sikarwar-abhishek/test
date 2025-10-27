import ChallengesPage from "@/src/components/challenges/ChallengesPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function page() {
  const cookie = await cookies();
  const token = cookie.get("authToken")?.value;
  if (!token) {
    redirect("/login");
  }

  return <ChallengesPage />;
}

export default page;
