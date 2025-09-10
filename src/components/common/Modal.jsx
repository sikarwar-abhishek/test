"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/common/ui/dialog";
import { Button } from "@/src/components/common/ui/button";
import Image from "next/image";
console.log('ok')
export function Modal({ isOpen, onClose, onSubmit }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl p-8 border-0 shadow-xl">
        <DialogTitle className="sr-only">
          Puzzle Submission Confirmation
        </DialogTitle>
        <div className="text-center space-y-6">
          {/* Celebration Illustration */}
          <div className="relative mx-auto aspect-square max-h-24">
            <Image
              fill
              quality={100}
              src="/asset/party-popper.svg"
              alt="Celebration"
              className="w-24 h-24 object-cover"
            />
          </div>

          {/* Congratulations Text */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium font-poppins text-gray-900 leading-tight">
              Congratulations, your puzzle has been submitted.
            </h2>

            <p className="text-[22px] font-poppins font-semibold text-blue-500">
              The next puzzle is unlocked !
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 font-poppins font-bold text-white py-3 px-6 rounded-xl text-lg h-auto"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
