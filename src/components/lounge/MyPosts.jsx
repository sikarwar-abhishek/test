"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import {
  Edit2,
  MessageCircle,
  MoreVertical,
  Trash,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
// Removed framer-motion to eliminate flickering
import HomePageHeader from "../common/HomePageHeader";
import CommentsSection from "./CommentSection";
import Image from "next/image";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deletePost,
  getMyPosts,
  togglePostLike,
  editPost,
  getPresignedUrl,
  uploadImageToS3,
} from "@/src/api/lounge";
import { formatPostTimestamp } from "@/src/utils/dateUtils";
import { MdOutlineThumbUp } from "react-icons/md";
import { RiThumbUpFill } from "react-icons/ri";
import { toast } from "react-toastify";
import DeletePopup from "./DeletePopUp";
import { Button } from "@/src/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/common/ui/dialog";
import useMobile from "@/src/hooks/useMobile";

// PostCard component moved outside to fix React.memo
const PostCard = memo(function PostCard({
  post,
  onToggleLike,
  onViewComments,
  showDropdown,
  onToggleDropdown,
  onEditPost,
  onDeletePost,
  dropdownRef,
  toggleButtonRef,
}) {
  return (
    <div
      className="flex flex-col bg-white relative border-b-4 border-[#DDE6FF] py-6 last:border-none"
      style={{ willChange: "auto", backfaceVisibility: "hidden" }}
    >
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
          <h3 className="font-medium line-clamp-1 w-40 sm:w-full">
            {post.username}
          </h3>
          <div className="text-xs text-gray-500">
            {formatPostTimestamp(post.created_at)}
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 dropdown-container">
        <button
          onClick={() => onToggleDropdown(post.id)}
          ref={toggleButtonRef}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <MoreVertical size={14} className="text-gray-500" />
        </button>

        {/* Dropdown menu */}
        {showDropdown === post.id && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[100px]"
          >
            <button
              onClick={(e) => {
                onEditPost(post);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Edit2 size={12} />
              Edit
            </button>
            <button
              onClick={(e) => {
                onDeletePost(post.id);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Trash size={12} />
              Delete
            </button>
          </div>
        )}
      </div>

      <p
        className="mb-4 whitespace-normal break-words"
        style={{ overflowWrap: "anywhere" }}
      >
        {post.description}
      </p>

      {post.media_type === "image" && post.media_url && (
        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
          <Image
            src={post.media_url}
            alt={`${post.username} post ${post.id}`}
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="flex items-center gap-6 text-gray-500">
        <button
          onClick={() => onToggleLike(post.id)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors disabled:opacity-50"
          style={{ minHeight: "24px", backfaceVisibility: "hidden" }}
        >
          {!post.liked_by_me ? (
            <MdOutlineThumbUp size={20} />
          ) : (
            <RiThumbUpFill size={20} className="text-blue-500" />
          )}
          <span style={{ minWidth: "20px", display: "inline-block" }}>
            {post.likes}
          </span>
        </button>
        <button
          onClick={() => onViewComments(post.id)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span>{post.comments_count}</span>
        </button>
      </div>
    </div>
  );
});

function MyPosts() {
  const [showComments, setShowComments] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const dropdownRef = useRef(null); // For dropdown menu
  const toggleButtonRef = useRef(null); // For the MoreVertical toggle button

  const { isMobile } = useMobile();
  const queryClient = useQueryClient();
  const debounceTimeouts = useRef({});
  const pendingLikes = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside both the dropdown and the toggle button, close the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch my posts with infinite scroll
  const {
    data: postsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["my_posts"],
    queryFn: ({ pageParam = 1 }) => getMyPosts(pageParam),
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

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: togglePostLike,
    onSuccess: (data, postId) => {
      // Update with final API response
      queryClient.setQueryData(["my_posts"], (oldData) => {
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

      // Clear pending state
      delete pendingLikes.current[postId];
    },
    onError: (error, postId) => {
      console.error("Error toggling like:", error);

      // Revert optimistic update on error
      const pendingState = pendingLikes.current[postId];
      if (!pendingState) return;

      queryClient.setQueryData(["my_posts"], (oldData) => {
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

      // Clear pending state
      delete pendingLikes.current[postId];
    },
  });

  // Edit post mutation
  const editPostMutation = useMutation({
    mutationFn: ({ postId, postData }) => editPost(postId, postData),
    onSuccess: () => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries(["my_posts"]);
      closeEditModal();
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    },
  });

  // Flatten all pages into a single array
  const allPosts = useMemo(() => {
    return postsData?.pages?.flatMap((page) => page.results) || [];
  }, [postsData]);
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

      // Update UI immediately
      queryClient.setQueryData(["my_posts"], (oldData) => {
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

      // Set debounced API call
      debounceTimeouts.current[postId] = setTimeout(() => {
        likeMutation.mutate(postId);
        delete debounceTimeouts.current[postId];
      }, 100); // Reduced debounce time
    },
    [likeMutation, allPosts, queryClient]
  );
  const handleViewComments = useCallback((postId) => {
    setSelectedPostId(postId);
    setShowComments(true);
  }, []);

  const handleBackToMain = () => {
    setShowComments(false);
    setSelectedPostId(null);
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    setShowDeletePopup(false);
    queryClient.invalidateQueries(["my_posts"]);
    toast.success("Post deleted successfully!");
  };

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

  // Memoize the posts list component to prevent re-renders when showComments changes

  // Immediate like toggle function

  const toggleDropdown = useCallback(
    (postId) => {
      setShowDropdown(showDropdown === postId ? null : postId);
    },
    [showDropdown]
  );

  const handleEditPost = useCallback((post) => {
    setSelectedPost(post);
    setPostContent(post.description);
    setSelectedImage(post.media_url || null);
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setShowEditModal(true);
    setShowDropdown(null);
  }, []);

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedPost(null);
    setPostContent("");
    setSelectedImage(null);
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setIsUploading(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleRemoveImage = useCallback(() => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setSelectedFile(null);
    setUploadedImageUrl(null);
  }, [selectedImage]);

  const handleSubmitEdit = async () => {
    if (!postContent.trim() && !selectedImage) return;

    try {
      let mediaUrl = selectedPost.media_url;
      let mediaType = selectedPost.media_type;

      // If there's a new selected file, upload it first
      if (selectedFile) {
        setIsUploading(true);

        // Get file extension and content type
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        const contentType = selectedFile.type;

        // Get presigned URL
        const presignedData = await getPresignedUrl({
          file_extension: fileExtension,
          content_type: contentType,
        });

        // Upload image to S3
        await uploadImageToS3(presignedData.upload_url, selectedFile);

        // Set the media URL and type for the post
        mediaUrl = presignedData.file_url;
        mediaType = "image";

        setUploadedImageUrl(presignedData.file_url);
        setIsUploading(false);
      }

      // Update the post
      editPostMutation.mutate({
        postId: selectedPost.id,
        postData: {
          description: postContent,
          media_url: mediaUrl,
          media_type: mediaType,
        },
      });
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeouts = debounceTimeouts.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  const PostsList = useMemo(() => {
    return (
      <div className="font-poppins">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={handleToggleLike}
              onViewComments={handleViewComments}
              showDropdown={showDropdown}
              onToggleDropdown={toggleDropdown}
              onEditPost={handleEditPost}
              onDeletePost={(postId) => setShowDeletePopup(postId)}
              dropdownRef={dropdownRef}
              toggleButtonRef={toggleButtonRef}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No posts available.</p>
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <div className="py-6 text-center">
            <div className="inline-flex items-center gap-2 text-blue-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Loading more posts...
            </div>
          </div>
        )}
      </div>
    );
  }, [
    allPosts,
    handleToggleLike,
    handleViewComments,
    showDropdown,
    toggleDropdown,
    handleEditPost,
    isFetchingNextPage,
  ]);

  // Removed handleScroll since infinite scroll is temporarily disabled

  // Loading state
  if (isLoading && allPosts.length === 0) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
          <HomePageHeader text={"My Posts"} backBtn />
          <div className="flex-1 w-full max-w-none">
            <div className="space-y-6 w-full">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-white border-b-4 border-[#DDE6FF] py-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-48 sm:w-64"></div>
                      <div className="flex gap-2">
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full sm:w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 sm:w-3/4"></div>
                  </div>
                  {/* Random image placeholder for some skeleton items */}
                  {i === 1 && (
                    <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-lg mb-4"></div>
                  )}
                  <div className="flex gap-6">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
          <HomePageHeader text={"My Posts"} backBtn />
          <div className="flex items-center justify-center flex-1 py-20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-400">
                Error loading posts
              </h2>
              <button
                onClick={() => window.location.reload()}
                className="py-2 px-6 bg-blue-500 text-white font-poppins font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (allPosts.length === 0) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
          <HomePageHeader text={"My Posts"} backBtn />
          <div className="flex items-center justify-center flex-1 py-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-400 text-center">
              No posts found
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
        <HomePageHeader text={"My Posts"} backBtn />

        {/* Mobile Layout - Comments fill whole screen */}
        {isMobile ? (
          showComments ? (
            /* Comments Section - Mobile (full screen) */
            <div className="fixed inset-0 z-50 bg-background">
              <div className="h-full flex flex-col p-4">
                <CommentsSection
                  postId={selectedPostId}
                  onBack={handleBackToMain}
                />
              </div>
            </div>
          ) : (
            /* Main Posts Content - Mobile (when comments not shown) */
            <div
              className="flex-1 overflow-auto no-scrollbar"
              onScroll={handleScroll}
            >
              {PostsList}
            </div>
          )
        ) : (
          /* Desktop Layout - Comments on right side */
          <div className="flex gap-8 overflow-auto no-scrollbar">
            {/* Main Posts Content - Desktop */}
            <div
              className="flex-1 overflow-auto no-scrollbar"
              onScroll={handleScroll}
            >
              {PostsList}
            </div>

            {/* Comments Section - appears on the right when a comment button is clicked */}
            {showComments && (
              <div className="flex-shrink-0" style={{ width: "38%" }}>
                <CommentsSection
                  postId={selectedPostId}
                  onBack={handleBackToMain}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      <DeletePopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={() => handleDeletePost(showDeletePopup)}
      />

      {/* Edit Post Modal */}
      <Dialog open={showEditModal} onOpenChange={closeEditModal}>
        <DialogContent
          className="w-[calc(100vw-2rem)] max-w-2xl mx-auto bg-white rounded-2xl p-4 sm:p-6 border-0 shadow-xl [&>button]:hidden"
          onPointerDownOutside={(e) => {
            if (editPostMutation.isPending || isUploading) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (editPostMutation.isPending || isUploading) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (editPostMutation.isPending || isUploading) e.preventDefault();
          }}
        >
          <DialogTitle className="sr-only">Edit Post</DialogTitle>

          <div className="space-y-6">
            {/* User Profile Header */}
            <div className="flex items-center gap-4 font-poppins">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  width={48}
                  height={48}
                  src="/asset/avatar.png"
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold font-poppins overflow-hidden text-ellipsis whitespace-nowrap w-40 sm:w-60 md:w-72 lg:w-96">
                {selectedPost?.username || "User"}
              </h2>
            </div>

            {/* Post Content Textarea */}
            <div className="relative">
              <textarea
                disabled={editPostMutation.isPending || isUploading}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What are you thinking ?"
                className="w-full max-h-[300px] p-4 border no-scrollbar border-gray-200 rounded-xl resize-none font-poppins text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <label
                className={`${
                  editPostMutation.isPending || isUploading
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer"
                } flex items-center gap-2 px-4 py-2  rounded-xl font-poppins font-medium `}
              >
                <ImageIcon size={20} />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {selectedImage && (
              <div className="relative">
                <Image
                  src={selectedImage}
                  alt="Selected image"
                  width={400}
                  height={200}
                  className="w-full max-h-48 object-contain rounded-xl"
                />
                <button
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={14} />
                </button>

                {/* Upload progress indicator */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                      <Loader2
                        size={20}
                        className="animate-spin text-blue-500"
                      />
                      <span className="text-sm font-medium">
                        Uploading image...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Update Button */}
            <Button
              onClick={handleSubmitEdit}
              disabled={
                (!postContent.trim() && !selectedImage) ||
                editPostMutation.isPending ||
                isUploading
              }
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-poppins font-bold text-white py-2 px-6 rounded-xl text-lg h-auto transition-colors flex items-center justify-center gap-2"
            >
              {(editPostMutation.isPending || isUploading) && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {isUploading
                ? "Uploading..."
                : editPostMutation.isPending
                ? "Updating..."
                : "Update Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyPosts;
