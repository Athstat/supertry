import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  icon?: ReactNode;
  label?: string;
  children?: ReactNode;
  open?: boolean;
  toggle?: () => void;
  overlay?: boolean;
  overlayClassName?: string;
};

export default function Collapsable({
  icon,
  label,
  children,
  open,
  toggle,
  overlay,
  overlayClassName,
}: Props) {
  const handleToggle = () => {
    if (toggle) {
      toggle();
    }
  };

  return (
    <div className="bg-slate-200 border border-slate-300 dark:border-slate-600  dark:bg-slate-700/60 p-1 rounded-md relative">
      <div
        onClick={handleToggle}
        className="w-full cursor-pointer px-2 py-1 flex flex-row items-center justify-between rounded-md"
      >
        <div className="flex flex-row items-center gap-1">
          {icon}
          <p className="text-sm">{label}</p>
        </div>

        <div>{open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
      </div>

      {open ? (
        overlay ? (
          <div
            className={
              'absolute left-0 right-0 z-30 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-2 ' +
              (overlayClassName ?? '')
            }
          >
            {children}
          </div>
        ) : (
          children
        )
      ) : undefined}
    </div>
  );
}
