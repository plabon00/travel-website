import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HajjBanner from "@/components/HajjBanner";
import Destinations from "@/components/Destinations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";


export default function Home() {
  return (
    <>
      <Header/>
      <Hero />
      <Destinations />
      <AboutUs/>
      <Services />
      <HajjBanner />
    </>
  );
}