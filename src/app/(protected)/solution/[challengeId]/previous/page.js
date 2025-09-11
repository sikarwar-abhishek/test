import SolutionPage from "@/src/components/solution/SolutionPage";

async function page({ params }) {
  const { challengeId } = await params;
  console.log(challengeId);
  return <SolutionPage challengeId={challengeId} />;
}

export default page;
