import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
        <motion.div
          key={step}
          className={`h-2 rounded-full transition-all duration-300 ${
            step === currentStep
              ? 'w-8 bg-primary-600 dark:bg-primary-400'
              : step < currentStep
                ? 'w-2 bg-primary-400 dark:bg-primary-500'
                : 'w-2 bg-gray-300 dark:bg-gray-600'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: step * 0.1 }}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
