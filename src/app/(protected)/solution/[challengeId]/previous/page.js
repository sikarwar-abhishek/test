import SolutionPage from "@/src/components/solution/SolutionPage";

async function page({ params }) {
  const { challengeId } = await params;
  return <SolutionPage challengeId={challengeId} />;
}

export default page;
