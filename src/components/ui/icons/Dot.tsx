import { twMerge } from "tailwind-merge"

type Props = {
    className?: string
}

/** Renders a dot component */
export default function Dot({className} : Props) {
  return (
    <div className={twMerge(
        "w-1.5 h-1.5 rounded-full bg-white dark:bg-black",
        className
    )} ></div>
  )
}
