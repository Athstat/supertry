import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type StatCardProps = {
  label: string;
  value: number | string | undefined;
  icon?: ReactNode;
  valueClassName?: string;
  iconClassName?: string;
  className?: string
}

export function StatCard({ label, value, icon, valueClassName, className }: StatCardProps) {

  if (value === null || value === undefined) return <></>

  return (
    <div className={twMerge(
      "bg-gray-200 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-2",
      className
    )}>
     
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

    </div>
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