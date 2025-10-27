import { cookies } from "next/headers";
import LandingPage from "../../components/Landing/LandingPage";

async function page() {
  const cookie = await cookies();
  const token = cookie.get("authToken")?.value;
  if (token) {
    redirect("/challenges");
  }
  return <LandingPage />;
}

export default page;
