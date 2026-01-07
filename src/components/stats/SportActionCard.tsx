import { twMerge } from "tailwind-merge"
import { SportAction } from "../../types/sports_actions"
import { useTooltip } from "../../hooks/ui/useTooltip"
import { sanitizeStat, getStatUnit } from "../../utils/stringUtils"
import { GameSportAction } from "../../types/boxScore"
import { Info } from "lucide-react"
import { useSportActions } from "../../hooks/useSportActions"

type Props = {
  sportAction?: SportAction | GameSportAction,
  className?: string,
  labelClassName?: string,
  fallbackValue?: number,
  fallbackLabel?: string,
  hideInfoIcon?: boolean,
  valueClassName?: string,
  disableTooltip?: boolean
}

/** Renders a sport action */
export default function SportActionCard({ sportAction, className, labelClassName, fallbackLabel, fallbackValue, hideInfoIcon, valueClassName, disableTooltip }: Props) {


  const { getDefinition } = useSportActions();
  const { openTooltipModal } = useTooltip();

  const otherDef = getDefinition(fallbackLabel);
  const definition = sportAction?.definition;
  const finalDef = definition || otherDef;

  const handleClick = () => {
      if (finalDef && !disableTooltip) {
        const { display_name, category, tooltip } = finalDef;
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
          {sportAction?.definition?.display_name || fallbackLabel}
        </p>

        {!hideInfoIcon && <Info className="w-3 h-3 dark:text-white/40 text-black/40" />}

      </div>
      <p className={twMerge(
        "font-bold text-sm",
        valueClassName
      )} >{sanitizeStat(sportAction?.action_count || fallbackValue)}{getStatUnit(sportAction?.definition?.display_name || fallbackLabel)}</p>
    </div>
  )
}
