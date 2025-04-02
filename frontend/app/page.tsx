import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </main>
    </div>
  );
}
