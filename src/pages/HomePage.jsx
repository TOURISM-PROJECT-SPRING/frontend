import { useState } from "react";
import Hero from "../components/home/Hero";
import PopularDestinations from "../components/home/PopularDestinations";
import EssentialCambodia from "../components/home/EssentialCambodia";
import ThingsToDoSection from "../components/home/ThingsToDoSection";
import PopularExperiences from "../components/home/PopularExperiences";
import FeaturedHotels from "../components/home/FeaturedHotels";
import KhmerFood from "../components/home/KhmerFood";
import GreatForSection from "../components/home/GreatForSection";
import RelatedStories from "../components/home/RelatedStories";
import FinalCta from "../components/home/FinalCta";
import FloatingTripCart from "../components/home/FloatingTripCart";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Essentials");

  return (
    <div className="relative min-h-screen bg-canvas">
      {/* 1. Immersive Hero with Category Switcher & Booking Console */}
      <Hero />

      {/* 2. Top Destinations Carousel Cards */}
      <PopularDestinations />

      {/* 3. Essential Cambodia & Filterable Activity Cards */}
      <section className="bg-cream border-b border-line/40">
        <EssentialCambodia active={activeCategory} onChange={setActiveCategory} />
        <ThingsToDoSection category={activeCategory} />
      </section>

      {/* 4. Popular Experiences & Handpicked Tours Cards */}
      <PopularExperiences />

      {/* 5. Boutique Hotels & Island Resorts Cards */}
      <FeaturedHotels />

      {/* 6. Discover Khmer Culinary Bento Cards */}
      <KhmerFood />

      {/* 7. Collections by Interest (Couples, Families, Nature) */}
      <GreatForSection />

      {/* 8. Travel Stories & Curated Editorial Guides */}
      <RelatedStories />

      {/* 9. Final Call to Action */}
      <FinalCta />

      {/* 10. Persistent Quick Trip Cart & Plan Trigger */}
      <FloatingTripCart />
    </div>
  );
}