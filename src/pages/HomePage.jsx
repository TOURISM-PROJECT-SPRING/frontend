import { useState } from "react";
import Hero from "../components/home/Hero";
import EssentialCambodia from "../components/home/EssentialCambodia";
import ThingsToDoSection from "../components/home/ThingsToDoSection";
import GreatForSection from "../components/home/GreatForSection";
import RelatedStories from "../components/home/RelatedStories";
import FinalCta from "../components/home/FinalCta";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Essentials");

  return (
    <>
      <Hero />
      <section className="bg-cream">
        <EssentialCambodia active={activeCategory} onChange={setActiveCategory} />
        <ThingsToDoSection category={activeCategory} />
      </section>
      <GreatForSection />
      <RelatedStories />
      <FinalCta />
    </>
  );
}