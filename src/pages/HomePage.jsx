import HeroSection from "../components/home/HeroSection";
import BookingWidget from "../components/home/BookingWidget";
import TrustBar from "../components/home/TrustBar";
import PopularDestinations from "../components/home/PopularDestinations";
import HowItWorks from "../components/home/HowItWorks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import PopularTours from "../components/home/PopularTours";
import Newsletter from "../components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BookingWidget />
      <TrustBar />
      <PopularDestinations />
      <HowItWorks />
      <PopularTours />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
}
