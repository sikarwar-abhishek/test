"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/common/ui/dialog";
import { Users, Image as ImageIcon } from "lucide-react";

function PostModal({ isOpen, onClose, onSubmit }) {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [taggedPeople, setTaggedPeople] = useState([]);

  const handleSubmit = () => {
    if (postContent.trim()) {
      onSubmit({
        content: postContent,
        image: selectedImage,
        taggedPeople: taggedPeople,
      });
      // Reset form
      setPostContent("");
      setSelectedImage(null);
      setTaggedPeople([]);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-0 shadow-xl">
        <DialogTitle className="sr-only">Create New Post</DialogTitle>

        <div className="space-y-6">
          {/* User Profile Header */}
          <div className="flex items-center gap-4 font-poppins">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                width={48}
                height={48}
                src="/asset/avatar.png"
                alt="Lauren Joe's profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold font-poppins">Lauren Joe</h2>
          </div>

          {/* Post Content Textarea */}
          <div className="relative">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What are you thinking ?"
              className="w-full min-h-[300px] p-4 border border-gray-200 rounded-xl resize-none font-poppins text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="relative">
              <Image
                src={selectedImage}
                alt="Selected image"
                width={400}
                height={200}
                className="w-full max-h-48 object-cover rounded-xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
              >
                ×
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl font-poppins font-medium hover:bg-blue-200 transition-colors">
              <Users size={20} />
              Tag People
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl font-poppins font-medium hover:bg-blue-200 transition-colors cursor-pointer">
              <ImageIcon size={20} />
              Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Post Button */}
          <Button
            onClick={handleSubmit}
            disabled={!postContent.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-poppins font-bold text-white py-2 px-6 rounded-xl text-lg h-auto transition-colors"
          >
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostModal;
