"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  Home,
  Plane,
  Building,
  Globe,
  FileText,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import Topbar from "./Topbar";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  const navItemClass = (path: string) => `
    flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-full transition cursor-pointer border whitespace-nowrap shrink-0
    ${
      isActive(path)
        ? "border-white bg-white/20 text-white shadow-sm"
        : "border-transparent hover:bg-white/10 hover:border-white/20 text-gray-200 hover:text-white"
    }
  `;

  return (
    // The absolute wrapper pulls the entire header out of the document flow
    // so the hero image can sit completely underneath it.
    <div className="absolute top-0 left-0 right-0 z-50 w-full flex flex-col">
      <Topbar />

      <header
        className="
          relative mx-4 md:mx-6 lg:mx-12 mt-2 md:mt-4
          text-white
          py-3 px-4 md:px-6
          flex items-center justify-between
          
          /* Semi-transparent floating glass effect */
          bg-black/30
          backdrop-blur-xl
          border border-white/20
          shadow-2xl
          rounded-2xl md:rounded-full
        "
      >
        {/* Logo */}
        <div className="flex items-center mr-4 z-50 shrink-0">
          <Link
            href="/"
            className="text-xl lg:text-3xl font-extrabold tracking-tight leading-none drop-shadow-md"
          >
            SHARK <br />
            <span className="text-sm lg:text-xl font-bold">SkyLINK+</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-1 lg:space-x-2 text-[12px] lg:text-sm font-semibold">
          <Link href="/" className={navItemClass("/")}>
            <Home size={16} className="mr-1.5 lg:mr-2 lg:w-[18px] lg:h-[18px]" />
            <span>Home</span>
          </Link>

          <Link href="/flights" className={navItemClass("/flights")}>
            <Plane size={16} className="mr-1.5 lg:mr-2 lg:w-[18px] lg:h-[18px]" />
            <span>Flights</span>
          </Link>

          <Link href="/hotels" className={navItemClass("/hotels")}>
            <Building size={16} className="mr-1.5 lg:mr-2 lg:w-[18px] lg:h-[18px]" />
            <span>Stays</span>
          </Link>

          <Link href="/hajj-umrah" className={navItemClass("/hajj-umrah")}>
            <Globe size={16} className="mr-1.5 lg:mr-2 lg:w-[18px] lg:h-[18px]" />
            <span className="hidden xl:inline">Hajj & Umrah</span>
            <span className="xl:hidden">Hajj</span>
          </Link>

          <Link href="/visa" className={navItemClass("/visa")}>
            <FileText size={16} className="mr-1.5 lg:mr-2 lg:w-[18px] lg:h-[18px]" />
            <span>Visa</span>
          </Link>

          {/* Travel Packages Dropdown */}
          <div className="relative group py-2 shrink-0">
            <div className={navItemClass("/packages")}>
              <Briefcase size={16} className="mr-1.5 lg:mr-2 lg:w-[18px] lg:h-[18px]" />
              <span>Packages</span>
              <ChevronDown size={14} className="ml-1.5 group-hover:rotate-180 transition-transform" />
            </div>

            <div
              className="
                absolute right-0 mt-4 w-64
                bg-slate-900/90
                backdrop-blur-2xl
                border border-white/10
                text-white
                rounded-2xl
                overflow-hidden
                shadow-2xl
                hidden group-hover:block
              "
            >
              <Link href="/packages/womens-exclusive" className="block px-4 py-3 hover:bg-[#ff6b00] transition-colors">
                Women's Exclusive Escapes
              </Link>
              <Link href="/packages/sacred-pilgrimages" className="block px-4 py-3 hover:bg-[#ff6b00] transition-colors">
                Hajj & Umrah
              </Link>
              <Link href="/packages/group-adventures" className="block px-4 py-3 hover:bg-[#ff6b00] transition-colors">
                Group Adventures
              </Link>
              <Link href="/packages/corporate-retreats" className="block px-4 py-3 hover:bg-[#ff6b00] transition-colors">
                Elite Corporate Retreats
              </Link>
              <Link href="/packages/others" className="block px-4 py-3 hover:bg-[#ff6b00] transition-colors">
                Others..
              </Link>
            </div>
          </div>
        </nav>

        {/* Desktop WhatsApp Button */}
        <button className="hidden md:flex items-center ml-4 bg-[#ff6b00] hover:bg-[#e66000] text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-bold transition shadow-lg shadow-[#ff6b00]/20 shrink-0">
          <MessageCircle size={18} className="mr-1.5 lg:mr-2" />
          <span className="hidden xl:inline">Chat on WhatsApp</span>
          <span className="hidden md:inline xl:hidden">Chat</span>
        </button>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-white hover:text-[#ff6b00] transition-colors z-50 shrink-0 ml-4 bg-white/10 p-2 rounded-full border border-white/20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="absolute top-[115%] left-0 w-full bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl md:hidden flex flex-col p-6 space-y-4 font-semibold z-40">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl ${isActive("/") ? "bg-white/10 text-[#ff6b00]" : "text-gray-200"}`}>
              <Home size={20} className="mr-3" /> <span>Home</span>
            </Link>
            <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl ${isActive("/flights") ? "bg-white/10 text-[#ff6b00]" : "text-gray-200"}`}>
              <Plane size={20} className="mr-3" /> <span>Flights</span>
            </Link>
            <Link href="/hotels" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl ${isActive("/hotels") ? "bg-white/10 text-[#ff6b00]" : "text-gray-200"}`}>
              <Building size={20} className="mr-3" /> <span>Stays</span>
            </Link>
            <Link href="/hajj-umrah" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl ${isActive("/hajj-umrah") ? "bg-white/10 text-[#ff6b00]" : "text-gray-200"}`}>
              <Globe size={20} className="mr-3" /> <span>Hajj & Umrah</span>
            </Link>
            <Link href="/visa" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl ${isActive("/visa") ? "bg-white/10 text-[#ff6b00]" : "text-gray-200"}`}>
              <FileText size={20} className="mr-3" /> <span>Visa Assistance</span>
            </Link>
            <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl ${isActive("/packages") ? "bg-white/10 text-[#ff6b00]" : "text-gray-200"}`}>
              <Briefcase size={20} className="mr-3" /> <span>Travel Packages</span>
            </Link>

            <button className="flex justify-center items-center bg-[#ff6b00] text-white p-4 rounded-xl font-bold mt-4 shadow-lg shadow-[#ff6b00]/30">
              <MessageCircle size={20} className="mr-2" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        )}
      </header>
    </div>
  );
}