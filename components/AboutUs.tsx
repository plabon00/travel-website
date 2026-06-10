"use client";
import React from "react";
import { TrendingUp, Star } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Images & Cards Layout - Bottom on Mobile, Left on Desktop */}
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] mx-auto max-w-md lg:max-w-full order-2 lg:order-1 mt-8 lg:mt-0">
            
            {/* Main Image 1 (Middle Left) */}
            <div className="absolute top-1/4 left-0 w-[55%] h-[50%] z-10 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-300">
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop" 
                alt="Airplane in sky" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Main Image 2 (Bottom Right) */}
            <div className="absolute bottom-0 right-4 w-[60%] h-[55%] z-0 rounded-2xl overflow-hidden shadow-xl transition-transform hover:-translate-y-2 duration-300">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop" 
                alt="Travel destination" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Card 1: 50,000+ (Top Right) */}
            <div className="absolute top-0 md:top-4 right-0 md:right-8 bg-white p-4 md:p-5 rounded-2xl shadow-2xl z-20 w-56 md:w-64 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl md:text-2xl font-extrabold text-gray-900">50,000+</h4>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 mb-4 leading-relaxed">
                Successful bookings in 2026 with 5-star ratings and happy travelers.
              </p>
              {/* Overlapping Avatars */}
              <div className="flex -space-x-2">
                {[
                  "https://i.pravatar.cc/100?img=1",
                  "https://i.pravatar.cc/100?img=2",
                  "https://i.pravatar.cc/100?img=3",
                  "https://i.pravatar.cc/100?img=4",
                  "https://i.pravatar.cc/100?img=5"
                ].map((src, i) => (
                  <img key={i} src={src} alt="User" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white object-cover" />
                ))}
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-gray-600">
                  +2k
                </div>
              </div>
            </div>

            {/* Floating Card 2: Best Ratings (Bottom Left) */}
            <div className="absolute bottom-6 md:bottom-10 left-2 md:-left-8 bg-white p-3 md:p-4 rounded-2xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
              <h5 className="text-xs md:text-sm font-bold text-gray-900 mb-2 text-center">Best ratings</h5>
              <div className="flex space-x-1 text-[#ffb700] mb-2">
                <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
                <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
                <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
                <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
                <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
              </div>
              <div className="flex justify-center space-x-1 text-sm md:text-lg">
                <span>🤩</span><span>🥰</span><span>😎</span>
              </div>
            </div>
          </div>

          {/* Text Content - Top on Mobile, Right on Desktop */}
          <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left max-w-2xl mx-auto lg:max-w-none lg:mx-0 lg:pl-10 order-1 lg:order-2">
            <span className="text-[#ff6b00] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">
              A Bit
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 tracking-tight">
              ABOUT US
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
              At SHARK SkyLINK+, we believe that the journey is just as important as the destination. We are your premium travel partner, dedicated to making every aspect of your global exploration seamless, luxurious, and stress-free.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 md:mb-10 text-sm md:text-base">
              From finding the fastest corporate flights to uncovering hidden gems for your family holiday, our advanced search technology and dedicated support team ensure you always get the best value without compromising on quality.
            </p>
            
            <Link 
              href="/about" 
              className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all shadow-lg shadow-[#ff6b00]/30 w-fit hover:-translate-y-0.5"
            >
              Explore More
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}