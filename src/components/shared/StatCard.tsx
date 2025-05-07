import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type StatCardProps = {
  label: string;
  value: number | string;
  icon?: ReactNode;
  valueClassName?:string;
  iconClassName?: string
}

export function StatCard({ label, value, icon, valueClassName}: StatCardProps) {

  if (value === null || value === undefined) return <></>
  
  return (
    <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
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