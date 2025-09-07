import LogicChallenges from "@/src/components/challenges/challengesTypes/LogicChallenges";

async function page({ params }) {
  const { challengeId } = await params;
  return <LogicChallenges challengeId={challengeId} />;
}

export default page;
