import { twMerge } from "tailwind-merge"

type Props = {
    className?: string
}

/** Renders a new tag used to signify that a game is new */
export default function NewTag({className} : Props) {
  return (
    <div className={twMerge(
        "bg-green-500 border-green-500 cursor-pointer dark:bg-green-800/20 border dark:border-green-600 dark:text-green-600 px-2 text-xs text-white py-0.5 rounded-full",
        className
    )} >
        <p>New</p>
    </div>
  )
}
