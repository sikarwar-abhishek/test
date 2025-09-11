import ViewPastPuzzles from "@/src/components/solution/ViewPastPuzzles";

async function page({ params, searchParams }) {
  const { challengeId } = await params;
  const { date } = await searchParams;

  return <ViewPastPuzzles challengeId={challengeId} date={date} />;
}

export default page;
