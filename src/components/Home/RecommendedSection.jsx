import {
  CommentCard,
  ChallengeCard,
  SimplePostCard,
} from "@/src/components/common/Cards";

function RecommendedSection() {
  return (
    <div className="z-20 space-y-4 text-[15px]">
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
  );
}

export default RecommendedSection;
