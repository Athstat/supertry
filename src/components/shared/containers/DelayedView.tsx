import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LoadingState } from "../../ui/LoadingState";

type DelayedViewProps = {
  delay?: number;
  children: React.ReactNode;
  className?: string
};

/** Component that hides a heavy component while it mounts */
export default function DelayedView({ delay = 2000, children, className }: DelayedViewProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="relative">
      {/* Loading Spinner */}
      {!show && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white dark:bg-black">
          <LoadingState />
        </div>
      )}

      {/* Hidden but mounted content */}
      <div className={twMerge(`transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`, className)}>
        {children}
      </div>
    </div>
  );
}
