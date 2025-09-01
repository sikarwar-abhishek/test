"use client";

import { GAME_STATS } from "@/src/constants/constant";
import Header from "../common/Header";
import Icon from "../common/Icon";
import GameStats from "./GameStats";
import HeroSection from "./HeroSection";
import Footer from "../common/Footer";
import TrialGames from "./TrialGames";
import Testimonials from "./Testimonials";
import FaqSection from "./FaqSection";

function LandingPage() {
  return (
    <>
      <div className="md:px-22 px-6 bg-[linear-gradient(150.5deg,white_55%,#F4F6FB_55%)] min-h-screen overflow-hidden">
        <Header />
        <HeroSection />
        <div className="flex justify-between max-w-6xl pb-12 relative items-center mt-14">
          <Icon name="molecule" className="absolute bottom-12 -right-[300px]" />
          {GAME_STATS.map((stat) => (
            <GameStats key={stat.value} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>

      {/* trial games */}
      <TrialGames />

      <div className="bg-[linear-gradient(-38.5deg,white_45%,#F4F6FB_45%)] overflow-hidden">
        {/* testiminial */}
        <Testimonials />
        {/* FAQ */}
        <FaqSection />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default LandingPage;
