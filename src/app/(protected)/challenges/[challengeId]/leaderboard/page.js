import LeaderboardPage from "@/src/components/challenges/leaderboard/LeaderboardPage";

async function page({ params }) {
  const { challengeId } = await params;

  return <LeaderboardPage challengeId={challengeId} />;
}

export default page;
