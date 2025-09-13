"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, MoreVertical, Edit2, X, Check } from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getAllComments, createComment, editComment } from "@/src/api/lounge";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getUserProfile } from "@/src/api/auth";
import { formatPostTimestamp } from "@/src/utils/dateUtils";

function CommentsSection({ postId, onBack }) {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const queryClient = useQueryClient();

  // Get user profile to check comment ownership
  const { data: userProfile } = useQueryHandler(getUserProfile, {
    queryKey: ["user_profile"],
  });

  // Fetch comments with infinite scroll
  const {
    data: commentsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) => getAllComments(postId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        try {
          const url = lastPage.next.startsWith("http")
            ? new URL(lastPage.next)
            : new URL(lastPage.next, window.location.origin);
          return parseInt(url.searchParams.get("page")) || undefined;
        } catch (error) {
          console.error("Error parsing next page URL:", error);
          return undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!postId, // Only fetch when postId is available
  });

  // Flatten all pages into a single array
  const allComments = useMemo(() => {
    return commentsData?.pages?.flatMap((page) => page.results) || [];
  }, [commentsData]);

  // Auto-scroll infinite loading
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (
        scrollHeight - scrollTop <= clientHeight * 1.5 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // Comment submission mutation
  const commentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (newCommentData) => {
      // Add the new comment to the beginning of the first page
      queryClient.setQueryData(["comments", postId], (oldData) => {
        if (!oldData) return oldData;

        const updatedPages = [...oldData.pages];
        if (updatedPages.length > 0) {
          updatedPages[0] = {
            ...updatedPages[0],
            results: [newCommentData, ...updatedPages[0].results],
          };
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
      queryClient.invalidateQueries(["my_posts"]);

      // Clear the input
      setNewComment("");
    },
    onError: (error) => {
      console.error("Error submitting comment:", error);
    },
  });

  const handleSubmitComment = () => {
    if (newComment.trim() && !commentMutation.isPending) {
      commentMutation.mutate({
        lounge_post: postId,
        text: newComment.trim(),
      });
    }
  };

  // Edit comment mutation
  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, commentData }) =>
      editComment(commentId, commentData),
    onSuccess: (updatedComment) => {
      // Update the comment in the cache
      queryClient.setQueryData(["comments", postId], (oldData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          results: page.results.map((comment) =>
            comment.id === updatedComment.id
              ? { ...comment, ...updatedComment }
              : comment
          ),
        }));

        return {
          ...oldData,
          pages: updatedPages,
        };
      });

      // Reset editing state
      setEditingCommentId(null);
      setEditingText("");
      setShowDropdown(null);
    },
    onError: (error) => {
      console.error("Error editing comment:", error);
    },
  });

  // Edit handlers
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content || comment.text);
    setShowDropdown(null);
  };

  const handleSaveEdit = () => {
    if (editingText.trim() && !editCommentMutation.isPending) {
      editCommentMutation.mutate({
        commentId: editingCommentId,
        commentData: {
          lounge_post: postId,
          text: editingText.trim(),
        },
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const toggleDropdown = (commentId) => {
    setShowDropdown(showDropdown === commentId ? null : commentId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {isLoading && allComments.length === 0 ? (
          // Loading skeleton
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500 text-sm">Failed to load comments</p>
          </div>
        ) : allComments.length === 0 ? (
          // Empty state
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500 text-sm">Be the first to comment!</p>
          </div>
        ) : (
          // Comments list
          <>
            {allComments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* Comment */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      width={40}
                      height={40}
                      src="/asset/avatar.png"
                      alt={comment.username || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="bg-gray-100 rounded-2xl p-3 relative overflow-hidden">
                      {/* 3-dot menu for user's own comments */}
                      {userProfile?.data?.id === comment.comment_by && (
                        <div className="absolute top-2 right-2 dropdown-container">
                          <button
                            onClick={() => toggleDropdown(comment.id)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <MoreVertical size={14} className="text-gray-500" />
                          </button>

                          {/* Dropdown menu */}
                          {showDropdown === comment.id && (
                            <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Edit2 size={12} />
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <h4 className="font-semibold font-poppins text-gray-900 mb-1 text-sm pr-6 line-clamp-1">
                        {comment.username || "Anonymous"}
                      </h4>

                      {/* Comment content - editable if in edit mode */}
                      {editingCommentId === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full p-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            disabled={editCommentMutation.isPending}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={
                                !editingText.trim() ||
                                editCommentMutation.isPending
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {editCommentMutation.isPending ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Check size={12} />
                              )}
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={editCommentMutation.isPending}
                              className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 flex items-center gap-1"
                            >
                              <X size={12} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 font-poppins leading-relaxed text-sm pr-6">
                          {comment.content || comment.text}
                        </p>
                      )}
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center justify-between mt-2 px-2">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="text-xs font-poppins">
                          {formatPostTimestamp(comment.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator for infinite scroll */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="inline-flex items-center gap-2 text-blue-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading more comments...
                </div>
              </div>
            )}
          </>
        )}
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
              placeholder={
                commentMutation.isPending
                  ? "Posting comment..."
                  : "Write a comment"
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              disabled={commentMutation.isPending}
              className="flex-1 px-3 py-2 rounded-full outline-none font-poppins placeholder-gray-400 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {commentMutation.isPending && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
          </div>
        </div>

        {/* Show error message if comment submission fails */}
        {commentMutation.isError && (
          <div className="mt-2 text-xs text-red-500 px-3">
            Failed to post comment. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
