"use client";
import React from "react";
import { ArrowRight, Star } from "lucide-react";

export default function HajjBanner() {
  return (
    <section className="px-6 md:px-12 pb-16 bg-white">
      <div className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-br from-[#fdfbf7] to-[#f4f0e6] rounded-[1.5rem] shadow-lg border border-amber-100 flex items-center justify-center">
        
        {/* Left End Image with Fade Effect */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-full md:w-1/3 opacity-30 md:opacity-80 pointer-events-none"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to right, black 10%, transparent 80%)',
            maskImage: 'linear-gradient(to right, black 10%, transparent 80%)'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000&auto=format&fit=crop" 
            alt="Islamic Architecture" 
            className="w-full h-full object-cover object-right"
          />
        </div>

        {/* Right End Image with Fade Effect */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 opacity-30 md:opacity-80 pointer-events-none"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to left, black 10%, transparent 80%)',
            maskImage: 'linear-gradient(to left, black 10%, transparent 80%)'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1565552643952-250e26cb7018?q=80&w=1000&auto=format&fit=crop" 
            alt="Kaaba View" 
            className="w-full h-full object-cover object-left"
          />
        </div>

        {/* Main Content Layout - Thin & Compact */}
        <div className="relative z-10 w-full px-4 py-8 md:py-10 flex flex-col items-center justify-center text-center">
          
          {/* Special Offer Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-amber-200 text-amber-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-3 md:mb-4 uppercase tracking-widest shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Special Offer
          </div>

          {/* Glassmorphic Pill Title Container - Horizontal on Desktop */}
          <div className="bg-white/60 backdrop-blur-md border border-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 md:px-8 md:py-4 mb-4 flex flex-col md:flex-row items-center gap-1 md:gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
              HAJJ & UMRAH
            </h2>
            <span className="hidden md:block text-amber-300 text-2xl">|</span>
            <p className="text-amber-600 text-lg md:text-xl font-bold tracking-wide leading-none">
              Packages 2026
            </p>
          </div>

          {/* Subtitle / Details */}
          <p className="text-gray-800 text-sm md:text-base mb-6 max-w-xl leading-relaxed font-semibold drop-shadow-sm mx-auto">
            Experience a comfortable stay, premium service, and affordable pricing for your sacred journey.
          </p>

          {/* Bottom Action Row: Button & Markers next to each other on Desktop */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* CTA Button */}
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm px-6 py-3 rounded-full shadow-md shadow-amber-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
              VIEW PACKAGES <ArrowRight size={16} />
            </button>

            {/* Mini Trust Markers */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs font-bold text-gray-700 bg-white/50 backdrop-blur-sm px-4 py-2 md:py-2.5 rounded-full border border-white/60">
              <span className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /> 5-Star Hotels</span>
              <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
              <span>Guided Tours</span>
              <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
              <span>Visa Included</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}