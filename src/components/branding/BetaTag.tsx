import { twMerge } from "tailwind-merge"

type Props = {
    className?: string
}

/** Render a beta tag */
export default function BetaTag({ className } : Props) {
  return (
    <div className={twMerge(
      "rounded-xl px-2 font-medium py-0.5 text-xs border border-green-500 text-green-600 bg-green-500/30",
      className
    )} >
      beta
    </div>
  )
}
