import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { PasswordInputField } from '../../shared/InputField';
import PrimaryButton from '../../ui/buttons/PrimaryButton';

interface OnboardingStep3Props {
  password: string;
  onPasswordChange: (password: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingStep3Password({
  password,
  onPasswordChange,
  onNext,
  onBack,
}: OnboardingStep3Props) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string>('');

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    setError('');
    return true;
  };

  const isValid = password.length >= 6;

  const handleBlur = () => {
    setTouched(true);
    validatePassword(password);
  };

  const handleChange = (value?: string) => {
    const newValue = value || '';
    onPasswordChange(newValue);
    if (touched) {
      validatePassword(newValue);
    }
  };

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    const input = document.getElementById('password');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create your password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Choose a secure password (at least 8 characters)
        </p>
      </div>

      <div>
        <PasswordInputField
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={handleChange}
          minLength={8}
          className="mt-4"
        />
        {touched && error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={handleNext} disabled={!isValid} className="w-full py-3">
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
