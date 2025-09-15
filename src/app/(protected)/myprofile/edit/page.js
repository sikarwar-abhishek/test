import HomePageHeader from "@/src/components/common/HomePageHeader";
import EditProfile from "@/src/components/Settings/EditProfile";

function page() {
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col sm:gap-12 gap-4 bg-background">
        <HomePageHeader text={"My Profile"} />
        <EditProfile />
      </div>
    </div>
  );
}

export default page;
