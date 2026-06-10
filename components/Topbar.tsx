import { Phone, Mail, HelpCircle, Share2, Camera, PlayCircle } from "lucide-react";

export default function Topbar() {
  return (
    <div className="bg-[#0b0f19] text-gray-300 text-[11px] md:text-xs py-2.5 border-b border-gray-800">
      {/* overflow-x-auto and whitespace-nowrap force the single line scroll.
        The custom bracket classes hide the scrollbar across all browsers. 
      */}
      <div className="px-4 md:px-6 lg:px-12 flex items-center justify-between overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
        
        {/* Left Side: Support & Contact */}
        <div className="flex items-center space-x-6 shrink-0 mr-6">
          <div className="flex items-center space-x-1.5">
            <HelpCircle size={14} className="text-gray-400 shrink-0" />
            <span>24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Phone size={14} className="text-[#ff6b00] shrink-0" />
            <span>+1 (888) 123-4567</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Mail size={14} className="text-[#ff6b00] shrink-0" />
            <span>info@sharkskylink.com</span>
          </div>
        </div>

        {/* Right Side: Socials */}
        <div className="flex items-center space-x-4 shrink-0 pl-6 border-l border-gray-800">
          <Share2 size={14} className="hover:text-white cursor-pointer shrink-0" />
          <Camera size={14} className="hover:text-white cursor-pointer shrink-0" />
          <PlayCircle size={14} className="hover:text-white cursor-pointer shrink-0" />
          <span className="font-bold hover:text-white cursor-pointer shrink-0">TikTok</span> 
        </div>

      </div>
    </div>
  );
}