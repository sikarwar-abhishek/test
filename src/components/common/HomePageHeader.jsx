"use client";

import { ArrowLeft, Bell, Search } from "lucide-react";
import { Input } from "../common/ui/input";
import { useRouter } from "next/navigation";
function HomePageHeader({
  text,
  backBtn = false,
  search = false,
  onBack,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
}) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="flex sm:items-center gap-4 sm:justify-between flex-col sm:flex-row">
      <div className="flex gap-4 items-center">
        <button
          className="border rounded-full p-2 drop-shadow-sm hover:bg-gray-50"
          style={{
            display: backBtn ? "block" : "none",
          }}
          onClick={handleBackClick}
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="md:text-2xl sm:text-xl text-lg font-semibold font-poppins text-[#23272E]">
          {text}
        </h1>
      </div>

      {search && (
        <div className="flex items-center gap-4">
          <div className="relative block w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 sm:w-80 placeholder:text-gray-400 font-nunito placeholder:text-sm bg-muted/50 border-border rounded-3xl"
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default HomePageHeader;
