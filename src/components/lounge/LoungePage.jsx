"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ThumbsUp, MessageCircle, ArrowRight } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";
import Link from "next/link";
import PostModal from "./PostModal";
import CommentsSection from "./CommentSection";

const stats = [
  {
    title: "Community Score",
    value: 80,
  },
  {
    title: "Fitness Score",
    value: 85,
  },
  {
    title: "Proficiency Score",
    value: 85,
  },
];

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
function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-xl p-4 text-center shadow-md drop-shadow-sm">
      <div className="text-3xl font-semibold text-blue-500 mb-1">
        {stat.value}
      </div>
      <div className="text-sm font-medium uppercase">{stat.title}</div>
    </div>
  );
}

function LoungePage() {
  const [postText, setPostText] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleInputClick = () => {
    setIsPostModalOpen(true);
  };

  const handlePostSubmit = () => {
    if (postText.trim()) {
      console.log("Posting:", postText);
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
  function PostCard({ post }) {
    return (
      <div className="bg-white border-b-4 border-[#DDE6FF] py-6 last:border-none">
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
          <button className="flex items-center gap-2 hover:text-blue-500">
            <ThumbsUp size={20} />
            <span>{post.likes}</span>
          </button>
          <button
            onClick={() => handleViewComments(post.id)}
            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-poppins">{post.comments}</span>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
        <HomePageHeader text={"Lounge"} />

        <div className="flex gap-8 mt-6 overflow-auto no-scrollbar">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* User Profile Section */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6 font-poppins">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src="/asset/avatar.png"
                      alt="John Doe"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                      John Doe
                    </h2>
                  </div>
                </div>
                <Link
                  href={"/lounge/myposts"}
                  className="bg-white rounded-lg p-3 text-gray-500 text-sm hover:text-gray-800 font-medium"
                >
                  My Post
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 font-poppins">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </div>
            </div>

            {/* Post Creation */}
            <div className="bg-white rounded-xl p-2 border">
              <div className="flex items-center gap-3 font-poppins">
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
                  className="flex-1 px-4 py-2 outline-none"
                  readOnly
                />
              </div>
            </div>

            {/* Feed Posts */}
            <div className="font-poppins">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          {showComments ? (
            <CommentsSection
              postId={selectedPostId}
              onBack={handleBackToSidebar}
            />
          ) : (
            /* Original Sidebar */
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
          )}
        </div>
      </div>
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
}

export default LoungePage;
