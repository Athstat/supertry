import { CircleX } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = {
  title?: string
  message?: string,
  error?: string,
  hideIfNoMessage?: boolean,
  className?: string
}

/** Renders an error card */
export default function ErrorCard({ message, title, error, hideIfNoMessage, className }: Props) {

  if (!message && hideIfNoMessage) {
    return null;
  }

  return (
    <div className={twMerge(
      'flex flex-row mt-4 h-full border border-red-300 dark:border-red-700/30  gap-4 bg-red-200 dark:bg-red-900/20 p-2 rounded-xl items-center justify-center',
      className
    )} >
      <div className="w-[50px] flex flex-col items-center justify-center" >
        <CircleX className="text-red-500 w-8 h-8" />
      </div>

      <div className="flex flex-col" >
        {(title || error) && <p className="text-red-500 font-bold" >{title || error}</p>}
        {message && <p className="text-red-500 text-sm" >{message}</p>}
      </div>
    </div>
  )
}
