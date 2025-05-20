import { ReactNode } from "react"

type Props = {
    children?: ReactNode
}

export default function WarningCard({children}: Props) {
  return (
    <div className='bg-yellow-100  dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-900 mt-2 rounded-xl px-3 py-1 text-yellow-700 dark:text-yellow-600 flex flex-row items-center gap-1' >
        {children}
    </div>
  )
}
