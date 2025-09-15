"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { Clock, MessageCircle, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HomePageHeader from "../common/HomePageHeader";
import Link from "next/link";
import PostModal from "./PostModal";
import CommentsSection from "./CommentSection";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getUserProfile } from "@/src/api/auth";
import {
  getAllLoungePosts,
  togglePostLike,
  getSinglePost,
} from "@/src/api/lounge";
import { useSearchParams } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Icon from "../common/Icon";
import { formatPostTimestamp } from "@/src/utils/dateUtils";
import { MdOutlineThumbUp } from "react-icons/md";
import { RiThumbUpFill } from "react-icons/ri";
import RightSection from "../Home/RightSection";
function PostCard({ post, onViewComments, onToggleLike }) {
  return (
    <div className="bg-white border-b-4 border-[#DDE6FF] py-6 last:border-none">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10">
          <Image
            src="/asset/avatar.png"
            alt={post.username}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">{post.username}</h3>
          <div className="flex gap-2">
            <div className="flex gap-1 items-center border-r pr-2 border-[#D9D9D9]">
              <Icon name={"price"} className="w-3 h-3" />
              <span className="text-xs text-[#4676FA] font-medium font-poppins">
                {post.user_community_score}
              </span>
            </div>
            <div className="flex gap-1 items-center border-r pr-2 border-[#D9D9D9]">
              <Icon name={"award"} className="w-3 h-3" />
              <span className="text-xs text-[#4676FA] font-medium font-poppins">
                {post.user_proficiency_score}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <Icon name={"dumbbell"} className="w-3 h-3" />
              <span className="text-xs text-[#4676FA] font-medium font-poppins">
                {post.user_fitness_score}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatPostTimestamp(post.created_at)}
          </div>
        </div>
      </div>

      <p className="mb-4">{post.description}</p>

      {post.media_type === "image" &&
        !post.media_url.startsWith("https://your-bucket.s3.amazonaws.com/") && (
          <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.media_url}
              alt={`${post.username} post ${post.id}`}
              fill
              className="object-contain h-full w-full"
            />
          </div>
        )}

      <div className="flex items-center gap-6 text-gray-500">
        <button
          onClick={() => onToggleLike(post.id)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors disabled:opacity-50"
        >
          {!post.liked_by_me ? (
            <MdOutlineThumbUp size={20} />
          ) : (
            <RiThumbUpFill size={20} className="text-blue-500" />
          )}
          <span>{post.likes}</span>
        </button>
        <button
          onClick={() => onViewComments(post.id)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="font-poppins">{post.comments_count}</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-xl p-1 sm:p-4 text-center shadow-md drop-shadow-sm">
      <div className="sm:text-3xl text-xl font-semibold text-blue-500 mb-1">
        {stat.value}
      </div>
      <div className="sm:text-sm text-xs font-medium uppercase">
        {stat.title}
      </div>
    </div>
  );
}

