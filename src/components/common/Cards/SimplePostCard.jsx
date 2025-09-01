import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

function SimplePostCard({
  avatarSrc = "/asset/avatar.png",
  authorName = "",
  postTitle = "",
  postUrl = "#",
  timestamp = "",
  actionText = "View Post",
  showAction = true,
}) {
  return (
    <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
      <div className="w-10 h-10 z-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        <Image
          width={40}
          height={40}
          src={avatarSrc}
          alt={`${authorName}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 font-poppins">
        <p className="text-foreground">
          {authorName && (
            <>
              <span className="font-semibold">{authorName}</span> added a new
              post
              {postTitle && `: "${postTitle}"`}.
            </>
          )}
          {!authorName && postTitle && <>New post: &quot;{postTitle}&quot;</>}
          {!authorName && !postTitle && <>New post available</>}
        </p>
        {showAction && (
          <Link
            href={postUrl}
            className="text-blue-500 hover:underline font-medium text-sm mt-1 inline-block"
          >
            {actionText}
          </Link>
        )}
      </div>
      {timestamp && (
        <span className="text-muted-foreground text-sm flex-shrink-0">
          {timestamp}
        </span>
      )}
    </div>
  );
}

SimplePostCard.propTypes = {
  avatarSrc: PropTypes.string,
  authorName: PropTypes.string,
  postTitle: PropTypes.string,
  postUrl: PropTypes.string,
  timestamp: PropTypes.string,
  actionText: PropTypes.string,
  showAction: PropTypes.bool,
};

export default SimplePostCard;
