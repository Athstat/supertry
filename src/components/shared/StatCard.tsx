import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import TabView, { TabViewPage } from "./tabs/TabView";

type StatCardProps = {
  label: string;
  value: number | string | undefined;
  icon?: ReactNode;
  valueClassName?:string;
  iconClassName?: string;
  className?: string
}

export function StatCard({ label, value, icon, valueClassName, className}: StatCardProps) {

  if (value === null || value === undefined) return <></>
  
  return (
    <div className={twMerge(
      "bg-gray-100 dark:bg-slate-900/20 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      <div className="flex items-center">
        <div className={twMerge("text-2xl font-bold dark:text-gray-100 mr-2", valueClassName)}>
          {value}
        </div>
      </div>

    </div>
  );
};