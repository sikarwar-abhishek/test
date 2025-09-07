import Subjective from "@/src/components/challenges/puzzleType/Subjective";
import Grid from "@/src/components/challenges/puzzleType/Grid";

const componentMap = {
  subjective: Subjective,
  grid: Grid,
};

async function page({ params }) {
  const { challengeId, puzzleType, puzzleId } = await params;
  const Component = componentMap[puzzleType] || (() => <div>Not Found</div>);
  return <Component challengeId={challengeId} puzzleId={puzzleId} />;
}

export default page;
