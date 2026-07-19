import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import NameStrip from "@/components/home/NameStrip";
import HowItWorks from "@/components/home/HowItWorks";
import DashboardShowcase from "@/components/home/DashboardShowcase";
import MissedCallCalculator from "@/components/home/MissedCallCalculator";
import RateCard from "@/components/home/RateCard";
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
          <div className="cta-banner">
            <div>
              <p className="cta-banner__title">Ready to stop missing calls?</p>
              <p className="cta-banner__sub">Two minutes to sign up. $0 setup, no contract — leave any month.</p>
            </div>
            <a className="btn btn--lg" href="#get-started">Get Lauren on your phones</a>
          </div>
        </div>
      </section>
      <DashboardShowcase />
      <MissedCallCalculator />
      {/* Trust cards (parked/StraightAnswers) removed from this section —
          reserved for a future trust/FAQ page. */}
      <section className="section" id="pricing">
        <div className="container rates">
          <RateCard />
        </div>
      </section>
      <SignupCTA />
    </main>
    <Footer />
  </>
);

export default Home;
