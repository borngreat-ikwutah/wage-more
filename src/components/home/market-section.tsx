import { LayoutGrid, ListFilter, Star } from "lucide-react";
import { useState } from "react";
import { MarketCard, type MarketType } from "~/components/shared/market-card"; // Import from the file above

// --- Mock Data Matching Your Image ---
const MOCK_MARKETS = [
  {
    id: 1,
    title: "Yoon arrested by January 31?",
    imageSrc:
      "https://images.unsplash.com/photo-1558980394-a3099ed53abb?auto=format&fit=crop&w=100&q=80",
    type: "binary" as MarketType,
    volume: "2M",
    comments: 501,
    binaryData: {
      yes: { label: "Yes", value: 60, change: 66.66 },
      no: { label: "No", value: 40, change: 144 },
    },
  },
  {
    id: 2,
    title: "SpaceX Starship Flight Test 7",
    imageSrc:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=100&q=80",
    type: "multiple" as MarketType,
    isNew: true,
    volume: "344K",
    comments: 21,
    multiData: [
      { label: "Launch by Jan 10?", yes: 76, no: 24 },
      { label: "Launch before February?", yes: 98, no: 2 },
      { label: "Reaches Space?", yes: 95, no: 5 },
    ],
  },
  {
    id: 3,
    title: "TikTok banned in the US before May 2025?",
    imageSrc:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=100&q=80",
    type: "binary" as MarketType,
    volume: "2M",
    comments: 501,
    binaryData: {
      yes: { label: "Yes", value: 59, change: 66.66 },
      no: { label: "No", value: 41, change: 144 },
    },
  },
  {
    id: 4,
    title: "Elon musk number of tweets January 3-10?",
    imageSrc:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
    type: "multiple" as MarketType, // Treated as multi in UI for list view style
    volume: "$400k",
    comments: 120,
    multiData: [
      { label: "575-599", yes: 1, no: 99 },
      { label: "600-624", yes: 45, no: 55 },
    ],
  },
  {
    id: 5,
    title: "Israel x Hamas cease-fire by January 31?",
    imageSrc:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=100&q=80",
    type: "binary" as MarketType,
    volume: "$1.2M",
    comments: 89,
    binaryData: {
      yes: { label: "Yes", value: 12, change: 5 },
      no: { label: "No", value: 88, change: 2 },
    },
  },
  {
    id: 6,
    title: "What price will bitcoin in January?",
    imageSrc:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=100&q=80",
    type: "multiple" as MarketType,
    volume: "$200,000",
    comments: 204,
    multiData: [{ label: "$90k - $100k", yes: 76, no: 24 }],
  },
];

// --- Filter Tags ---
const FILTERS = [
  "All",
  "Wildfire",
  "Breaking News",
  "Canada",
  "Trump Inauguration",
  "Mentions",
  "Creators",
];

export const MarketsSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* --- Filter Bar --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Left: Animation Toggle & Tags */}
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar">
          <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-700 whitespace-nowrap dark:bg-background dark:text-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Animations
            <div className="w-8 h-4 bg-blue-500 rounded-full ml-2 relative">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow" />
            </div>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-2" />

          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-white text-black"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sort & Layout */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm border border-slate-700 hover:bg-slate-700">
            <Star className="w-4 h-4 fill-white" />
            Newest
          </button>
          <div className="flex bg-slate-800 rounded-lg border border-slate-700 p-0.5">
            <button className="p-1.5 rounded bg-slate-700 text-white">
              <LayoutGrid size={16} />
            </button>
            <button className="p-1.5 rounded text-slate-400 hover:text-white">
              <ListFilter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- The Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_MARKETS.map((market) => (
          <MarketCard
            key={market.id}
            title={market.title}
            imageSrc={market.imageSrc}
            type={market.type}
            volume={market.volume}
            comments={market.comments}
            isNew={market.isNew}
            binaryData={market.binaryData}
            multiData={market.multiData}
          />
        ))}
      </div>
    </div>
  );
};
