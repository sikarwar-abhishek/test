import Image from "next/image";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { ArrowRight } from "lucide-react";
const settingsOptions = [
  {
    id: 1,
    icon: "pen",
    title: "Edit Profile",
  },
  // {
  //   id: 2,
  //   icon: "msg",
  //   title: "About Us",
  // },
  // {
  //   id: 4,
  //   icon: "question",
  //   title: "Help & Support",
  // },
  {
    id: 5,
    icon: "logout",
    title: "Log Out",
  },
];
function SettingsPage() {
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader text={"My Profile"} />
        <div className="">
          <div className="min-h-[150px] relative bg-[#E6EDFF] rounded-xl">
            <div className="min-h-[150px] overflow-hidden relative">
              <Icon name="puzzle" className="right-0 -bottom-12 absolute" />
              <Icon
                name="solar-pen"
                className="w-12 h-12 top-6 left-6 absolute"
              />
              <Icon
                name="math"
                className="right-2/3 translate-x-[130%] top-1/2 -translate-y-[50%] opacity-10 absolute w-24 h-24"
              />
            </div>
            <div className="absolute bottom-0 flex flex-col gap-2 left-1/2 translate-y-[60%] -translate-x-[50%]">
              <div className="relative mx-auto aspect-square h-[100px] rounded-full overflow-hidden bg-gray-200">
                <Image
                  fill
                  quality={100}
                  src="/asset/avatar.png"
                  alt="Profile"
                  priority
                  sizes="100px"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex mx-auto items-center font-poppins">
                <span className="font-medium text-xl text-black leading-4">
                  John Doe
                </span>
                {/* <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md font-semibold">
                  Pro
                </span> */}
              </div>
              <span className="font-poppins text-gray-500 text-center font-normal">
                johndoe@fakemail.com
              </span>
            </div>
          </div>
          <div className="mt-32 mb-16">
            <h1 className="font-poppins font-semibold text-xl text-gray-600 mb-6">
              Account Settings
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settingsOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between py-3 px-2 bg-[#588DFF]/5 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm shadow-md drop-shadow-sm border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <Icon name={option.icon} className="w-8 h-8" />
                    <span className="font-poppins font-medium text-gray-700 text-base">
                      {option.title}
                    </span>
                  </div>
                  <ArrowRight stroke="#969696" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
