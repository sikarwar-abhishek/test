import Image from "next/image";
import PropTypes from "prop-types";

function CommentCard({
  avatarSrc = "/asset/avatar.png",
  commenters = [],
  otherCount = 0,
  postPreview = "",
  timestamp = "",
  onViewComments,
}) {
  const displayCommenters = commenters.slice(0, 2);
  const hasOthers = otherCount > 0 || commenters.length > 2;
  const actualOtherCount = otherCount || Math.max(0, commenters.length - 2);

  return (
    <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card text-[15px]">
      <div className="w-10 z-20 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        <Image
          width={40}
          height={40}
          src={avatarSrc}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-foreground font-poppins">
          {displayCommenters.length > 0 && (
            <>
              <span className="font-semibold">
                {displayCommenters.join(", ")}
              </span>
              {hasOthers && (
                <>
                  {" "}
                  and{" "}
                  <span className="font-semibold">
                    {actualOtherCount} other{actualOtherCount !== 1 ? "s" : ""}
                  </span>
                </>
              )}{" "}
              commented on your recent post.
            </>
          )}
        </p>
        {postPreview && (
          <p className="text-muted-foreground font-poppins text-sm">
            &quot;{postPreview}&quot;
          </p>
        )}
        <button
          onClick={onViewComments}
          className="text-blue-500 hover:underline font-segeo p-0 h-auto font-medium bg-transparent border-none cursor-pointer"
        >
          View Comments
        </button>
      </div>
      {timestamp && (
        <span className="self-end text-muted-foreground text-sm flex-shrink-0">
          {timestamp}
        </span>
      )}
    </div>
  );
}

CommentCard.propTypes = {
  avatarSrc: PropTypes.string,
  commenters: PropTypes.arrayOf(PropTypes.string),
  otherCount: PropTypes.number,
  postPreview: PropTypes.string,
  timestamp: PropTypes.string,
  onViewComments: PropTypes.func,
};

export default CommentCard;
