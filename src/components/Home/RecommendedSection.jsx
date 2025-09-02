import {
  CommentCard,
  ChallengeCard,
  SimplePostCard,
} from "@/src/components/common/Cards";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";
import Image from "next/image";

function RecommendedSection() {
  return (
    <div className="flex gap-8 mt-6 overflow-auto no-scrollbar">
      <div className="flex flex-col gap-4 flex-1">
        <div className="z-20 space-y-4 p-4 rounded-2xl shadow-md text-[15px] bg-[#4676FA05]">
          <CommentCard
            avatarSrc="/asset/avatar.png"
            commenters={["John Doe", "Jane Smith"]}
            otherCount={8}
            postPreview="I saw a new idea..."
            timestamp="2h"
            onViewComments={() => console.log("View comments clicked")}
          />

          {/* Challenge Card Examples */}
          <ChallengeCard
            challengerName="Alice Johnson"
            challengeType="logic"
            challengeUrl="/challenges/logic-1"
            timestamp="5h"
            iconColor="red-500"
            iconBgColor="yellow-400"
          />

          <ChallengeCard
            challengerName="Bob Wilson"
            challengeType="coding"
            challengeUrl="/challenges/coding-1"
            timestamp="1d"
            iconColor="teal-500"
            iconBgColor="yellow-400"
          />

          {/* Simple Post Card Examples */}
          <SimplePostCard
            avatarSrc="/asset/avatar.png"
            authorName="Sarah Connor"
            postTitle="My thoughts on React hooks"
            postUrl="/posts/react-hooks"
            timestamp="3h"
            actionText="Read Post"
          />

          <SimplePostCard
            avatarSrc="/asset/avatar.png"
            authorName="Mike Ross"
            postUrl="/posts/latest"
            timestamp="6h"
            showAction={true}
          />

          {/* Minimal examples */}
          <SimplePostCard
            authorName="Emma Watson"
            timestamp="1d"
            showAction={false}
          />
        </div>

        <div className="flex gap-2 text-[#1877F2] justify-center">
          <button className="font-poppins">View More</button>
          <ChevronDown />
        </div>
      </div>
      <div className="w-96 space-y-6 font-poppins">
        {/* What's New Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">What&apos;s New</h3>
            <ArrowRight size={20} />
          </div>

          <div className="relative rounded-xl overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/asset/mug.jpg"
                alt="Daily Challenge"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-4 drop-shadow-lg">
                <div className="flex flex-col gap-2 items-center">
                  <h4 className="text-white text-xl font-semibold">
                    Daily Challenge
                  </h4>
                  <div className="flex items-center font-inter gap-2 text-white">
                    <Clock size={16} />
                    <span className="text-sm">16 : 20 : 00</span>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-xs rounded-lg font-bold transition-colors">
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Challenge Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Ongoing Challenge</h3>
            <ArrowRight size={20} />
          </div>

          <div className="relative rounded-xl overflow-hidden mb-4">
            <div className="relative h-48">
              <Image
                src="/asset/mug.jpg"
                alt="Challenge"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-3 drop-shadow-sm">
            <h4 className="font-semibold text-gray-800">Challenge_1</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-orange-500 font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-sm text-white py-3 rounded-lg font-bold transition-colors">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendedSection;
