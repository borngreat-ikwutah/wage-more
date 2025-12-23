import React from "react";
import { Image } from "@unpic/react";
import { MessageSquare, Star, Gift, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";

// --- Types ---
export type MarketType = "binary" | "multiple";

interface Outcome {
  label: string;
  value: number;
  change?: number;
}

interface MultiOutcome {
  label: string;
  yes: number;
  no: number;
}

interface MarketCardProps {
  title: string;
  imageSrc: string;
  type: MarketType;
  volume: string;
  comments: number;
  isNew?: boolean;
  binaryData?: {
    yes: Outcome;
    no: Outcome;
  };
  multiData?: MultiOutcome[];
}

// --- Sub-Component: Gauge (Binary View - Preserved) ---
const Gauge = ({ value, type }: { value: number; type: "yes" | "no" }) => {
  const color = type === "yes" ? "#10b981" : "#ef4444";
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * (circumference / 2);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-10 overflow-hidden flex justify-center">
        <svg
          className="w-20 h-20 transform rotate-[180deg]"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            className="stroke-secondary/50"
            strokeWidth="4"
            strokeDasharray={`${circumference / 2} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${circumference / 2} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute top-5 text-center">
          <span className="text-lg font-bold text-foreground">{value}%</span>
        </div>
      </div>
      <span
        className={cn(
          "font-bold text-sm uppercase",
          type === "yes" ? "text-emerald-500" : "text-destructive",
        )}
      >
        {type}
      </span>
    </div>
  );
};

// --- Sub-Component: Vote Button (New "SpaceX" Style) ---
const VoteButton = ({ type, value }: { type: "yes" | "no"; value: number }) => {
  return (
    <div className="bg-secondary/40 hover:bg-secondary/60 transition-colors rounded-md px-3 py-1.5 flex items-center justify-center gap-1.5 cursor-pointer min-w-[75px]">
      {/* "Yes/No" Text is Colored */}
      <span
        className={cn(
          "text-[11px] font-bold uppercase",
          type === "yes" ? "text-emerald-500" : "text-destructive",
        )}
      >
        {type}
      </span>
      {/* Percentage is White (Foreground) */}
      <span className="text-foreground text-xs font-bold">{value}%</span>
    </div>
  );
};

// --- Main Component ---
export const MarketCard: React.FC<MarketCardProps> = ({
  title,
  imageSrc,
  type,
  volume,
  comments,
  isNew,
  binaryData,
  multiData,
}) => {
  return (
    <div className="group relative bg-card text-card-foreground border border-border hover:border-primary/50 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between h-full shadow-sm hover:shadow-md">
      {/* Header */}
      <div className="flex gap-3 mb-4">
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary">
            <Image
              src={imageSrc}
              layout="constrained"
              width={40}
              height={40}
              alt={title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-card-foreground font-medium text-[15px] leading-snug line-clamp-2 font-sans">
            {title}
          </h3>
        </div>
      </div>

      {/* --- Dynamic Content Area --- */}
      <div className="flex-1 mb-4 flex flex-col justify-end">
        {type === "binary" && binaryData ? (
          <div className="flex justify-around items-end pt-1 bg-secondary/20 rounded-lg py-3 mx-1">
            <div className="flex flex-col items-center">
              <Gauge value={binaryData.yes.value} type="yes" />
              {binaryData.yes.change && (
                <span className="text-[10px] text-emerald-500/80 font-mono mt-1">
                  +{binaryData.yes.change}%
                </span>
              )}
            </div>
            <div className="flex flex-col items-center">
              <Gauge value={binaryData.no.value} type="no" />
              {binaryData.no.change && (
                <span className="text-[10px] text-emerald-500/80 font-mono mt-1">
                  +{binaryData.no.change}%
                </span>
              )}
            </div>
          </div>
        ) : type === "multiple" && multiData ? (
          // --- List View for "Multiple" ---
          <div className="flex flex-col gap-2.5">
            {multiData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                {/* Question Text */}
                <span className="text-muted-foreground font-medium truncate max-w-[45%] text-[13px]">
                  {item.label}
                </span>

                {/* Vote Buttons Group */}
                <div className="flex gap-2">
                  <VoteButton type="yes" value={item.yes} />
                  <VoteButton type="no" value={item.no} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* --- Footer --- */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-3">
          {isNew && (
            <span className="bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <Star size={8} fill="currentColor" strokeWidth={3} /> NEW
            </span>
          )}
          <div className="flex items-center text-muted-foreground text-xs gap-1 font-medium">
            <TrendingUp size={13} />
            <span>{volume}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1 text-xs hover:text-foreground transition-colors cursor-pointer">
            <MessageSquare size={13} />
            <span>{comments}</span>
          </div>
          <Gift
            size={13}
            className="hover:text-primary transition-colors cursor-pointer"
          />
          <Star
            size={13}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 pointer-events-none transition-colors" />
    </div>
  );
};
