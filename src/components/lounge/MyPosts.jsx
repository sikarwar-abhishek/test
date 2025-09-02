"use client";

import { useState } from "react";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HomePageHeader from "../common/HomePageHeader";
import CommentsSection from "./CommentSection";
import Image from "next/image";

const posts = [
  {
    id: 1,
    user: {
      name: "Lauren Joe",
      avatar: "/asset/avatar.png",
    },
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    image: "/asset/white-puzzle.jpg",
    likes: "12K",
    comments: "24",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Lauren Joe",
      avatar: "/asset/avatar.png",
    },
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    image: null,
    likes: "8.5K",
    comments: "156",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    user: {
      name: "John Smith",
      avatar: "/asset/avatar.png",
    },
    content:
      "Just completed today's puzzle challenge! The pattern recognition was quite tricky but very rewarding once solved.",
    image: "/asset/puzzle.jpg",
    likes: "2.1K",
    comments: "89",
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    user: {
      name: "Sarah Wilson",
      avatar: "/asset/avatar.png",
    },
    content:
      "Working on improving my logic skills. Any tips for the advanced challenges?",
    image: null,
    likes: "945",
    comments: "67",
    timestamp: "8 hours ago",
  },
];

function MyPosts() {
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleViewComments = (postId) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleBackToMain = () => {
    setShowComments(false);
    setSelectedPostId(null);
  };

  function PostCard({ post }) {
    return (
      <motion.div
        className="bg-white border-b-4 border-[#DDE6FF] py-6 last:border-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10">
            <Image
              src={post.user.avatar}
              alt={post.user.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{post.user.name}</h3>
          </div>
        </div>

        <p className="mb-4">{post.content}</p>

        {post.image && (
          <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={`${post.user.name} post ${post.id}`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-6 text-gray-500">
          <motion.button
            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsUp size={20} />
            <span>{post.likes}</span>
          </motion.button>
          <motion.button
            onClick={() => handleViewComments(post.id)}
            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={20} />
            <span>{post.comments}</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
        <HomePageHeader text={"My Posts"} backBtn />

        <div className="flex gap-8 overflow-auto no-scrollbar">
          {/* Main Posts Content */}
          <motion.div
            className="flex-1 font-poppins overflow-auto no-scrollbar"
            animate={{
              width: showComments ? "70%" : "100%",
              marginRight: showComments ? "1rem" : "0",
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} />
            ))}
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
                    onBack={handleBackToMain}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MyPosts;
