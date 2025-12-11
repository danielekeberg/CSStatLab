import React from "react";

type PremierTier =
  | "GRAY"
  | "CYAN"
  | "BLUE"
  | "PURPLE"
  | "PINK"
  | "RED"
  | "GOLD";

interface PremierRankBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

function getPremierTier(rating: number): PremierTier {
  if (rating >= 30000) return "GOLD";
  if (rating >= 25000) return "RED";
  if (rating >= 20000) return "PINK";
  if (rating >= 15000) return "PURPLE";
  if (rating >= 10000) return "BLUE";
  if (rating >= 5000) return "CYAN";
  return "GRAY";
}

function getTierColors(tier: PremierTier) {
  switch (tier) {
    case "PURPLE":
      return {
        bg: "bg-[#2b1743]",
        innerBg: "bg-[#4f2c7d]",
        accent1: "bg-[#c77dff]",
        accent2: "bg-[#9b5cff]",
        text: "text-[#f5e9ff]",
      };
    case "GRAY":
      return {
        bg: "bg-[#20232b]",
        innerBg: "bg-[#343844]",
        accent1: "bg-[#a5acba]",
        accent2: "bg-[#8f96a5]",
        text: "text-[#f3f4f6]",
      };
    case "CYAN":
      return {
        bg: "bg-[#041923]",
        innerBg: "bg-[#093044]",
        accent1: "bg-[#5be5ff]",
        accent2: "bg-[#2dccff]",
        text: "text-[#e6faff]",
      };
    case "BLUE":
      return {
        bg: "bg-[#050f23]",
        innerBg: "bg-[#152b55]",
        accent1: "bg-[#6ca5ff]",
        accent2: "bg-[#3b82f6]",
        text: "text-[#e5edff]",
      };
    case "PINK":
      return {
        bg: "bg-[#240418]",
        innerBg: "bg-[#4e1033]",
        accent1: "bg-[#ff8ad4]",
        accent2: "bg-[#ff4fbf]",
        text: "text-[#ffe9f6]",
      };
    case "RED":
      return {
        bg: "bg-[#240607]",
        innerBg: "bg-[#4b1417]",
        accent1: "bg-[#ff8a8a]",
        accent2: "bg-[#ff4b4b]",
        text: "text-[#ffecec]",
      };
    case "GOLD":
      return {
        bg: "bg-[#251a05]",
        innerBg: "bg-[#5a4310]",
        accent1: "bg-[#ffe88a]",
        accent2: "bg-[#ffd84a]",
        text: "text-[#fff9e6]",
      };
    default:
      return {
        bg: "bg-[#20232b]",
        innerBg: "bg-[#343844]",
        accent1: "bg-[#a5acba]",
        accent2: "bg-[#8f96a5]",
        text: "text-[#f3f4f6]",
      };
  }
}

export const PremierRankBadge: React.FC<PremierRankBadgeProps> = ({
  rating,
  size = "xs",
}) => {
  const tier = getPremierTier(rating);
  const { bg, innerBg, accent1, accent2, text } = getTierColors(tier);

  const padding =
    size === "sm" ? "px-3 py-0.5" : size === "lg" ? "px-5 py-1.5" : "px-2 py-0";
  const fontSize =
    size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-md";

  return (
    <div className={`inline-flex ${bg} rounded-[3px] skew-x-[-15deg] shadow-md`}>
      <div
        className={`relative flex items-center ${padding} skew-x-[15deg] ${innerBg}`}
      >
        <div className="flex flex-col justify-between mr-2">
          <span className={`w-[3px] h-4 rounded-full ${accent1}`} />
          <span className={`w-[3px] h-4 rounded-full ${accent2}`} />
        </div>

        <span
          className={`font-extrabold tracking-wide ${fontSize} ${text}`}
          style={{ fontFamily: `"Inter", system-ui, sans-serif` }}
        >
          {rating.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
};
