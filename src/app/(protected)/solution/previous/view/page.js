import ViewPastPuzzles from "@/src/components/solution/ViewPastPuzzles";

async function page({ searchParams }) {
  const { challengeId, date } = await searchParams;

  return <ViewPastPuzzles challengeId={challengeId} date={date}/>;
}

export default page;
