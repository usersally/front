import About from "@/components/about";
import Footer from "@/components/footer";
import HeroCards from "@/components/hero";
import Navbar from "@/components/home/navbar";
import StudentLevelSection from "@/components/levels";
import LocationSection from "@/components/location";

const Home = () => {
  return (
    <main className="pt-20">
      <Navbar />
      <HeroCards />
      <StudentLevelSection />
      <LocationSection />
      <About />
      <Footer />
    </main>
  );
};

export default Home;
