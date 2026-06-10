"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plane, 
  ArrowLeftRight, 
  Calendar as CalendarIcon, 
  Plus,
  Trash2,
  Users
} from "lucide-react";
import DestinationPopup from "./DestinationPopup";
import CalendarPopup from "./CalendarPopup";
import PassengerPopup from "./PassengerPopup";

// --- Helpers ---
const formatDisplayDate = (date: Date | null) => {
  if (!date) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
};

const formatApiDate = (dateStr: any) => {
  if (!dateStr) return "";
  if (dateStr instanceof Date) {
    const yyyy = dateStr.getFullYear();
    const mm = String(dateStr.getMonth() + 1).padStart(2, '0');
    const dd = String(dateStr.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  const parts = typeof dateStr === 'string' ? dateStr.split(" ") : [];
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const monthMap: Record<string, string> = {
      "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
      "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    };
    const month = monthMap[parts[1]] || "01";
    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    return `${year}-${month}-${day}`;
  }
  return "";
};

export interface FlightSearchProps {
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

export default function FlightSearchWidget(props: FlightSearchProps) {
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
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

  const handleSearch = () => {
    setIsSearching(true);
    const extractIata = (str: string) => {
      const match = str.match(/\(([A-Z]{3})\)/);
      return match ? match[1] : str;
    };

    const queryParams = new URLSearchParams({
      tripType,
      adults: passengerState.adults.toString(),
      children: passengerState.children.toString(),
      infants: passengerState.infants.toString(),
      travelClass: passengerState.travelClass,
    });

    if (tripType === "multi") {
      const slices = multiFlights.map(f => ({
        origin: extractIata(f.from),
        destination: extractIata(f.to),
        date: formatApiDate(f.date)
      }));
      queryParams.append("slices", JSON.stringify(slices));
    } else {
      queryParams.append("origin", extractIata(fromValue));
      queryParams.append("destination", extractIata(toValue));
      queryParams.append("departDate", formatApiDate(departDate));
      if (tripType === "round" && returnDate) {
        queryParams.append("returnDate", formatApiDate(returnDate));
      }
    }

    router.push(`/flights?${queryParams.toString()}`);
  };

  const getTotalPassengers = () => passengerState.adults + passengerState.children + passengerState.infants;
  const getTravelClassText = () => passengerState.travelClass === "Economy/Premium Economy" ? "Economy" : passengerState.travelClass;
  const getDetailedPassengerText = () => {
    const parts = [];
    if (passengerState.adults > 0) parts.push(`${passengerState.adults} Ad`);
    if (passengerState.children > 0) parts.push(`${passengerState.children} Ch`);
    if (passengerState.infants > 0) parts.push(`${passengerState.infants} Inf`);
    return parts.join(', ');
  };

  return (
    <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300" ref={widgetRef}>
      
      {/* Modern Styled Selector Tabs */}
      <div className="flex bg-[#1e293b] p-1 rounded-lg border border-gray-700 mb-5 w-full">
        {(["round", "oneway", "multi"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTripTypeChange(type)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${
              tripType === type 
                ? "bg-[#ff6b00] text-white shadow-md" 
                : "text-gray-400 hover:text-white bg-transparent"
            }`}
          >
            {type === "round" ? "Round Trip" : type === "oneway" ? "One Way" : "Multi City"}
          </button>
        ))}
      </div>

      {tripType === "multi" ? (
        <div className="space-y-3 mb-5">
          {multiFlights.map((flight) => (
            <div key={flight.id} className="space-y-2 border border-gray-800 p-2.5 rounded-lg bg-black/20">
              {/* Forced 2-column grid for mobile */}
              <div className="grid grid-cols-2 gap-2 relative">
                <div 
                  className={`bg-[#1e293b] p-2 rounded border transition relative cursor-pointer ${activePopup === `from-multi-${flight.id}` ? 'border-[#ff6b00]' : 'border-gray-700'}`}
                  onClick={() => setActivePopup(`from-multi-${flight.id}`)}
                >
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">From</p>
                  <input type="text" value={flight.from} readOnly className="w-full bg-transparent text-white font-bold text-xs outline-none mt-0.5 cursor-pointer pointer-events-none truncate" />
                  {activePopup === `from-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'from', val)} />}
                </div>

                <div 
                  className={`bg-[#1e293b] p-2 rounded border transition relative cursor-pointer ${activePopup === `to-multi-${flight.id}` ? 'border-[#ff6b00]' : 'border-gray-700'}`}
                  onClick={() => setActivePopup(`to-multi-${flight.id}`)}
                >
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">To</p>
                  <input type="text" value={flight.to} readOnly className="w-full bg-transparent text-white font-bold text-xs outline-none mt-0.5 cursor-pointer pointer-events-none truncate" />
                  {activePopup === `to-multi-${flight.id}` && <DestinationPopup onSelect={(val) => updateMultiFlight(flight.id, 'to', val)} />}
                </div>
              </div>

              <div className="flex gap-2">
                <div 
                  className={`flex-1 bg-[#1e293b] p-2 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === `date-multi-${flight.id}` ? 'border-[#ff6b00]' : 'border-gray-700'}`}
                  onClick={() => setActivePopup(`date-multi-${flight.id}`)}
                >
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Depart</p>
                    <input type="text" value={formatDisplayDate(flight.date) || "Select Date"} readOnly className="w-full bg-transparent text-white font-bold text-xs outline-none mt-0.5 cursor-pointer pointer-events-none" />
                  </div>
                  <CalendarIcon size={14} className="text-gray-400 ml-1 shrink-0"/>
                  {activePopup === `date-multi-${flight.id}` && (
                    <CalendarPopup activePopup={activePopup} departDate={null} returnDate={null} tripType="multi" multiFlights={multiFlights} onSelect={handleCalendarSelect} />
                  )}
                </div>

                {multiFlights.length > 2 && (
                  <button onClick={() => removeMultiFlight(flight.id)} className="px-3 bg-red-500/10 text-red-500 rounded border border-red-500/20 hover:bg-red-500/20 transition flex items-center justify-center shrink-0">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {multiFlights.length < 5 && (
            <button onClick={addMultiFlight} className="text-[#ff6b00] font-bold text-xs flex items-center space-x-1 hover:underline mt-1">
              <Plus size={14} /> <span>Add another flight</span>
            </button>
          )}
        </div>
      ) : (
        /* Dynamic Horizontal Grid for Mobile compatibility */
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-2 relative items-center">
            <div 
              className={`bg-[#1e293b] p-2.5 rounded border transition relative cursor-pointer ${activePopup === 'from-main' ? 'border-[#ff6b00]' : 'border-gray-700'}`}
              onClick={() => setActivePopup("from-main")}
            >
              <p className="text-[10px] text-gray-400 uppercase font-semibold">From</p>
              <input type="text" value={fromValue} readOnly className="w-full bg-transparent text-white font-bold text-xs outline-none mt-0.5 cursor-pointer pointer-events-none truncate" />
              {activePopup === "from-main" && <DestinationPopup onSelect={(val) => { setFromValue(val); setActivePopup(null); }} />}
            </div>
            
            {/* Embedded modern layout switch icon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ff6b00] rounded-full p-1.5 z-30 text-white cursor-pointer hover:scale-105 active:scale-95 transition shadow-md shadow-black/50"
                 onClick={(e) => { e.stopPropagation(); const temp = fromValue; setFromValue(toValue); setToValue(temp); }}>
              <ArrowLeftRight size={12} className="transform rotate-0" />
            </div>

            <div 
              className={`bg-[#1e293b] p-2.5 rounded border transition relative cursor-pointer ${activePopup === 'to-main' ? 'border-[#ff6b00]' : 'border-gray-700'}`}
              onClick={() => setActivePopup("to-main")}
            >
              <p className="text-[10px] text-gray-400 uppercase font-semibold pl-2">To</p>
              <input type="text" value={toValue} readOnly className="w-full bg-transparent text-white font-bold text-xs outline-none mt-0.5 cursor-pointer pointer-events-none truncate pl-2" />
              {activePopup === "to-main" && <DestinationPopup onSelect={(val) => { setToValue(val); setActivePopup(null); }} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div 
              className={`bg-[#1e293b] p-2.5 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === 'depart' ? 'border-[#ff6b00]' : 'border-gray-700'}`}
              onClick={() => setActivePopup("depart")}
            >
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Depart</p>
                <input type="text" value={formatDisplayDate(departDate) || "Select"} readOnly className="w-full bg-transparent text-white font-bold text-xs outline-none mt-0.5 cursor-pointer pointer-events-none" />
              </div>
              <CalendarIcon size={14} className="text-gray-400 ml-1 shrink-0"/>
              {activePopup === "depart" && (
                <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
              )}
            </div>

            <div 
              className={`bg-[#1e293b] p-2.5 rounded border flex justify-between items-center transition relative cursor-pointer ${activePopup === 'return' ? 'border-[#ff6b00]' : 'border-gray-700'}`}
              onClick={() => { if(tripType !== 'oneway') setActivePopup("return"); }}
            >
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Return</p>
                <input 
                  type="text" 
                  value={formatDisplayDate(returnDate)} 
                  placeholder={tripType === 'oneway' ? "Oneway" : "Select"} 
                  readOnly 
                  className={`w-full bg-transparent font-bold text-xs outline-none mt-0.5 pointer-events-none ${!returnDate ? 'text-gray-500' : 'text-white'}`} 
                />
              </div>
              <CalendarIcon size={14} className="text-gray-400 ml-1 shrink-0"/>
              {activePopup === "return" && (
                <CalendarPopup activePopup={activePopup} departDate={departDate} returnDate={returnDate} tripType={tripType} multiFlights={multiFlights} onSelect={handleCalendarSelect} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Passenger & Class Input */}
      <div className="mb-5 relative">
        <div 
          className={`bg-[#1e293b] p-2.5 rounded border flex justify-between items-center transition cursor-pointer ${activePopup === 'passengers' ? 'border-[#ff6b00]' : 'border-gray-700'}`}
          onClick={() => setActivePopup(activePopup === "passengers" ? null : "passengers")}
        >
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Travellers & Class</p>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-white font-bold text-sm">{getTotalPassengers()} Pax</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-[#ff6b00] text-xs font-bold truncate max-w-[140px]">
                {getDetailedPassengerText()} ({getTravelClassText()})
              </span>
            </div>
          </div>
          <Users size={16} className="text-gray-400 shrink-0 ml-2"/>
        </div>
        
        {activePopup === "passengers" && (
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
            <PassengerPopup 
              passengerState={passengerState} 
              setPassengerState={setPassengerState}
              onClose={() => setActivePopup(null)}
            />
          </div>
        )}
      </div>

      <button 
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center space-x-2 transition mt-auto shadow-lg shadow-[#ff6b00]/20 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
      >
        <Plane size={18} className={isSearching ? "animate-pulse" : ""} /> 
        <span>{isSearching ? "SEARCHING..." : "SEARCH FLIGHTS"}</span>
      </button>
    </div>
  );
}