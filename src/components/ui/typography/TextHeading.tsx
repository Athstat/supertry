import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  children?: ReactNode,
  className?: string
}

/** Renders an h1, with app font */
export default function TextHeading({ children, className }: Props) {
  return (
    <h1
      className={twMerge(
        "text-[22px] ",
        className
      )}

      style={{ fontFamily: 'Oswald, sans-serif' }}
    >
      {children}
    </h1>
  )
}
