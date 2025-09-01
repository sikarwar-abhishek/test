import Link from "next/link";
import PropTypes from "prop-types";

function ChallengeCard({
  challengerName = "",
  challengeType = "logic",
  challengeUrl = "#",
  timestamp = "",
  iconColor = "red-500",
  iconBgColor = "yellow-400",
}) {
  const getChallengeIcon = () => {
    switch (challengeType) {
      case "logic":
        return <div className={`w-6 h-6 bg-yellow-400 rounded-full`}></div>;
      case "coding":
        return <div className={`w-6 h-6 bg-yellow-400 rounded-sm`}></div>;
      case "math":
        return (
          <div
            className={`w-6 h-6 bg-yellow-400 rounded-full border-2 border-white`}
          ></div>
        );
      default:
        return <div className={`w-6 h-6 bg-yellow-400 rounded-full`}></div>;
    }
  };

  return (
    <div className="flex items-start font-poppins gap-4 p-4 border border-border rounded-lg shadow-sm">
      <div
        className={`w-10 h-10 z-20 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0`}
      >
        {getChallengeIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="mb-2">
          {challengerName && (
            <>
              <span className="font-semibold">{challengerName}</span> has
              attempted today&apos;s {challengeType} challenge.
            </>
          )}
          {!challengerName && <>New {challengeType} challenge available!</>}
        </p>
        <Link
          href={challengeUrl}
          className="text-blue-500 p-0 h-auto font-medium hover:underline"
        >
          Try Challenge
        </Link>
      </div>
      {timestamp && (
        <span className="self-end text-muted-foreground text-sm flex-shrink-0">
          {timestamp}
        </span>
      )}
    </div>
  );
}

ChallengeCard.propTypes = {
  challengerName: PropTypes.string,
  challengeType: PropTypes.oneOf(["logic", "coding", "math"]),
  challengeUrl: PropTypes.string,
  timestamp: PropTypes.string,
  iconColor: PropTypes.string,
  iconBgColor: PropTypes.string,
};

export default ChallengeCard;
