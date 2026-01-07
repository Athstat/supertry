import { twMerge } from "tailwind-merge"
import { SportAction } from "../../types/sports_actions"
import { useTooltip } from "../../hooks/ui/useTooltip"
import { sanitizeStat, getStatUnit } from "../../utils/stringUtils"
import { GameSportAction } from "../../types/boxScore"
import { Info } from "lucide-react"

type Props = {
  sportAction: SportAction | GameSportAction,
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
      <div className="flex flex-row items-center gap-1" >
        <p
          className={twMerge(
            'text-slate-700 dark:text-slate-300 text-sm',
            labelClassName,
          )}
        >
          {sportAction.definition?.display_name}
        </p>

        <Info className="w-4 h-4 dark:text-white/40 text-black/40" />
      </div>
      <p className="font-bold text-sm" >{sanitizeStat(sportAction.action_count)}{getStatUnit(sportAction.definition?.display_name)}</p>
    </div>
  )
}
