import { getAllRecommendationBasedOnUser } from "@/src/api/home";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import Image from "next/image";
import Link from "next/link";
// const challenges = [
//   {
//     id: 1,
//     title: "Daily Challenge",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
//     imageSrc: "/asset/mug.jpg",
//   },
//   {
//     id: 2,
//     title: "Challenge_1",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
//     imageSrc: "/asset/pattern.jpg",
//   },
//   {
//     id: 3,
//     title: "Challenge_2",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
//     imageSrc: "/asset/puzzle.jpg",
//   },
// ];
function TopRecommendation() {
  const {
    data: userRecomm,
    isLoading: recommLoading,
    error: recommError,
  } = useQueryHandler(getAllRecommendationBasedOnUser, {
    queryKey: ["recommendations_based_on_user"],
  });
  if (recommLoading) return null;
  const {
    whats_new: { recommendations },
  } = userRecomm;
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-4 space-y-2 font-poppins">
        <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-[#404040]">
          Top Recommendation for You
        </h2>
        <p className="text-[#8C8C8C] text-xs sm:text-sm max-w-2xl">
          Discover and start playing the best picks curated just for you
        </p>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 max-w-full gap-6 lg:gap-8">
        {recommendations.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-white rounded-2xl flex flex-col shadow-sm overflow-hidden drop-shadow-sm border border-[#000000] border-opacity-[0.12] hover:shadow-md transition-shadow duration-300"
          >
            {/* Image Section */}
            <div className="relative aspect-square w-full rounded-lg p-2 max-h-48">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={challenge?.imageSrc || "/asset/mug.jpg"}
                  alt={challenge?.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 z-10"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-3 pb-3 flex flex-col flex-1 justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-poppins font-semibold">
                  {challenge?.title}
                </h3>
                <p className="text-[#757575] font-opensans font-normal text-xs leading-relaxed">
                  {challenge?.subtitle}
                </p>
              </div>
              <Link
                href={challenge?.action_url.split("/api")[1]}
                className="w-full block text-xs text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold font-poppins py-2 px-4 rounded-xl transition-colors duration-200"
              >
                Start Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopRecommendation;
