import { useEffect, useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import InputField from '../../ui/forms/InputField';
import PrimaryButton from '../../ui/buttons/PrimaryButton';
import FormErrorText from '../../ui/forms/FormError';
import { useEmailUniqueValidator } from '../../../hooks/useEmailUniqueValidator';
import { emailValidator } from '../../../utils/stringUtils';

interface OnboardingStep2Props {
  email: string;
  onEmailChange: (email: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingStep2Email({
  email,
  onEmailChange,
  onNext,
  onBack,
}: OnboardingStep2Props) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string>('');

  const { emailTaken, isLoading: isEmailCheckLoading } = useEmailUniqueValidator(email);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setError('Email is required');
      return false;
    }
    if (!emailValidator(value)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const isEmailValid = email && emailValidator(email) && !emailTaken;

  const handleBlur = () => {
    setTouched(true);
    validateEmail(email);
  };

  const handleChange = (value?: string) => {
    const newValue = (value || '').toLowerCase();
    onEmailChange(newValue);
    if (touched) {
      validateEmail(newValue);
    }
  };

  const handleNext = () => {
    if (isEmailValid && !isEmailCheckLoading) {
      onNext();
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    const input = document.getElementById('email');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Enter your email</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We'll use this to keep your account secure
        </p>
      </div>

      <div>
        <InputField
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={handleChange}
          icon={<Mail className="h-5 w-5" />}
          error={touched && error ? error : undefined}
          className="mt-4"
          required
        />
        {emailTaken && !isEmailCheckLoading && (
          <FormErrorText error="This email is already registered" />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <PrimaryButton
          onClick={handleNext}
          disabled={!isEmailValid || isEmailCheckLoading}
          isLoading={isEmailCheckLoading}
          className="w-full py-3"
        >
          Next
          <ArrowRight size={20} />
        </PrimaryButton>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}
