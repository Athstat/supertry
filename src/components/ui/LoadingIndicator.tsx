import { Loader } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string,
  loaderClassName?: string,
  message?: string
}

/** Renders a loading indicator to show that the UI is busy doing/fetching something */
export function LoadingIndicator({className, loaderClassName, message} : Props){
  return (
    <div
      className={twMerge(
        "min-h-screen flex items-start justify-center pt-[30vh]",
        className
      )}
      aria-label="Loading"
      role="status"
    >
      <Loader className={twMerge(
        "w-10 h-10 text-primary-600 animate-spin",
        loaderClassName
      )} />

      {message && <p>{message}</p>}
    </div>
  );
};
