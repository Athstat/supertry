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
        'inline-flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg gap-1',
        className
      )}
    >
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={twMerge(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
            value === option.value
              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
