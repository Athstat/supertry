import { twMerge } from "tailwind-merge"
import { SportAction } from "../../types/sports_actions"

type Props = {
  sportAction: SportAction,
  className?: string,
  labelClassName?: string
}

/** Renders a sport action */
export default function SportActionCard({ sportAction, className, labelClassName }: Props) {
  return (
    <div className={twMerge(
      "flex flex-row items-center justify-between",
      className
    )} >
      <p className={labelClassName} >{sportAction.definition?.display_name}</p>
      <p className="font-bold text-sm" >{sportAction.action_count}</p>
    </div>
  )
}
