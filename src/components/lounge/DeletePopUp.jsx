import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/common/ui/dialog";
import { Button } from "@/src/components/common/ui/button";
import { Trash } from "lucide-react";

export default function DeletePopup({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl mx-4 p-10 text-center bg-white rounded-3xl border-0 shadow-2xl">
        <DialogTitle className="sr-only">Delete Confirmation</DialogTitle>

        {/* Logout Icon */}
        <div className="flex justify-center ">
          <Trash className="w-16 h-16 text-red-500" strokeWidth={2} />
        </div>

        {/* Main Question */}
        <h2 className="font-poppins font-normal text-3xl text-black">
          Delete?
        </h2>

        {/* Warning Message */}
        <p className="font-poppins text-gray-400 text-base leading-relaxed px-2">
          Are you sure you want to delete this post?
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 py-6 font-poppins font-normal text-lg text-gray-400 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 py-6 font-poppins font-bold text-lg bg-[#4676FA] hover:bg-[#3B6BD6] text-white rounded-2xl transition-all duration-200 shadow-lg"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
