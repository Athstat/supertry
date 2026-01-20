import { ReactNode, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../typography/SecondaryText";
import RoundedCard from "./RoundedCard";
import { SportActionDefinition } from "../../../types/sports_actions";
import { useTooltip } from "../../../hooks/ui/useTooltip";
import { useSportActions } from "../../../hooks/useSportActions";

type StatCardProps = {
  label?: string;
  value?: number | string | undefined;
  icon?: ReactNode;
  valueClassName?: string;
  iconClassName?: string;
  className?: string;
  definition?: SportActionDefinition;
  actionName?: string
}

export function StatCard({ label, value, icon, valueClassName, className, definition, actionName }: StatCardProps) {

  const { openTooltipModal } = useTooltip();
  const { getDefinition } = useSportActions();

  const handleClick = useCallback(() => {
    const finalDef = definition || getDefinition(actionName);

    if (finalDef) {
      const { display_name, category, tooltip } = finalDef;
      const title = display_name ? `${display_name} (${category})` : display_name;
      openTooltipModal(title, tooltip);
    }

  }, [actionName, definition, getDefinition, openTooltipModal]);

  if (value === null || value === undefined) return <></>;
  return (
    <RoundedCard

      className={twMerge(
        "bg-gray-200 cursor-pointer border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-2",
        className
      )}

      onClick={handleClick}

    >

      <div className="flex items-center gap-1 mb-0">
        {icon}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>

      <div className="flex items-center">
        <div className={twMerge("text-sm font-semibold dark:text-gray-100 mr-2", valueClassName)}>
          {value}
        </div>
      </div>

    </RoundedCard>
  );
};

export function InfoCard({ label, value, icon, valueClassName, className }: StatCardProps) {

  return (
    <div className={twMerge(
      "bg-gray-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 transition-all duration-300 hover:shadow-md",
      className
    )}>

      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        {icon}
        <span className="text-sm font-medium ">
          {label}
        </span>
      </div>

      <div className="flex items-center">
        <div className={twMerge("text-ld font-medium dark:text-gray-100 mr-2", valueClassName)}>
          {value ?? "-"}
        </div>
      </div>

    </div>
  );
};

export function StatCard2({ label, value, icon, valueClassName, className, definition, actionName }: StatCardProps) {

  const { openTooltipModal } = useTooltip();

  const { getDefinition } = useSportActions();


  const handleClick = useCallback(() => {
    const finalDef = definition || getDefinition(actionName);

    if (finalDef) {
      const { display_name, category, tooltip } = finalDef;
      const title = display_name ? `${display_name} (${category})` : display_name;
      openTooltipModal(title, tooltip);
    }

  }, [actionName, definition, getDefinition, openTooltipModal]);

  if (value === null || value === undefined) return <></>

  return (
    <RoundedCard
      className={twMerge(
        "bg-gray-200  cursor-pointer border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-4 flex flex-col items-center justify-center",
        className
      )}

      onClick={handleClick}
    >

      <div className="flex flex-col items-center justify-center text-center gap-1 mb-0">

        {icon}

        <div className="flex items-center flex-col justify-center w-full">
          <div className={twMerge("text-lg font-bold dark:text-gray-100", valueClassName)}>
            {value}
          </div>
        </div>

        <SecondaryText className="text-[11px] font-medium text-wrap">
          {label}
        </SecondaryText>
      </div>


    </RoundedCard>
  );
};