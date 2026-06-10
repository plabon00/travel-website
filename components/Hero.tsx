"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plane, 
  Building, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  MessageCircle
} from "lucide-react";
import FlightSearchWidget from "./FlightSearchWidget";
import HotelSearchWidget from "./HotelSearchWidget"; 

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"flights" | "hotels">("flights");

  return (
    // Changed pt-40 to pt-[180px] md:pt-48 to ensure content never hides under the navbar on mobile
    <section 
      className="relative bg-[#0f172a] text-white pt-[180px] sm:pt-44 lg:pt-48 pb-24 px-4 md:px-12 bg-cover bg-center min-h-screen flex items-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        
        {/* Left Side: Headlines */}
        <div>
          <div className="inline-block border border-[#ff6b00] text-[#ff6b00] px-3 py-1 text-[10px] md:text-xs font-bold mb-4 rounded uppercase tracking-wider bg-black/30 backdrop-blur-sm">
            Explore More
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 drop-shadow-lg">
            EXCEPTIONAL<br />
            <span className="text-[#ff6b00]">PREMIUM TRAVEL</span><br />
            MADE SIMPLE
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-8 mt-4 max-w-md drop-shadow-md">
            Seamless corporate and leisure bookings from your trusted USA partner.
          </p>

          {/* Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 text-[11px] md:text-xs font-semibold text-gray-200">
            <div className="flex items-center space-x-2 bg-black/40 w-fit px-3 py-2 rounded-md backdrop-blur-sm border border-white/10">
              <CheckCircle size={16} className="text-[#ff6b00] shrink-0" /> <span>Best Price Guarantee</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/40 w-fit px-3 py-2 rounded-md backdrop-blur-sm border border-white/10">
              <Clock size={16} className="text-[#ff6b00] shrink-0" /> <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/40 w-fit px-3 py-2 rounded-md backdrop-blur-sm border border-white/10">
              <ShieldCheck size={16} className="text-[#ff6b00] shrink-0" /> <span>Trusted & Secure</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/40 w-fit px-3 py-2 rounded-md backdrop-blur-sm border border-white/10">
              <CheckCircle size={16} className="text-[#ff6b00] shrink-0" /> <span>Easy Reservations</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <button 
              onClick={() => router.push("/flights")}
              className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-3.5 md:py-3 rounded-full font-bold flex items-center justify-center space-x-2 transition shadow-lg shadow-[#ff6b00]/30 w-full sm:w-auto"
            >
              <Plane size={18} /> 
              <span>EXPLORE OPTIONS</span>
            </button>
            <button className="bg-black/40 backdrop-blur-sm border border-white/50 hover:bg-white hover:text-black text-white px-6 py-3.5 md:py-3 rounded-full font-bold flex items-center justify-center space-x-2 transition w-full sm:w-auto">
              <MessageCircle size={18} /> <span>WhatsApp Now</span>
            </button>
          </div>
        </div>

        {/* Right Side: Dark Booking Widget */}
        <div className="bg-[#111827]/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-h-[500px] flex flex-col relative z-20">
          
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-gray-700 mb-6 bg-black/50 p-1">
            <button 
              onClick={() => setActiveTab("flights")}
              className={`flex-1 py-3 flex justify-center items-center space-x-2 font-semibold rounded-lg transition ${
                activeTab === "flights" ? "bg-[#ff6b00] text-white shadow-md" : "bg-transparent hover:bg-gray-800 text-gray-300"
              }`}
            >
              <Plane size={18} /> <span>Flights</span>
            </button>
            <button 
              onClick={() => setActiveTab("hotels")}
              className={`flex-1 py-3 flex justify-center items-center space-x-2 font-semibold rounded-lg transition ${
                activeTab === "hotels" ? "bg-[#ff6b00] text-white shadow-md" : "bg-transparent hover:bg-gray-800 text-gray-300"
              }`}
            >
              <Building size={18} /> <span>Hotels</span>
            </button>
          </div>

          {/* Render Active Component */}
          {activeTab === "flights" ? (
            <FlightSearchWidget />
          ) : (
            <HotelSearchWidget /> 
          )}

          <div className="text-center mt-4 text-xs text-gray-500">
            Powered by <span className="font-bold text-white">travelpayouts</span>
          </div>
        </div>
      </div>
    </section>
  );
}