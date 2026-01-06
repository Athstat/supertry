import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  children?: ReactNode,
  className?: string,
  onClick?: () => void
}

/** Renders a pill tag component */
export default function PillTag({ children, className }: Props) {

  return (
    <div className={twMerge(
      "bg-slate-100 w-fit dark:text-slate-400 px-2 py-0.5 border dark:border-slate-700 rounded-xl dark:bg-slate-700/50",
      className
    )} >
      {children}
    </div>
  )
}


export function PillCard({ children, className, onClick }: Props) {

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div 
    onClick={handleOnClick}
    className={twMerge(
      "bg-slate-100 w-fit dark:text-slate-400 px-2 py-0.5 cursor-pointer border dark:border-slate-700 text-nowrap rounded-xl dark:bg-slate-700/50",
      className
    )} >
      {children}
    </div>
  )
}
