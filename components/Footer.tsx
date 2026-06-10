"use client";
import React from "react";
import { useCurrency, exchangeRates } from "@/app/context/CurrencyContext";
import { Plane, Globe, Shield, CreditCard, ChevronDown } from "lucide-react";

const flags: Record<string, string> = {
  USD: "🇺🇸",
  INR: "🇮🇳",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  AED: "🇦🇪",
  CAD: "🇨🇦"
};

export default function Footer() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  return (
    <footer className="bg-[#0f172a] text-gray-300 py-10 md:py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-12">
        {/* Adjusted Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8">
          
          {/* Brand & Currency */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Plane className="text-[#ff6b00]" /> SHARK SkyLINK+
            </h2>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Your premium travel partner. Explore top destinations, book flights, and plan your next adventure with ease.
            </p>
            {/* Currency Selector with Custom Arrow */}
            <div className="bg-[#1e293b] p-3 rounded-lg border border-gray-700 inline-block w-full sm:w-auto lg:w-full">
              <label className="text-xs text-gray-400 block mb-1 font-semibold uppercase">Selected Currency</label>
              <div className="relative">
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-transparent text-white font-bold outline-none w-full cursor-pointer appearance-none pr-8"
                >
                  {Object.keys(exchangeRates).map((curr) => (
                    <option 
                      key={curr} 
                      value={curr} 
                      className="bg-[#1e293b] text-white"
                    >
                      {flags[curr] || "🌐"} {curr}
                    </option>
                  ))}
                </select>
                {/* Visual arrow since appearance is none */}
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#ff6b00] transition">About Us</a></li>
              <li><a href="#" className="hover:text-[#ff6b00] transition">Careers</a></li>
              <li><a href="#" className="hover:text-[#ff6b00] transition">Press</a></li>
              <li><a href="#" className="hover:text-[#ff6b00] transition">Blog</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#ff6b00] transition">Help Center</a></li>
              <li><a href="#" className="hover:text-[#ff6b00] transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#ff6b00] transition">Cancellation Policy</a></li>
              <li><a href="#" className="hover:text-[#ff6b00] transition">FAQs</a></li>
            </ul>
          </div>

          {/* Trust markers */}
          <div>
            <h3 className="text-white font-bold mb-4">Why Book With Us?</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Shield size={18} className="text-[#ff6b00] shrink-0" />
                <span>Secure Booking</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={18} className="text-[#ff6b00] shrink-0" />
                <span>Global Reach</span>
              </li>
              <li className="flex items-center gap-3">
                <CreditCard size={18} className="text-[#ff6b00] shrink-0" />
                <span>Flexible Payments</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Stacked on mobile, row on desktop */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} SHARK SkyLINK+. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="#" className="hover:text-white transition whitespace-nowrap">Privacy Policy</a>
            <a href="#" className="hover:text-white transition whitespace-nowrap">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}