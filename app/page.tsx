"use client";
import { useState } from "react";

import About from "@/components/home/about";
import Footer from "@/components/home/footer";
import HeroCards from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import LocationSection from "@/components/home/location";
import StudentLevelSection, { LevelType } from "@/components/home/levels";

const Home = () => {
  const [selectedLevel, setSelectedLevel] = useState<LevelType>("bac");

  return (
    <main className="pt-20">
      <Navbar setSelectedLevel={setSelectedLevel} />

      <HeroCards />

      <StudentLevelSection
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
      />

      <LocationSection />

      <About />

      <Footer />
    </main>
  );
};

export default Home;
