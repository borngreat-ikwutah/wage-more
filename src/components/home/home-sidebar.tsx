import React from "react";
import { Star, ChevronRight, Activity, Wallet, TrendingUp } from "lucide-react";
import { Image } from "@unpic/react";
import { Button } from "../ui/button"; // Assuming you have shadcn Button
import { Link } from "@tanstack/react-router";

// --- Mock Data ---
const TRENDING_TOPICS = [
  "Wildfire",
  "Breaking News",
  "Canada",
  "Trump Inauguration",
  "Trump Presidency",
  "2025 Predictions",
  "Geopolitics",
  "NFL Draft",
  "Elon Musk",
  "Middle East",
  "Bitcoin",
  "Cyber Truck",
  "Bird Flu",
  "Weather",
  "German Election",
];

const RECENT_ACTIVITY = [
  {
    user: "fmichael",
    action: "bought",
    type: "No",
    price: "58¢",
    amount: "$30.53",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    marketImage: "https://cdn.worldvectorlogo.com/logos/nfl-1.svg",
    question: "Will the Chiefs win AFC championship?",
  },
  {
    user: "0xF1jk...",
    action: "bought",
    type: "Yes",
    price: "1¢",
    amount: "$24.43",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    marketImage: "https://cdn.worldvectorlogo.com/logos/twitter-3.svg",
    question: "Will Elon tweet 600 to 624 times Jan 3-Jan 10?",
  },
];

export const HomeSidebar = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Portfolio Card */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Activity className="w-6 h-6" />{" "}
            {/* Using generic icon, replace with custom SVG wave if needed */}
          </div>
          <div>
            <h3 className="font-bold text-card-foreground text-sm">
              Portfolio
            </h3>
            <p className="text-xs text-muted-foreground">
              Deposit some cash to start betting
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs font-bold px-3"
        >
          Deposit <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {/* 2. Watchlist Card */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-card-foreground text-sm">
              Watchlist
            </h3>
            <p className="text-xs text-muted-foreground max-w-[120px] leading-tight">
              Click the star on any market to add it
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs font-bold px-3"
        >
          Trending <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {/* 3. Trending Topics */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-card-foreground text-sm">
            Trending Topics
          </h3>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            See all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TOPICS.map((topic) => (
            <Link
              key={topic}
              to="/"
              className="bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-border"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-0 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-card-foreground text-sm">
            Recent Activity
          </h3>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            See all
          </Link>
        </div>
        <div className="flex flex-col">
          {RECENT_ACTIVITY.map((item, idx) => (
            <div
              key={idx}
              className="p-3 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors flex gap-3"
            >
              <div className="shrink-0">
                <Image
                  src={item.marketImage}
                  width={32}
                  height={32}
                  layout="constrained"
                  alt="Market"
                  className="rounded bg-secondary object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate mb-1">
                  {item.question}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Image
                    src={item.avatar}
                    width={16}
                    height={16}
                    alt="User"
                    className="rounded-full"
                  />
                  <span className="font-medium text-foreground">
                    {item.user}
                  </span>
                  <span className="text-muted-foreground">bought</span>
                  <span
                    className={
                      item.type === "Yes"
                        ? "text-emerald-500 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {item.type}
                  </span>
                  <span className="text-muted-foreground">at {item.price}</span>
                  <span className="text-muted-foreground ml-auto">
                    {item.amount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
