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
    <footer className="border-t border-white/10 bg-[#050505] relative z-50 pt-24 pb-12 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16 max-w-7xl mx-auto">
          
          <div className="lg:col-span-3">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <LogoIcon className="w-6 h-6 text-white/80 group-hover:text-brand transition-colors" />
              <span className="font-serif italic text-2xl tracking-wide text-white">LinqChain</span>
            </Link>
            <p className="text-white/50 text-sm font-light mb-8 max-w-sm">
              See. Simulate. Recover.
            </p>
            <div className="flex flex-col gap-2 text-white/50 text-sm font-light">
              <p className="text-white/70 font-bold mb-1 text-xs tracking-widest uppercase">Contact Us</p>
              <a href="tel:8962313507" className="hover:text-white transition-colors">+91 8962313507</a>
              <a href="tel:9098770750" className="hover:text-white transition-colors">+91 9098770750</a>
              <a href="tel:7898896615" className="hover:text-white transition-colors">+91 7898896615</a>
            </div>
          </div>
          
          <div className="lg:col-span-2 lg:col-start-5">
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><Link href="#platform" className="text-white/50 hover:text-white transition-colors">Platform</Link></li>
              <li><Link href="#how-it-works" className="text-white/50 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#use-cases" className="text-white/50 hover:text-white transition-colors">Use Cases</Link></li>
              <li><Link href="#network" className="text-white/50 hover:text-white transition-colors">Network</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><Link href="#" className="text-white/50 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-white/50 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9" id="demo">
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

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto text-center md:text-left">
          <div className="flex flex-col gap-2 text-white/30 font-light text-xs items-center md:items-start">
            <p>&copy; {new Date().getFullYear()} LinqChain. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-x-2 gap-y-1">
              <span><span className="text-white/50 font-medium">Yug Pathak</span> - Co-Founder <span className="hidden sm:inline">&nbsp;|&nbsp;</span></span>
              <span><span className="text-white/50 font-medium">Aayush Patidar</span> - Co-Founder <span className="hidden sm:inline">&nbsp;|&nbsp;</span></span>
              <span><span className="text-white/50 font-medium">Yash Pathak</span> - Co-Founder</span>
            </div>
          </div>
          <button
            onClick={handleExplore}
            disabled={isLoading}
            className="group flex items-center gap-2 text-xs font-bold text-brand hover:text-[#FF9F68]/80 transition-colors uppercase tracking-widest disabled:opacity-70"
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
