import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import ProductThesis from "@/components/sections/ProductThesis";
import CoreCapabilities from "@/components/sections/CoreCapabilities";
import CrashTest from "@/components/sections/CrashTest";
import NetworkTwin from "@/components/sections/NetworkTwin";
import DecisionSupport from "@/components/sections/DecisionSupport";
import UseCases from "@/components/sections/UseCases";
import HowItWorks from "@/components/sections/HowItWorks";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full relative">
        <Hero />
        <Problem />
        <ProductThesis />
        <CoreCapabilities />
        <CrashTest />
        <NetworkTwin />
        <DecisionSupport />
        <UseCases />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
