"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { LogoIcon } from "@/components/ui/LogoIcon";

export default function Footer() {
  const productUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resilience-os.vercel.app/command-center";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  return (
    <footer className="border-t border-white/10 bg-[#050505] relative z-50 pt-12 md:pt-24 pb-8 md:pb-12 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-16 max-w-7xl mx-auto">
          
          {/* Logo + tagline + contact */}
          <div className="col-span-2 md:col-span-1 lg:col-span-3">
            <Link href="/" className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 group">
              <LogoIcon className="w-5 h-5 md:w-6 md:h-6 text-white/80 group-hover:text-brand transition-colors" />
              <span className="font-serif italic text-xl md:text-2xl tracking-wide text-white">LinqChain</span>
            </Link>
            <p className="text-white/50 text-xs md:text-sm font-light mb-4 md:mb-8 max-w-sm">
              See. Simulate. Recover.
            </p>
            <div className="hidden md:flex flex-col gap-2 text-white/50 text-sm font-light">
              <p className="text-white/70 font-bold mb-1 text-xs tracking-widest uppercase">Contact Us</p>
              <a href="tel:8962313507" className="hover:text-white transition-colors">+91 8962313507</a>
              <a href="tel:9098770750" className="hover:text-white transition-colors">+91 9098770750</a>
              <a href="tel:7898896615" className="hover:text-white transition-colors">+91 7898896615</a>
            </div>
          </div>
          
          {/* Product links */}
          <div className="lg:col-span-2 lg:col-start-5">
            <h4 className="font-bold text-white mb-3 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs">Product</h4>
            <ul className="space-y-2 md:space-y-4 font-light text-xs md:text-sm">
              <li><Link href="#platform" className="text-white/50 hover:text-white transition-colors">Platform</Link></li>
              <li><Link href="#how-it-works" className="text-white/50 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#use-cases" className="text-white/50 hover:text-white transition-colors">Use Cases</Link></li>
              <li><Link href="#network" className="text-white/50 hover:text-white transition-colors">Network</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-3 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs">Legal</h4>
            <ul className="space-y-2 md:space-y-4 font-light text-xs md:text-sm">
              <li><Link href="#" className="text-white/50 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-white/50 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          {/* Book a Demo — hidden on mobile */}
          <div className="hidden md:block lg:col-span-4 lg:col-start-9" id="demo">
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Book a Demo</h4>
            <p className="text-white/50 text-sm font-light mb-6">
              Leave your details and we&apos;ll get back to you to schedule a personalized walkthrough.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="Name" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50 transition-colors"
                required
              />
              <input 
                type="email" 
                placeholder="Work Email" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-[#FF9F68] text-black font-bold text-sm px-4 py-3 rounded-lg hover:opacity-90 transition-opacity mt-2"
              >
                Request Demo
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 max-w-7xl mx-auto text-center md:text-left">
          <div className="flex flex-col gap-1 md:gap-2 text-white/30 font-light text-[10px] md:text-xs items-center md:items-start">
            <p>&copy; {new Date().getFullYear()} LinqChain. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-1 md:gap-x-2 gap-y-0.5">
              <span><span className="text-white/50 font-medium">Yug Pathak</span> · Co-Founder</span>
              <span className="text-white/20">|</span>
              <span><span className="text-white/50 font-medium">Aayush Patidar</span> · Co-Founder</span>
              <span className="text-white/20">|</span>
              <span><span className="text-white/50 font-medium">Yash Pathak</span> · Co-Founder</span>
            </div>
          </div>
          <button
            onClick={handleExplore}
            disabled={isLoading}
            className="group flex items-center gap-2 text-[10px] md:text-xs font-bold text-brand hover:text-[#FF9F68]/80 transition-colors uppercase tracking-widest disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                Explore the platform
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
