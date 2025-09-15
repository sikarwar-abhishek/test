"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { HOME_NAV } from "@/src/constants/constant";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getUserProfile } from "@/src/api/auth";

function NavButton({ icon, text, href }) {
  const pathname = usePathname();
  const isActive = href === "/" + pathname.split("/")[1];

  return (
    <Link href={href} className="relative block">
      <div
        className={`flex items-center gap-4 py-2 px-6 rounded-4xl font-sans transition-colors duration-200 ease-in-out
          ${isActive ? "bg-blue-50" : "bg-white hover:bg-gray-100"}`}
      >
        <Icon
          name={icon}
          className={`w-5 h-5 transition-colors duration-200 ease-in-out
            ${isActive ? "text-blue-600" : "text-[rgba(101,103,107,0.8)]"}
          `}
        />
        <span
          className={`leading-8 font-monasans font-medium text-sm transition-colors duration-200 ease-in-out
            ${isActive ? "text-blue-600" : "text-[rgba(101,103,107,0.8)]"}
          `}
        >
          {text}
        </span>
      </div>
    </Link>
  );
}
export default function SideBar() {
  const { data, isLoading } = useQueryHandler(getUserProfile, {
    queryKey: ["user_profile"],
  });
  if (isLoading) return <p>Loading..</p>;
  const value = data?.data;
  return (
    <div className="w-[280px] border-r gap-6 bg-white min-h-screen hidden lg:flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative aspect-square w-38 h-10">
            <Image
              src={"/asset/logo-black.png"}
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-6 space-y-1">
        {HOME_NAV.map((nav) => (
          <NavButton
            key={nav.icon}
            href={nav.href}
            icon={nav.icon}
            text={nav.text}
          />
        ))}
      </nav>
      <div className="bg-[#F9FAFB] drop-shadow-lg rounded-xl mx-6 p-4 flex flex-col gap-2">
        {/* <div className="relative grid aspect-square min-w-[200px] mx-auto">
          <Image
            src="/asset/hero-image.png"
            alt="app_download"
            fill
            className="w-full h-full object-contain"
          />
        </div> */}
        <div className="flex flex-col w-full gap-2">
          <p className="font-poppins text-center text-[15px] font-semibold mx-auto">
            Download the <span className="text-[#4676FA]">Daily IQ</span>&nbsp;
            App!
          </p>
          <button
            className="mx-auto self-start py-2 px-6 sm:py-2 sm:px-8 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-nunito font-bold flex items-center justify-center text-xs
  transition-all duration-300 ease-in-out
  hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
          >
            Download Now
          </button>
        </div>
      </div>
      {/* Bottom Profile Section */}
      <div className="py-6 pl-6 pr-2 border-t hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 rounded-2xl  cursor-pointer">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              width={24}
              height={24}
              src="/asset/avatar.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-gray-500 font-medium text-sm mb-1">
              Welcome back 👋
            </p>
            <div className="flex items-center gap-2">
              <span className="font-medium font-poppins text-sm text-black">
                {value?.first_name} {value?.last_name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
