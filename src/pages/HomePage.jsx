import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import PopularDestinations from "../components/home/PopularDestinations";
import PopularExperiences from "../components/home/PopularExperiences";
import FeaturedHotels from "../components/home/FeaturedHotels";
import FeaturedRestaurants from "../components/home/FeaturedRestaurants";
import KhmerFood from "../components/home/KhmerFood";
import CulturalSection from "../components/home/CulturalSection";
import FinalCta from "../components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <PopularDestinations />
      <PopularExperiences />
      <FeaturedHotels />
      <FeaturedRestaurants />
      <KhmerFood />
      <CulturalSection />
      <FinalCta />
    </>
  );
}
