import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  children?: ReactNode,
  className?: string,
  blue?: boolean
}

/** Renders an h1, with app font */
export default function TextHeading({ children, className, blue = false }: Props) {
  return (
    <h1
      className={twMerge(
        "text-[22px] ",
        blue ? 'text-[#011E5C] dark:text-white' : '',
        className
      )}

      style={{ fontFamily: 'Oswald, sans-serif' }}
    >
      {children}
    </h1>
  )
}
