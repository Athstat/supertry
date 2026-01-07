import { twMerge } from "tailwind-merge"
import { SportAction } from "../../types/sports_actions"
import { useTooltip } from "../../hooks/ui/useTooltip"

type Props = {
  sportAction: SportAction,
  className?: string,
  labelClassName?: string
}

/** Renders a sport action */
export default function SportActionCard({ sportAction, className, labelClassName }: Props) {

  const { definition } = sportAction;
  const { openTooltipModal } = useTooltip();

  const handleClick = () => {
    if (definition) {
      const { display_name, category, tooltip } = definition;
      const title = display_name ? `${display_name} (${category})` : display_name;
      openTooltipModal(title, tooltip);
    }
  }

  return (
    <div

      className={twMerge(
        "flex flex-row items-center justify-between",
        className
      )}

      onClick={handleClick}
    >
      <p className={labelClassName} >{sportAction.definition?.display_name}</p>
      <p className="font-bold text-sm" >{sportAction.action_count}</p>
    </div>
  )
}
