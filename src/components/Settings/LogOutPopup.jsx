import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/common/ui/dialog";
import { Button } from "@/src/components/common/ui/button";
import { LogOut } from "lucide-react";

function LogOutPopup({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100dvw-2rem)] sm:max-w-xl sm:mx-4 mx-auto sm:p-10 p-4 text-center bg-white rounded-xl border-0 shadow-2xl">
        <DialogTitle className="sr-only">Logout Confirmation</DialogTitle>

        {/* Logout Icon */}
        <div className="flex justify-center ">
          <LogOut className="sm:w-16 sm:h-16 w-8 h-8 text-[#4676FA]" strokeWidth={2} />
        </div>

        {/* Main Question */}
        <h2 className="font-poppins font-normal sm:text-3xl text-2xl text-black">
          Wish to Log Out?
        </h2>

        {/* Warning Message */}
        <p className="font-poppins text-gray-400 sm:text-base text-sm leading-relaxed px-2">
          You might miss today&apos;s challenge and break your progress.
          <br />
          Do you still want to exit?
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1  sm:py-6 py-4 font-poppins font-normal text-lg text-gray-400 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 sm:py-6 py-4 font-poppins font-bold text-lg bg-[#4676FA] hover:bg-[#3B6BD6] text-white rounded-2xl transition-all duration-200 shadow-lg"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LogOutPopup;
