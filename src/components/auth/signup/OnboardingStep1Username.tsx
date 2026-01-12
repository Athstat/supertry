import { useEffect, useState } from 'react';
import { User, ArrowRight, ArrowLeft } from 'lucide-react';
import InputField from '../../ui/forms/InputField';
import PrimaryButton from '../../ui/buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep1Props {
  username: string;
  onUsernameChange: (username: string) => void;
  onNext: () => void;
}

export function OnboardingStep1Username({
  username,
  onUsernameChange,
  onNext,
}: OnboardingStep1Props) {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [touched,] = useState(false);

  const validateUsername = (value: string): boolean => {
    if (!value) {
      setError('Username is required');
      return false;
    }
    if (value.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (value.length > 20) {
      setError('Username must be less than 20 characters');
      return false;
    }
    setError('');
    return true;
  };

  const isValid = username.length >= 3 && username.length <= 20;

  const handleChange = (value?: string) => {
    const newValue = value || '';
    onUsernameChange(newValue);
    if (touched) {
      validateUsername(newValue);
    }
  };

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    const input = document.getElementById('username');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pick your username</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Choose a unique username for your account
        </p>
      </div>

      <div>
        <InputField
          id="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={handleChange}
          icon={<User className="h-5 w-5" />}
          error={touched && error ? error : undefined}
          className="mt-4"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={handleNext} disabled={!isValid} className="w-full py-3">
          Next
          <ArrowRight size={20} />
        </PrimaryButton>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Welcome</span>
        </button>
      </div>
    </div>
  );
}
