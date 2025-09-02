"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, Send, ArrowLeft } from "lucide-react";

function CommentsSection({ postId, onBack }) {
  const [newComment, setNewComment] = useState("");

  // Mock comments data - replace with actual data from your API
  const comments = [
    {
      id: 1,
      user: {
        name: "Lauren Joe",
        avatar: "/asset/avatar.png",
      },
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      timestamp: "10 h",
      likes: "12K",
      isLiked: false,
    },
    {
      id: 2,
      user: {
        name: "Lauren Joe",
        avatar: "/asset/avatar.png",
      },
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      timestamp: "10 h",
      likes: "12K",
      isLiked: false,
    },
    {
      id: 3,
      user: {
        name: "Lauren Joe",
        avatar: "/asset/avatar.png",
      },
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      timestamp: "10 h",
      likes: "12K",
      isLiked: false,
    },
  ];

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log("Submitting comment:", newComment);
      // Add your comment submission logic here
      setNewComment("");
    }
  };

  const handleLikeComment = (commentId) => {
    console.log("Liking comment:", commentId);
    // Add your like comment logic here
  };

  const handleReplyComment = (commentId) => {
    console.log("Replying to comment:", commentId);
    // Add your reply logic here
  };

  return (
    <div className="w-96 bg-white rounded-xl shadow-sm border h-fit max-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="p-4 relative border-b border-gray-100 w-full flex-1 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 absolute hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-xl w-full text-center font-medium font-poppins">
          Comments
        </h2>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Comment */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  width={40}
                  height={40}
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl p-3">
                  <h4 className="font-semibold font-poppins text-gray-900 mb-1 text-sm">
                    {comment.user.name}
                  </h4>
                  <p className="text-gray-700 font-poppins leading-relaxed text-sm">
                    {comment.content}
                  </p>
                </div>

                {/* Comment Actions */}
                <div className="flex items-center justify-between mt-2 px-2">
                  <div className="flex items-center gap-4 text-gray-500">
                    <span className="text-xs font-poppins">
                      {comment.timestamp}
                    </span>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="text-xs font-poppins hover:text-blue-500 transition-colors"
                    >
                      Like
                    </button>
                    <button
                      onClick={() => handleReplyComment(comment.id)}
                      className="text-xs font-poppins hover:text-blue-500 transition-colors"
                    >
                      Reply
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <ThumbsUp
                      size={14}
                      className={`${
                        comment.isLiked
                          ? "text-blue-500 fill-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-poppins text-orange-500 font-medium">
                      {comment.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-0 border rounded-full p-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              width={32}
              height={32}
              src="/asset/avatar.png"
              alt="Your avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
              className="flex-1 px-3 py-2 rounded-full outline-none font-poppins placeholder-gray-400 transition-all text-sm"
            />
            {/* <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
            >
              <Send size={14} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsSection;
