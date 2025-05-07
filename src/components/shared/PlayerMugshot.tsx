import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  url?: string,
  className?: string,
  alt?: string
}

export default function PlayerMugshot({ url, className, alt }: Props) {
  
  const imageUrl = url;
  const [error, setError] = useState(false);

  if (error || !url) {
    return (
      <div className={twMerge(
        "w-14 h-14 bg-slate-300 dark:bg-slate-800 rounded-full",
        className
      )}></div>
    )
  }

  return (
    <div className={twMerge("w-14 h-14 overflow-clip border border-slate-400 dark:border-slate-800 rounded-full", className)} >
      <img
        src={imageUrl}
        alt={alt ?? "team_logo"}
        onError={() => setError(true)}
        className='w-full h-full object-contain'
      />
    </div>
  )
}
