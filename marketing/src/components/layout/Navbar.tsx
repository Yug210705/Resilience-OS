"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/ui/LogoIcon";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Platform", href: "#platform" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "Network", href: "#network" },
  { name: "Careers", href: "#careers" },
  { name: "Book a Demo", href: "#demo" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  const productUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resilience-os.vercel.app/command-center";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 w-full pt-4 md:pt-6 pointer-events-none transition-all duration-300",
      isScrolled ? "bg-black/80 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none pb-4 md:pb-0" : ""
    )}>
      <div className="w-full px-4 md:px-12 flex items-center justify-between pointer-events-auto">
        
        {/* Top Left Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-3 z-50 mix-blend-difference group">
            <LogoIcon className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:scale-105 transition-transform" />
            <span className="font-serif italic text-2xl md:text-3xl tracking-wide text-white flex items-center">
              Linq<span className="ml-[2px]">Chain</span>
            </span>
          </Link>
        </div>

        {/* Center Floating Navbar */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors duration-300 px-5 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex flex-1 justify-end items-center">
          <button
            onClick={handleExplore}
            disabled={isNavigating}
            className="flex items-center gap-2 text-sm font-bold bg-[#FF9F68] text-black px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[#FF9F68]/20 disabled:opacity-70"
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Explore the platform"
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex-1 flex justify-end md:hidden">
          <button
            className="z-50 text-white bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-[#0D0D0E]/95 backdrop-blur-3xl z-40 flex flex-col pt-32 px-6 md:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-serif italic text-white hover:text-brand transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-10 pt-10 border-t border-white/10 w-full flex justify-center">
            <button
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleExplore(e);
              }}
              disabled={isNavigating}
              className="flex items-center gap-2 text-lg font-bold bg-[#FF9F68] text-black px-10 py-4 rounded-full hover:opacity-90 transition-colors shadow-lg disabled:opacity-70"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing...
                </>
              ) : (
                "Explore the platform"
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
