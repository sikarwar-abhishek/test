"use client";

import { ArrowLeft, Bell, Search } from "lucide-react";
import { Input } from "../common/ui/input";
import { useRouter } from "next/navigation";
function HomePageHeader({ text, backBtn = false }) {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <button
          className="border rounded-full p-2 drop-shadow-sm hover:bg-gray-50"
          style={{
            display: backBtn ? "block" : "none",
          }}
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="md:text-2xl sm:text-base text-xs font-semibold font-poppins text-[#23272E]">
          {text}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search"
            className="pl-10 w-80 placeholder:text-gray-400 font-nunito placeholder:text-sm bg-muted/50 border-border rounded-3xl"
          />
        </div>

        {/* Notification Bell */}
        {/* <div className="relative">
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white w-4 h-4 flex justify-center items-center text-xs">
            4
          </span>
        </div> */}

        {/* User Avatar */}
        {/* <div>
              <Icon name="reward" className="w-8 h-8 text-muted-foreground" />
            </div> */}
      </div>
    </header>
  );
}

export default HomePageHeader;
