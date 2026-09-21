"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Lock, CheckCircle2, Bot, Loader2 } from "lucide-react";
import { LogoIcon } from "@/components/ui/LogoIcon";

export default function LoginPage() {
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const productUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resilience-os.vercel.app/command-center";

  const handleGuestLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGuestLoading(true);
    setTimeout(() => {
      // Append transition=true so the frontend knows to play the boot screen
      window.location.href = `${productUrl}?transition=true`;
    }, 1200); // 1.2s delay for a premium "authenticating" feel
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 w-full overflow-hidden font-sans">
      
      {/* Left Panel - Branding & Stats */}
      <div className="hidden lg:flex w-[40%] bg-[#050505] text-white flex-col relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF9F68]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Fixed Header */}
        <div className="p-12 pb-0 relative z-10 shrink-0">
          <Link href="/" className="flex items-center gap-3 group inline-flex">
            <LogoIcon className="w-8 h-8 text-brand group-hover:scale-105 transition-transform" />
            <span className="font-serif italic text-2xl tracking-wide text-white">LinqChain</span>
          </Link>
        </div>

        {/* Vertically Centered Content */}
        <div className="flex-1 flex flex-col justify-center p-12 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
            One OS.<br/>
            Every supply chain.<br/>
            <span className="text-brand">All resilient.</span>
          </h1>

          <p className="text-white/60 text-lg max-w-md mb-12">
            LinqChain helps modern enterprises predict, simulate, and automatically recover from supply chain disruptions before they impact the bottom line.
          </p>

          {/* Stats Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm max-w-lg mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-white">Good morning, Yug! 👋</span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Active Disruptions</div>
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-red-400 text-xs font-semibold">↑ 14%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Tasks Completed</div>
                <div className="text-2xl font-bold text-white mb-1">342</div>
                <div className="text-emerald-400 text-xs font-semibold">↑ 18%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Recovery Score</div>
                <div className="text-2xl font-bold text-white mb-1">94%</div>
                <div className="text-emerald-400 text-xs font-semibold">↑ 9%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Suppliers</div>
                <div className="text-2xl font-bold text-white mb-1">1,112</div>
                <div className="text-emerald-400 text-xs font-semibold">↑ 7%</div>
              </div>
            </div>
          </div>

          <div className="text-brand text-4xl font-serif italic mb-2">"</div>
          <p className="text-white/80 font-medium text-lg leading-relaxed mb-6 max-w-lg">
            LinqChain has fundamentally transformed the way our logistics teams collaborate and recover from global shocks.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-orange-400 flex items-center justify-center text-black font-bold">
              PS
            </div>
            <div>
              <div className="font-bold text-white">Priya Sharma</div>
              <div className="text-white/50 text-xs">VP of Supply Chain at Acme Corp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form & Features */}
      <div className="flex-1 flex bg-white relative overflow-y-auto custom-scrollbar">
        
        {/* Language selector */}
        <div className="absolute top-8 right-8 hidden sm:block z-50">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Globe className="w-4 h-4" />
            English
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col pt-[12vh] items-center px-6 md:px-8 relative">
          
          <div className="w-full max-w-[560px] flex flex-col">
            
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-10 group inline-flex">
              <LogoIcon className="w-8 h-8 text-brand" />
              <span className="font-serif italic text-2xl tracking-wide text-slate-900">LinqChain</span>
            </Link>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
              <p className="text-slate-500">Sign in to continue to Resilience OS</p>
            </div>

            {/* SSO Buttons */}
            <div className="space-y-3 mb-8">
              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#008FD3" d="M23.99,1.15l22.7,11.39l-22.7,11.39L1.3,12.55L23.99,1.15z"></path>
                  <path fill="#0071A6" d="M1.3,12.55v22.79l22.7,11.39V23.94L1.3,12.55z"></path>
                  <path fill="#005B85" d="M46.7,12.55v22.79l-22.7,11.39V23.94L46.7,12.55z"></path>
                  <path fill="#FFB700" d="M23.99,1.15l14.47,7.26l-14.47,7.26L9.53,8.42L23.99,1.15z"></path>
                </svg>
                Continue with SAP
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
                <svg width="20" height="20" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z"></path>
                  <path fill="#7fba00" d="M11 1h9v9h-9z"></path>
                  <path fill="#00a4ef" d="M1 11h9v9H1z"></path>
                  <path fill="#ffb900" d="M11 11h9v9h-9z"></path>
                </svg>
                Continue with Microsoft
              </button>
              <button 
                onClick={handleGuestLogin}
                disabled={isGuestLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700 disabled:opacity-70"
              >
                {isGuestLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                    Authenticating Guest Session...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Continue as Guest
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">OR</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all text-sm tracking-widest"
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold py-3.5 px-4 rounded-lg transition-colors mt-2 shadow-md shadow-indigo-500/20"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              Your data is protected with enterprise-grade security
            </div>

            <div className="mt-12 mb-12 text-center text-sm text-slate-500">
              Don't have an account? <Link href="#" className="text-blue-600 font-semibold hover:underline">Request access</Link>
            </div>

          </div>
        </div>

        {/* Floating Features - visible on very large screens only to perfectly match reference */}
        <div className="hidden xl:flex flex-col w-[400px] bg-white p-12 shrink-0 relative pt-[15vh]">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-14 shadow-sm relative w-full mt-4">
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white border border-slate-100 rounded-xl p-3 shadow-md">
              <LogoIcon className="w-5 h-5 text-brand" />
            </div>
            <div className="ml-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Dr. Supply</div>
                <div className="text-[11px] text-slate-500 font-medium">AI Co-pilot</div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-6">Why teams love Resilience OS</h3>
          <ul className="space-y-6">
            <li className="flex gap-4 items-start">
              <CheckCircle2 className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-[13px] text-slate-600 leading-relaxed font-medium">All-in-one command center for supply chain visibility</span>
            </li>
            <li className="flex gap-4 items-start">
              <CheckCircle2 className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-[13px] text-slate-600 leading-relaxed font-medium">Powerful simulations and real-time impact analysis</span>
            </li>
            <li className="flex gap-4 items-start">
              <CheckCircle2 className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-[13px] text-slate-600 leading-relaxed font-medium">Direct SAP S/4HANA read/write integrations</span>
            </li>
            <li className="flex gap-4 items-start">
              <CheckCircle2 className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-[13px] text-slate-600 leading-relaxed font-medium">Secure, compliant, and built for enterprise</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
