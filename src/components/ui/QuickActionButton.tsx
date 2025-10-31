import { ReactNode } from "react"
import RoundedCard from "../shared/RoundedCard"
import { twMerge } from "tailwind-merge"
import { ArrowUpRight } from "lucide-react"

type Props = {
  children?: ReactNode,
  className?: string,
  onClick?: () => void,
  hideArrow?: boolean
}

/** Renders quick link component */
export default function QuickActionButton({ children, className, onClick, hideArrow }: Props) {
  return (
    <RoundedCard
      className={twMerge(
        "w-fit p-1.5 text-sm px-3 border-none flex flex-row bg-slate-100 hover:dark:bg-slate-700 items-center gap-2 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div>
        {children}
      </div>
      {!hideArrow && <ArrowUpRight className=" w-3.5 h-3.5 dark:text-slate-400 text-slate-700" />}
    </RoundedCard>
  )
}
