import { twMerge } from 'tailwind-merge';

interface ImageLoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ImageLoadingSpinner = ({ className, size = 'md' }: ImageLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={twMerge('flex items-center justify-center', className)}>
      <div
        className={twMerge(
          'animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default ImageLoadingSpinner;
