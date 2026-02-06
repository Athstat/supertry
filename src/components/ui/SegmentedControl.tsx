import { twMerge } from 'tailwind-merge';

type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function SegmentedControl({ options, value, onChange, className }: Props) {
  return (
    <div
      className={twMerge(
        ' bg-slate-100 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-2xl',
        className
      )}
    >
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={twMerge(
            'px-3 py-2 text-[10px] font-medium rounded-2xl transition-all duration-200',
            value === option.value
              ? 'bg-[#19336C] text-white dark:bg-slate-600 shadow-sm'
              : 'text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
