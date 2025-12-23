import React from "react";
import { ChevronRight } from "lucide-react";
import { Image } from "@unpic/react";
import { Button } from "../ui/button";

// --- Types ---
interface CardProps {
  title: string;
  subtitle: string;
  ctaText: string;
  imageSrc: string;
  gradient: string;
  onClick?: () => void;
  imageType?: "hero-icon" | "thumbnail";
}

// --- Component 1: Hero Card (Large, Left Side) ---
const HeroCard: React.FC<CardProps> = ({
  title,
  subtitle,
  ctaText,
  imageSrc,
  gradient,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      // Changed h-[340px] to h-full so it adapts to the parent grid
      className={`lg:col-span-2 relative overflow-hidden rounded-2xl ${gradient} p-8 flex items-center justify-between transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer h-full min-h-[300px]`}
    >
      {/* Background Radial Burst Effect */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-to),transparent_70%)] opacity-40 mix-blend-overlay pointer-events-none"></div>

      {/* Left Side: Content & Button */}
      <div className="relative z-10 flex flex-col justify-between h-full max-w-[60%]">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-blue-50 text-sm font-medium opacity-90">
            {subtitle}
          </p>
        </div>

        <button className="w-fit flex items-center gap-1 bg-slate-900/40 hover:bg-slate-900/60 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-colors text-xs font-semibold border border-white/10">
          {ctaText} <ChevronRight size={16} />
        </button>
      </div>

      {/* Right Side: Framed Icon Image */}
      <div className="relative z-10 mr-4">
        <Image
          src={imageSrc}
          layout="constrained"
          width={160}
          height={160}
          alt={title}
          className="object-contain p-2 rounded-md"
        />
      </div>
    </div>
  );
};

// --- Component 2: Side Card (Small, Right Side) ---
const SideCard: React.FC<CardProps> = ({
  title,
  subtitle,
  ctaText,
  imageSrc,
  gradient,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      // Added h-full to ensure it fills the flex container split
      className={`flex-1 relative overflow-hidden rounded-2xl ${gradient} p-6 flex items-center justify-between transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer min-h-[140px] h-full`}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none"></div>

      {/* Left Side: Text & Button */}
      <div className="relative z-10 flex flex-col justify-between h-full items-start gap-2">
        <div>
          <h2 className="text-base font-bold text-white leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-white/90 text-sm mt-1 font-medium">{subtitle}</p>
        </div>

        <Button className="w-fit flex items-center gap-1 bg-slate-900/40 hover:bg-slate-900/60 text-white px-4 py-1.5 rounded-full backdrop-blur-md transition-colors text-xs font-semibold border border-white/10 mt-auto">
          {ctaText} <ChevronRight size={14} />
        </Button>
      </div>

      {/* Right Side: Square Thumbnail */}
      <div className="relative z-10 shrink-0">
        <div className="w-20 h-20 rounded-xl border-2 border-white/30 overflow-hidden shadow-lg bg-black/10">
          <Image
            src={imageSrc}
            layout="constrained"
            width={80}
            height={80}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Banner Section ---
const BannerSection = () => {
  return (
    // Removed max-w-7xl, mx-auto, and padding so it fills the parent column
    <div className="w-full">
      {/* Increased height to 340px to give cards breathing room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-[340px]">
        {/* Left Column: Hero - Spans 2 cols */}
        <HeroCard
          title="NFL Playoffs"
          subtitle="Super Wildcard Weekend is here!"
          ctaText="Games"
          imageSrc="https://cdn.worldvectorlogo.com/logos/nfl-1.svg"
          gradient="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a]"
        />

        {/* Right Column: Stacked Side Cards - Spans 1 col */}
        <div className="flex flex-col gap-4 h-full">
          <SideCard
            title="New Year's predictions"
            subtitle="What's in store for '25?"
            ctaText="Markets"
            imageSrc="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=150&q=80"
            gradient="bg-gradient-to-r from-[#a855f7] to-[#6366f1]"
          />

          <SideCard
            title="Trump Admin"
            subtitle="Track promises & more!"
            ctaText="Dashboard"
            imageSrc="https://images.unsplash.com/photo-1580128660010-fd027e1e587a?auto=format&fit=crop&w=150&q=80"
            gradient="bg-gradient-to-r from-[#ef4444] to-[#b91c1c]"
          />
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
