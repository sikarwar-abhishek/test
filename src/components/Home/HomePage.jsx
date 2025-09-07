"use client";
import { Bell, Search } from "lucide-react";
import { Input } from "../common/ui/input";
import Icon from "../common/Icon";
import RecommendedSection from "./RecommendedSection";
import { useState } from "react";
import Trophies from "./Trophies";
import Progress from "./Progress";
import NavTabs from "./NavTabs";
import HomePageHeader from "../common/HomePageHeader";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getUserProfile } from "@/src/api/auth";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("recommended");

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen px-10 py-6 flex-1 flex flex-col gap-12 bg-background">
        {/* Header */}
        <HomePageHeader text={"Home"} />

        {/* Navigation Tabs */}
        <main className="space-y-10 overflow-auto no-scrollbar">
          <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "recommended" && <RecommendedSection />}
          {activeTab === "progress" && <Progress />}
          {activeTab === "trophies" && <Trophies />}
        </main>

        <Icon name="puzzle" className="w-24 h-24 absolute bottom-16 right-12" />
        <Icon
          name="math"
          className="w-16 h-16 absolute bottom-[35dvh] z-10 opacity-20 left-12"
        />
      </div>
    </div>
  );
}
