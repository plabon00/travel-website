"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plane, ArrowLeftRight, Calendar as CalendarIcon, Users, Plus, Trash2, ChevronDown, Search } from "lucide-react";
import DestinationPopup from "./DestinationPopup";
import CalendarPopup from "./CalendarPopup";
import PassengerPopup from "./PassengerPopup";

// --- Helpers ---
const formatShortDate = (date: Date | null) => {
  if (!date) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} '${date.getFullYear().toString().slice(2)}`;
};

const formatDayName = (date: Date | null) => {
  if (!date) return "";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

const formatApiDate = (date: Date | null) => {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getCityName = (val: string) => val.split(" (")[0] || val;
const getAirportCode = (val: string) => val.includes("(") ? val.split(" (")[1].replace(")", "") : val;

export interface FlightSearchBarProps {
  initialTripType?: "round" | "oneway" | "multi";
  initialFrom?: string;
  initialTo?: string;
  initialDepartDate?: Date | null;
  initialReturnDate?: Date | null;
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
  initialTravelClass?: string;
}

export default function FlightSearchBar(props: FlightSearchBarProps) {
  const router = useRouter();
  const [tripType, setTripType] = useState<"round" | "oneway" | "multi">(props.initialTripType || "round");
  
  const [fromValue, setFromValue] = useState(props.initialFrom || "New York (JFK)");
  const [toValue, setToValue] = useState(props.initialTo || "Dubai (DXB)");
  const [departDate, setDepartDate] = useState<Date | null>(props.initialDepartDate !== undefined ? props.initialDepartDate : new Date(2026, 5, 11)); 
  const [returnDate, setReturnDate] = useState<Date | null>(props.initialReturnDate !== undefined ? props.initialReturnDate : new Date(2026, 5, 12));

  const [multiFlights, setMultiFlights] = useState<{id: number, from: string, to: string, date: Date | null}[]>([
    { id: 1, from: "New York (JFK)", to: "Dubai (DXB)", date: new Date(2026, 5, 11) },
    { id: 2, from: "Dubai (DXB)", to: "London (LHR)", date: new Date(2026, 5, 15) }
  ]);

  const [passengerState, setPassengerState] = useState({
    adults: props.initialAdults ?? 1,
    children: props.initialChildren ?? 0,
    infants: props.initialInfants ?? 0,
    travelClass: props.initialTravelClass || "Economy"
  });

  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const addMultiFlight = () => {
    if (multiFlights.length < 5) {
      const lastFlight = multiFlights[multiFlights.length - 1];
      setMultiFlights([...multiFlights, { id: Date.now(), from: lastFlight.to, to: "", date: null }]);
    }
  };
  const removeMultiFlight = (id: number) => setMultiFlights(multiFlights.filter(f => f.id !== id));
  const updateMultiFlight = (id: number, field: string, value: any) => {
    setMultiFlights(multiFlights.map(f => f.id === id ? { ...f, [field]: value } : f));
    if (field !== 'date') setActivePopup(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) setActivePopup(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTripTypeChange = (type: "round" | "oneway" | "multi") => {
    setTripType(type);
    if (type === "oneway") setReturnDate(null);
  };

  const handleCalendarSelect = (date: Date) => {
    if (activePopup === "depart") {
      if (tripType === "oneway") {
        setDepartDate(date);
        setActivePopup(null); 
      } else {
        if (!departDate || returnDate || date < departDate) {
          setDepartDate(date);
          setReturnDate(null); 
        } else {
          setReturnDate(date);
          setActivePopup(null); 
        }
      }
    } else if (activePopup === "return") {
      if (departDate && date >= departDate) {
        setReturnDate(date);
        setActivePopup(null); 
        if (tripType === "oneway") setTripType("round");
      }
    } else if (activePopup?.startsWith("date-multi-")) {
      const id = parseInt(activePopup.split("-")[2]);
      updateMultiFlight(id, "date", date);
      setActivePopup(null);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    const extractIata = (str: string) => str.match(/\(([A-Z]{3})\)/)?.[1] || str;

    const queryParams = new URLSearchParams({
      tripType,
      adults: passengerState.adults.toString(),
      children: passengerState.children.toString(),
      infants: passengerState.infants.toString(),
      travelClass: passengerState.travelClass,
    });

    if (tripType === "multi") {
      const slices = multiFlights.map(f => ({ origin: extractIata(f.from), destination: extractIata(f.to), date: formatApiDate(f.date) }));
      queryParams.append("slices", JSON.stringify(slices));
    } else {
      queryParams.append("origin", extractIata(fromValue));
      queryParams.append("destination", extractIata(toValue));
      queryParams.append("departDate", formatApiDate(departDate));
      if (tripType === "round" && returnDate) queryParams.append("returnDate", formatApiDate(returnDate));
    }

    router.push(`/flights?${queryParams.toString()}`);
    setIsSearching(false);
  };

  const getTotalPassengers = () => passengerState.adults + passengerState.children + passengerState.infants;

  return (
    <div className="w-full relative z-20" ref={widgetRef}>
      
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 text-sm font-medium text-white gap-3 px-2">
        
        {/* Modern Pill Selection Bar */}
        <div className="flex bg-black/30 p-1 rounded-xl border border-white/10 backdrop-blur-md w-full sm:w-fit shadow-sm">
          {(["round", "oneway", "multi"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTripTypeChange(type)}
              className={`flex-1 sm:flex-none px-4 md:px-5 py-2 text-[11px] md:text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${
                tripType === type 
                  ? "bg-[#ff6b00] text-white shadow-md" 
                  : "text-gray-300 hover:text-white bg-transparent"
              }`}
            >
              {type === "round" ? "Round Trip" : type === "oneway" ? "One Way" : "Multi City"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-sm">
          <div className="relative flex-1 sm:flex-none">
            <button className="w-full flex items-center justify-center space-x-1 hover:text-gray-200 transition bg-black/30 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md" onClick={() => setActivePopup(activePopup === "class" ? null : "class")}>
              <span className="text-xs font-bold truncate">{passengerState.travelClass}</span>
              <ChevronDown size={14} className="shrink-0" />
            </button>
            {activePopup === "class" && (
              <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 bg-white text-black border border-gray-200 rounded-xl shadow-2xl overflow-hidden w-48 z-50">
                 {["Economy/Premium Economy", "Premium Economy", "Business", "First Class"].map(cls => (
                   <div key={cls} onClick={() => { setPassengerState({...passengerState, travelClass: cls}); setActivePopup(null); }} className="px-4 py-3 hover:bg-orange-50 hover:text-[#ff6b00] cursor-pointer text-xs font-bold border-b border-gray-100 last:border-0 transition">
                     {cls}
                   </div>
                 ))}
              </div>
            )}
          </div>
          <label className="flex flex-1 sm:flex-none items-center justify-center space-x-2 cursor-pointer bg-black/30 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
            <input type="checkbox" className="w-3.5 h-3.5 text-[#ff6b00] rounded focus:ring-[#ff6b00]" />
            <span className="text-xs font-bold">Direct flights</span>
          </label>
        </div>
      </div>

      {/* Main White Wrapper Block Base */}
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col p-4 md:p-6 pb-10 border border-gray-100 relative">
        
        {/* Title Tag */}
        <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
          <div className="bg-orange-50 p-1.5 rounded text-[#ff6b00]">
            <Plane size={16} />
          </div>
          <span className="text-base md:text-lg">Book Flights</span>
        </div>

        {/* Unified Input Grid */}
        {tripType !== "multi" ? (
          <div className="border border-gray-200 rounded-xl flex flex-col lg:flex-row shadow-sm bg-white overflow-visible">
            
            {/* FROM / TO Grid */}
            <div className="grid grid-cols-2 lg:flex lg:flex-[2] relative border-b lg:border-b-0 lg:border-r border-gray-200">
              
              {/* FROM */}
              <div 
                className="flex-1 p-3 md:p-4 flex flex-col relative cursor-pointer hover:bg-gray-50/50 transition min-w-0 border-r border-gray-200 rounded-tl-xl lg:rounded-l-xl lg:rounded-tr-none"
                onClick={() => setActivePopup("from-main")}
              >
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Leaving from</span>
                <span className="font-black text-gray-900 text-2xl md:text-3xl tracking-tight truncate w-full leading-none">
                  {getAirportCode(fromValue)}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate w-full mt-1">
                  {getCityName(fromValue)}
                </span>
                
                {activePopup === "from-main" && <DestinationPopup onSelect={(val) => { setFromValue(val); setActivePopup(null); }} />}
              </div>

              {/* Absolute Center Swap Button */}
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 z-30 hover:scale-110 active:scale-95 shadow-md cursor-pointer transition"
                onClick={(e) => { e.stopPropagation(); const temp = fromValue; setFromValue(toValue); setToValue(temp); }}
              >
                <ArrowLeftRight size={13} className="text-[#ff6b00]" />
              </div>

              {/* TO */}
              <div 
                className="flex-1 p-3 md:p-4 flex flex-col relative cursor-pointer hover:bg-gray-50/50 transition min-w-0 rounded-tr-xl lg:rounded-none"
                onClick={() => setActivePopup("to-main")}
              >
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1 pl-1">Going to</span>
                <span className="font-black text-gray-900 text-2xl md:text-3xl tracking-tight truncate w-full leading-none pl-1">
                  {getAirportCode(toValue)}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate w-full mt-1 pl-1">
                  {getCityName(toValue)}
                </span>
                {activePopup === "to-main" && <DestinationPopup onSelect={(val) => { setToValue(val); setActivePopup(null); }} />}
              </div>
            </div>

            {/* DATES Grid */}
            <div className="grid grid-cols-2 lg:flex lg:flex-[2] border-b lg:border-b-0 lg:border-r border-gray-200">
              
              {/* DEPART */}
              <div 
                className="flex-1 p-3 md:p-4 flex flex-col relative cursor-pointer hover:bg-gray-50/50 transition min-w-0 border-r border-gray-200"
                onClick={() => setActivePopup("depart")}
              >
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Depart</span>
                <span className="font-extrabold text-gray-900 text-base md:text-xl truncate w-full leading-tight mt-0.5">
                  {formatShortDate(departDate) || "Select"}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate w-full mt-1">{formatDayName(departDate)}</span>
                {activePopup === "depart" && (
                  <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
                )}
              </div>

              {/* RETURN */}
              <div 
                className="flex-1 p-3 md:p-4 flex flex-col relative cursor-pointer hover:bg-gray-50/50 transition min-w-0"
                onClick={() => { if(tripType !== 'oneway') setActivePopup("return"); }}
              >
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Return</span>
                <span className={`font-extrabold text-base md:text-xl truncate w-full leading-tight mt-0.5 ${window.innerWidth < 640 && tripType === 'oneway' ? 'text-gray-300' : !returnDate ? 'text-gray-400' : 'text-gray-900'}`}>
                  {tripType === "oneway" ? "Oneway" : formatShortDate(returnDate) || "Select"}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate w-full mt-1">{tripType === "oneway" ? "" : formatDayName(returnDate)}</span>
                {activePopup === "return" && (
                  <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
                )}
              </div>
            </div>

            {/* PASSENGERS */}
            <div 
              className="flex-1 lg:flex-[1.5] p-3 md:p-4 flex flex-col relative cursor-pointer hover:bg-gray-50/50 transition min-w-0 rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none"
              onClick={() => setActivePopup("passengers")}
            >
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Travelers</span>
              <span className="font-extrabold text-gray-900 text-base md:text-xl truncate w-full leading-tight mt-0.5">
                {getTotalPassengers()} Guest{getTotalPassengers() > 1 ? 's' : ''}
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate w-full mt-1">{passengerState.travelClass}</span>
              {activePopup === "passengers" && (
                <PassengerPopup passengerState={passengerState} setPassengerState={setPassengerState} onClose={() => setActivePopup(null)} />
              )}
            </div>
          </div>
        ) : (
          // --- MULTI-CITY VIEW ---
          <div className="space-y-4">
             {multiFlights.map((flight, idx) => (
               <div key={flight.id} className="border border-gray-200 rounded-xl flex flex-col lg:flex-row shadow-sm bg-white">
                  
                  {/* FROM / TO Grid */}
                  <div className="grid grid-cols-2 lg:flex lg:flex-[2.5] border-b lg:border-b-0 lg:border-r border-gray-200">
                    <div className="flex-1 p-3 flex flex-col relative cursor-pointer min-w-0 border-r border-gray-200" onClick={() => setActivePopup(`from-multi-${flight.id}`)}>
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">From</span>
                      <span className="font-black text-gray-900 text-xl md:text-2xl tracking-tight truncate w-full leading-none">{getAirportCode(flight.from)}</span>
                      <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate mt-1 w-full">{getCityName(flight.from)}</span>
                      {activePopup === `from-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'from', val)} />}
                    </div>
                    <div className="flex-1 p-3 flex flex-col relative cursor-pointer min-w-0" onClick={() => setActivePopup(`to-multi-${flight.id}`)}>
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">To</span>
                      <span className="font-black text-gray-900 text-xl md:text-2xl tracking-tight truncate w-full leading-none">{getAirportCode(flight.to)}</span>
                      <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate mt-1 w-full">{getCityName(flight.to)}</span>
                      {activePopup === `to-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'to', val)} />}
                    </div>
                  </div>

                  {/* DEPART DATE & ACTIONS */}
                  <div className="flex lg:flex-[1.5]">
                    <div className="flex-1 p-3 flex flex-col relative cursor-pointer min-w-0" onClick={() => setActivePopup(`date-multi-${flight.id}`)}>
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Depart</span>
                      <span className="font-extrabold text-gray-900 text-base md:text-lg truncate mt-0.5">{formatShortDate(flight.date) || "Select"}</span>
                      <span className="text-[10px] md:text-xs text-gray-500 font-medium truncate mt-1">{formatDayName(flight.date)}</span>
                      {activePopup === `date-multi-${flight.id}` && <CalendarPopup activePopup={activePopup} departDate={null} returnDate={null} tripType="multi" multiFlights={multiFlights} onSelect={handleCalendarSelect} /> }
                    </div>
                    {multiFlights.length > 2 && (
                      <button onClick={() => removeMultiFlight(flight.id)} className="bg-red-50/50 hover:bg-red-100 text-red-600 px-4 flex items-center justify-center transition shrink-0 border-l border-gray-200 rounded-r-xl">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
               </div>
             ))}

             {/* Multi-City Controls Footer */}
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="flex-1 sm:flex-none border border-gray-200 rounded-xl p-3 flex flex-col relative cursor-pointer min-w-[200px] bg-white" onClick={() => setActivePopup("passengers")}>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Travelers & Class</span>
                    <span className="font-extrabold text-gray-900 text-sm truncate">{getTotalPassengers()} Pax • {passengerState.travelClass}</span>
                    {activePopup === "passengers" && <PassengerPopup passengerState={passengerState} setPassengerState={setPassengerState} onClose={() => setActivePopup(null)} />}
                 </div>
                 {multiFlights.length < 5 && (
                    <button onClick={addMultiFlight} className="flex-1 sm:flex-none bg-orange-50 hover:bg-orange-100 text-[#ff6b00] font-extrabold px-4 py-4 rounded-xl flex justify-center items-center transition shadow-sm border border-orange-200 text-sm">
                      <Plus size={16} className="mr-1 shrink-0"/> Add flight
                    </button>
                 )}
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Floating Centered Orange Search Button */}
      <div className="flex justify-center -mt-6 relative z-30">
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white font-extrabold px-10 py-3.5 rounded-full text-base md:text-lg shadow-xl shadow-[#ff6b00]/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 tracking-wide"
        >
          <Search size={18} className={isSearching ? "animate-spin" : ""} />
          <span>{isSearching ? "Searching..." : "SEARCH FLIGHTS"}</span>
        </button>
      </div>

    </div>
  );
}