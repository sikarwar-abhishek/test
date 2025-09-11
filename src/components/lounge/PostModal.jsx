"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/src/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/common/ui/dialog";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { createPost, getPresignedUrl, uploadImageToS3 } from "@/src/api/lounge";
import { toast } from "react-toastify";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

function PostModal({ user, isOpen, onClose, onSubmit }) {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    mutate: post,
    isPending: isPosting,
  } = useMutationHandler(createPost, {
    onSuccess: async (response) => {
      if (response) {
        toast.success("Post created successfully!");
        onClose();
      }
    },
  });
  const handleSubmit = async () => {
    if (!postContent.trim()) return;

    try {
      let mediaUrl = null;
      let mediaType = null;

      // If there's a selected file, upload it first
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

      // Create the post
      post({
        description: postContent,
        media_url: mediaUrl,
        media_type: mediaType,
      });

      queryClient.invalidateQueries({queryKey: ["my_posts"] });

  

      // Reset form
      setPostContent("");
      setSelectedImage(null);
      setSelectedFile(null);
      setUploadedImageUrl(null);
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
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
      console.log(file);
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

  // Cleanup object URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPostContent("");
      handleRemoveImage();
      setIsUploading(false);
    }
  }, [isOpen, handleRemoveImage]);

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
            <h2 className="text-lg font-semibold font-poppins">
              {user.first_name} {user.last_name}
            </h2>
          </div>

          {/* Post Content Textarea */}
          <div className="relative">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What are you thinking ?"
              className="w-full max-h-[300px] p-4 border no-scrollbar border-gray-200 rounded-xl resize-none font-poppins text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
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
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                    <span className="text-sm font-medium">
                      Uploading image...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Post Button */}
          <Button
            onClick={handleSubmit}
            disabled={!postContent.trim() || isPosting || isUploading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-poppins font-bold text-white py-2 px-6 rounded-xl text-lg h-auto transition-colors flex items-center justify-center gap-2"
          >
            {(isPosting || isUploading) && (
              <Loader2 size={18} className="animate-spin" />
            )}
            {isUploading ? "Uploading..." : isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostModal;
