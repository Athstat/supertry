import { useMemo } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  className?: string,
  showUntil?: Date
}

/** Renders a new tag used to signify that a game is new */
export default function NewTag({ className, showUntil }: Props) {

  const shouldShow = useMemo(() => {
    if (showUntil) {
      const now = new Date()
      const lastDate = new Date(showUntil);

      if (now.valueOf() > lastDate.valueOf()) {
        return false;
      }
    }

    return true;
  }, [showUntil]);

  if (!shouldShow) {
    return false;
  }

  return (
    <div className={twMerge(
      "bg-green-500 border-green-500 cursor-pointer dark:bg-green-600 border dark:border-green-600 px-2 text-xs text-white dark:text-white py-0.5 rounded-full",
      className
    )} >
      <p>New</p>
    </div>
  )
}
