import HeroSection from "../components/home/HeroSection";
import BookingWidget from "../components/home/BookingWidget";
import TrustBar from "../components/home/TrustBar";
import PopularDestinations from "../components/home/PopularDestinations";
<<<<<<< Updated upstream
import HowItWorks from "../components/home/HowItWorks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import PopularTours from "../components/home/PopularTours";
import Newsletter from "../components/home/Newsletter";
=======
import EssentialCambodia from "../components/home/EssentialCambodia";
import ThingsToDoSection from "../components/home/ThingsToDoSection";
import PopularExperiences from "../components/home/PopularExperiences";
import FeaturedHotels from "../components/home/FeaturedHotels";
import KhmerFood from "../components/home/KhmerFood";
import GreatForSection from "../components/home/GreatForSection";
import RelatedStories from "../components/home/RelatedStories";
import FinalCta from "../components/home/FinalCta";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BookingWidget />
      <TrustBar />
      <PopularDestinations />
<<<<<<< Updated upstream
      <HowItWorks />
      <PopularTours />
      <WhyChooseUs />
      <Newsletter />
    </>
=======

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
    </div>
>>>>>>> Stashed changes
  );
}
