"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useCurrency } from "@/app/context/CurrencyContext";

export default function Destinations() {
  const { convertPrice } = useCurrency();

  // Updated to use basePrice (number) and baseCurrency for the converter
  const destinations = [
    { name: "SAUDI ARABIA", location: "Mecca & Medina", rating: "9.8", reviews: "15K", basePrice: 699, baseCurrency: "USD", img: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?q=80&w=987&auto=format&fit=crop" },
    { name: "DUBAI", location: "UAE City Center", rating: "9.4", reviews: "12K", basePrice: 589, baseCurrency: "USD", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=987&auto=format&fit=crop" },
    { name: "BANGLADESH", location: "Dhaka & Sylhet", rating: "9.1", reviews: "4K", basePrice: 799, baseCurrency: "USD", img: "https://plus.unsplash.com/premium_photo-1686310335921-38acc0679321?q=80&w=2075&auto=format&fit=crop" },
    { name: "UNITED KINGDOM", location: "London & Edinburgh", rating: "8.9", reviews: "9K", basePrice: 499, baseCurrency: "USD", img: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2071&auto=format&fit=crop" },
    { name: "USA DOMESTIC", location: "New York & LA", rating: "9.3", reviews: "22K", basePrice: 199, baseCurrency: "USD", img: "https://plus.unsplash.com/premium_photo-1681803531285-75db948035d3?q=80&w=987&auto=format&fit=crop" },
    { name: "CANADA", location: "Toronto & Vancouver", rating: "9.0", reviews: "7K", basePrice: 599, baseCurrency: "USD", img: "https://images.unsplash.com/photo-1588733103629-b77afe0425ce?q=80&w=987&auto=format&fit=crop" },
  ];

  return (
    <section className="bg-[#f8f9fa] py-20 px-6 md:px-12 text-gray-900 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <p className="text-[#ff6b00] text-sm font-bold tracking-widest uppercase mb-2">Popular Destinations</p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-gray-900">Explore Top Destinations</h2>
          </div>
          <button className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-full hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-orange-50 transition shadow-sm bg-white text-sm">
            VIEW ALL DESTINATIONS →
          </button>
        </div>

        {/* 6-column Grid maintained */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest, i) => (
            <div key={i} className="relative h-80 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1">
              {/* Image Area */}
              <div className="relative h-40 w-full overflow-hidden">
                <Image 
                  src={dest.img} 
                  alt={dest.name} 
                  fill 
                  unoptimized 
                  className="object-cover group-hover:scale-110 transition duration-700" 
                  sizes="16vw"
                />
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white cursor-pointer transition">
                  <Heart size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
                </div>
              </div>

              {/* Detail Area - Fits within h-80 card dimensions */}
              <div className="p-3.5 flex flex-col flex-1">
                <p className="font-extrabold text-[12px] text-gray-900 uppercase tracking-wide truncate">{dest.name}</p>
                <p className="text-[11px] text-gray-500 mb-2 font-medium">{dest.location}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{dest.rating}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{dest.reviews} reviews</span>
                  </div>
                  <p className="text-[#ff6b00] font-bold text-sm tracking-tight">
                    FROM {convertPrice(dest.basePrice, dest.baseCurrency).formatted}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}