function LoungePage() {
  const [postText, setPostText] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const queryClient = useQueryClient();
  const debounceTimeouts = useRef({});
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const specificPostRef = useRef(null);

  // Fetch user profile
  const { data, isLoading } = useQueryHandler(getUserProfile, {
    queryKey: ["user_profile"],
  });

  // Fetch specific post if postId is provided
  const {
    data: specificPost,
    isLoading: specificPostLoading,
    error: specificPostError,
  } = useQueryHandler(getSinglePost, {
    queryKey: ["specific_post", postId],
    enabled: !!postId,
    query: postId,
  });

  // Fetch lounge posts with infinite scroll
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lounge_posts"],
    queryFn: ({ pageParam = 1 }) => getAllLoungePosts(pageParam),
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
  });

  // Scroll to specific post when it's loaded
  useEffect(() => {
    if (specificPost && specificPostRef.current) {
      const timer = setTimeout(() => {
        specificPostRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // Small delay to ensure DOM is updated

      return () => clearTimeout(timer);
    }
  }, [specificPost]);

  // Track pending like states
  const pendingLikes = useRef({});

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: togglePostLike,
    onSuccess: (data, postId) => {
      // Update lounge posts cache
      queryClient.setQueryData(["lounge_posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: data.likes_count,
                    liked_by_me: data.is_liked,
                  }
                : post
            ),
          })),
        };
      });

      // Update specific post cache if this is the specific post
      const urlPostId = searchParams.get("postId");
      if (specificPost && specificPost.id == postId) {
        queryClient.setQueryData(["specific_post", urlPostId], (oldData) => {
          if (!oldData) return oldData;
          const newData = {
            ...oldData,
            likes: data.likes_count,
            liked_by_me: data.is_liked,
          };
          return newData;
        });
      }

      // Clear pending state
      delete pendingLikes.current[postId];
    },
    onError: (error, postId) => {
      console.error("Error toggling like:", error);

      const pendingState = pendingLikes.current[postId];
      if (!pendingState) return;

      // Revert lounge posts cache
      queryClient.setQueryData(["lounge_posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: pendingState.originalLikes,
                    liked_by_me: pendingState.originalLikedByMe,
                  }
                : post
            ),
          })),
        };
      });

      // Revert specific post cache if this is the specific post
      const urlPostId = searchParams.get("postId");
      if (specificPost && specificPost.id == postId) {
        queryClient.setQueryData(["specific_post", urlPostId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            likes: pendingState.originalLikes,
            liked_by_me: pendingState.originalLikedByMe,
          };
        });
      }

      // Clear pending state
      delete pendingLikes.current[postId];
    },
  });
  const allPosts = useMemo(() => {
    return postsData?.pages?.flatMap((page) => page.results) || [];
  }, [postsData]);
  // Immediate like toggle function
  const handleToggleLike = useCallback(
    (postId) => {
      // Clear existing timeout for this post
      if (debounceTimeouts.current[postId]) {
        clearTimeout(debounceTimeouts.current[postId]);
      }

      // Get current post state
      const currentPost = allPosts.find((post) => post.id === postId);
      if (!currentPost) return;

      // Store original state if not already pending
      if (!pendingLikes.current[postId]) {
        pendingLikes.current[postId] = {
          originalLikes: currentPost.likes,
          originalLikedByMe: currentPost.liked_by_me,
        };
      }

      // Calculate new state
      const newLikedByMe = !currentPost.liked_by_me;
      const newLikes = newLikedByMe
        ? currentPost.likes + 1
        : currentPost.likes - 1;

      // Update lounge posts cache immediately
      queryClient.setQueryData(["lounge_posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: newLikes,
                    liked_by_me: newLikedByMe,
                  }
                : post
            ),
          })),
        };
      });

      // Update specific post cache immediately if this is the specific post
      const urlPostId = searchParams.get("postId");
      if (specificPost && specificPost.id == postId) {
        queryClient.setQueryData(["specific_post", urlPostId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            likes: newLikes,
            liked_by_me: newLikedByMe,
          };
        });
      }

      // Set debounced API call
      debounceTimeouts.current[postId] = setTimeout(() => {
        likeMutation.mutate(postId);
        delete debounceTimeouts.current[postId];
      }, 500); // 500ms debounce for better UX
    },
    [likeMutation, allPosts, queryClient, searchParams, specificPost]
  );

  // Cleanup timeouts on unmount
  useCallback(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  // Flatten all pages into a single array

  if (isLoading || (postsLoading && allPosts.length === 0 && !specificPost))
    return <p>Loading..</p>;
  const value = data?.data;
  const { proficiency_score, community_score, fitness_score } = value;
  const stats = [
    {
      title: "Proficiency Score",
      value: proficiency_score,
    },

    {
      title: "Fitness Score",
      value: fitness_score,
    },
    {
      title: "Community Score",
      value: community_score,
    },
  ];
  const handleInputClick = () => {
    setIsPostModalOpen(true);
  };

  const handlePostSubmit = () => {
    if (postText.trim()) {
      setPostText("");
    }
    setIsPostModalOpen(false);
  };

  const handleViewComments = (postId) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleBackToSidebar = () => {
    setShowComments(false);
    setSelectedPostId(null);
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
        <HomePageHeader text={"Lounge"} />

        <div className="flex gap-8 sm:mt-6 overflow-auto no-scrollbar">
          {/* Main Content Area */}
          <motion.div
            className="flex-1 space-y-6 overflow-auto no-scrollbar"
            animate={{
              width: showComments ? "70%" : "100%",
              marginRight: showComments ? "1rem" : "0",
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            {/* User Profile Section */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl sm:p-6 p-4">
              <div className="flex items-center justify-between mb-6 font-poppins">
                <div className="flex items-center gap-4">
                  <div className="relative sm:w-16 sm:h-16 w-8 h-8">
                    <Image
                      src="/asset/avatar.png"
                      alt={value?.first_name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm sm:text-xl line-clamp-1 overflow-hidden font-semibold text-gray-800">
                      {value?.first_name} {value?.last_name}
                    </h2>
                  </div>
                </div>
                <Link
                  href={"/lounge/myposts"}
                  className="bg-white rounded-lg p-3 text-gray-500 text-xs sm:text-sm hover:text-gray-800 font-medium"
                >
                  My Post
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 font-poppins">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </div>
            </div>

            {/* Post Creation */}
            <div className="bg-white rounded-xl sm:p-2 p-1 border">
              <div className="flex items-center sm:gap-3 font-poppins">
                <div className="relative w-8 h-8">
                  <Image
                    src="/asset/avatar.png"
                    alt="Your avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  placeholder="What are you thinking ?"
                  onClick={handleInputClick}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="sm:flex-1 w-full px-4 py-2 outline-none"
                  readOnly
                />
              </div>
            </div>

            {/* Feed Posts */}
            <div className="font-poppins">
              {postsLoading && allPosts.length === 0 && !specificPost ? (
                // Loading skeleton
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border-b-4 border-[#DDE6FF] py-6 animate-pulse"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="flex gap-6">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : postsError ? (
                // Error state
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">Failed to load posts</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : allPosts.length > 0 || specificPost ? (
                // Render posts
                <>
                  {/* Specific Post - shown at top when postId is in URL */}
                  {specificPost && (
                    <motion.div
                      ref={specificPostRef}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mb-6"
                    >
                      <div className="p-1 rounded-xl">
                        <PostCard
                          key={`specific-${specificPost.id}`}
                          post={specificPost}
                          onViewComments={handleViewComments}
                          onToggleLike={handleToggleLike}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Regular Feed Posts */}
                  {allPosts.length > 0 && (
                    <>
                      {/* Feed Posts Header */}
                      {specificPost && (
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-700 font-poppins">
                            Feed Posts
                          </h3>
                          <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 mt-2"></div>
                        </div>
                      )}

                      {allPosts
                        .filter(
                          (post) => !specificPost || post.id != specificPost.id
                        ) // Avoid duplicates
                        .map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onViewComments={handleViewComments}
                            onToggleLike={handleToggleLike}
                          />
                        ))}
                    </>
                  )}

                  {/* Load More Button */}
                  {hasNextPage && (
                    <div className="flex justify-center py-6">
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
                      >
                        {isFetchingNextPage ? "Loading..." : "Load More Posts"}
                        <ChevronDown
                          className={isFetchingNextPage ? "animate-spin" : ""}
                        />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Empty state - only show if no specific post either
                !specificPost && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No posts available at the moment.</p>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Comments Section - appears on the right when a comment button is clicked */}
          <AnimatePresence mode="wait">
            {showComments && (
              <motion.div
                className="flex-shrink-0"
                initial={{
                  x: "100%",
                  opacity: 0,
                  width: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  width: "33%",
                }}
                exit={{
                  x: "100%",
                  opacity: 0,
                  width: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <CommentsSection
                    postId={selectedPostId}
                    onBack={handleBackToSidebar}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Original Sidebar - Only show when comments are not open */}
          {!showComments && <RightSection />}
        </div>
      </div>
      <PostModal
        user={value}
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
}

export default LoungePage;
