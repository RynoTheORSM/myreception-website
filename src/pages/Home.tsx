import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import NameStrip from "@/components/home/NameStrip";
import HowItWorks from "@/components/home/HowItWorks";
import DashboardShowcase from "@/components/home/DashboardShowcase";
import MissedCallCalculator from "@/components/home/MissedCallCalculator";
import RateCard from "@/components/home/RateCard";
import StraightAnswers from "@/components/home/StraightAnswers";
import SignupCTA from "@/components/home/SignupCTA";

const Home = () => (
  <>
    <Nav />
    <main>
      <Hero />
      <NameStrip />
      <HowItWorks />
      <section className="cta-strip" aria-label="Get started">
        <div className="container cta-strip__inner">
          <span className="cta-strip__text">Ready to stop missing calls?</span>
          <a className="btn btn--sm" href="#get-started">Get Lauren on your phones</a>
        </div>
      </section>
      <DashboardShowcase />
      <MissedCallCalculator />
      {/* Rate card + straight answers share one section grid */}
      <section className="section" id="pricing">
        <div className="container rates">
          <RateCard />
          <StraightAnswers />
        </div>
      </section>
      <SignupCTA />
    </main>
    <Footer />
  </>
);

export default Home;
