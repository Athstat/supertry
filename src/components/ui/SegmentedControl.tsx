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
        'inline-flex h-[40px] bg-slate-100 border border-[#011E5C] dark:bg-slate-800 rounded-full',
        className
      )}
    >
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={twMerge(
            'px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
            value === option.value
              ? 'bg-[#19336C] text-white dark:bg-slate-700 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
