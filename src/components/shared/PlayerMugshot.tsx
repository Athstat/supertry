import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { CardTier } from "../../types/cardTiers";
import { User } from "lucide-react";

type Props = {
  url?: string,
  className?: string,
  alt?: string,
  showPrBackground?: boolean,
  playerPr?: number
}

export default function PlayerMugshot({ url, className, alt, showPrBackground, playerPr }: Props) {

  const imageUrl = url;
  const [error, setError] = useState(false);

  if (error || !url) {
    return (
      <div className={twMerge(
        "w-14 h-14 bg-slate-300 dark:text-slate-400 flex items-center justify-center dark:bg-slate-800 rounded-full",
        className
      )}>
        <User />
      </div>
    )
  }

  const pr = playerPr ?? 0;
  const cardTier: CardTier =
    pr <= 69 ? "bronze"
      : pr > 70 && pr < 80 ? "silver"
        : pr >= 90 ? "blue" : "gold";

  return (
    <div className={twMerge(
      "w-14 h-14 overflow-clip border border-slate-400 dark:border-slate-800 rounded-full",
      cardTier === "gold" && showPrBackground &&
      "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 ",
      cardTier === "silver" && showPrBackground &&
      "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600",
      cardTier === "bronze" && showPrBackground &&
      "bg-gradient-to-br from-amber-600 via-amber-800 to-amber-900 text-white",
      cardTier === "blue" && showPrBackground &&
      "bg-gradient-to-br from-purple-600 via-blue-800 to-purple-900 text-white",
      className
    )} >
      <img
        src={imageUrl}
        alt={alt ?? "team_logo"}
        onError={() => setError(true)}
        className='w-full h-full object-contain'
      />
    </div>
  )
}
