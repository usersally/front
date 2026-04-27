import About from "@/components/about";
import Footer from "@/components/footer";
import HeroCards from "@/components/hero";
import Navbar from "@/components/home/navbar";

const Home = () => {
  return (
    <main className="pt-20">
      <Navbar />
      <HeroCards />
      <About />
      <Footer />
    </main>
  );
};

export default Home;
