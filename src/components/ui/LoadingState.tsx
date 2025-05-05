import { twMerge } from "tailwind-merge";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

type Props = {
  count?: number,
  className?: string
}

export function LoadingShimmer({count = 1, className} : Props) {

  const nums = [];

  for (let x = 0; x < count; x++) {
    nums.push(x);
  }

  return (
    <div className="grid grid-col-1 gap-2" >
      {nums.map((index) => {
        return <div key={index} className={twMerge("w-full bg-slate-100 dark:bg-slate-800 animate-pulse h-5 rounded-xl", className)} ></div>
      })}
    </div>
  )
}