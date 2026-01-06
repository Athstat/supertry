import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthLayout } from '../../components/auth/AuthLayout';
import useSWR from 'swr';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';
import { ErrorState } from '../../components/ui/ErrorState';
import { PasswordResetTokenIntrospect, RestError } from '../../types/auth';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { PasswordInputField } from '../../components/ui/forms/InputField';
import FormErrorText from '../../components/ui/forms/FormError';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';

// Success Modal Component
interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isVisible, onSignIn }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Password Reset Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your password has been reset successfully. Please sign in with your new password.
          </p>
          <button
            onClick={onSignIn}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:bg-primary-700"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResetPasswordScreen() {

  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const key = resetToken ? `/introspect/password-reset-token/${resetToken}` : null;
  const { data: passwordReset, isLoading } = useSWR(key, () => authService.introspectPasswdResetToken(resetToken ?? "fallback-token"));

  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const onSuccess = () => setShowSuccessModal(true);

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Please enter your new password below">

      {resetToken && passwordReset?.data && !showSuccessModal && (
        <ResetPasswordForm
          resetToken={resetToken}
          passwordReset={passwordReset?.data}
          onSuccess={onSuccess}
        />
      )}

      {!resetToken || !passwordReset || !passwordReset.data && (
        <ErrorState
          error={passwordReset.error?.message}
        />
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate('/signin')}
          className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          Back to Sign In
        </button>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onSignIn={() => navigate('/signin')}
      />
    </AuthLayout>
  );
};

type FormProps = {
  passwordReset: PasswordResetTokenIntrospect,
  resetToken: string,
  onSuccess: () => void
}

export function ResetPasswordForm({ resetToken, onSuccess }: FormProps) {

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const { isValid: isPasswordValid, reason: passwordMessage } = usePasswordValidation(newPassword);

  const handleResetPassword = async () => {
    setError('');
    
    if (!resetToken) return;
    
    if (!isPasswordValid) {
      setError(passwordMessage ?? "Invalid Password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {

      setIsLoading(true);
      const {data: resetData, error: resetError} = await authService.resetPassword(resetToken, newPassword);

      if (resetData) {
        onSuccess();
      } else {
        setError(resetError?.message ?? "Failed to reset password");
      }

    } catch (error) {
      setError((error as RestError).message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }

  };

  const hasEnteredPassword = newPassword.length > 0;
  const passwordsMatch = newPassword === confirmPassword;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className='flex flex-col gap-1' >
          <PasswordInputField
            label='New Password'
            placeholder='New Password'
            value={newPassword}
            onChange={(s) => {setNewPassword(s ?? "")}}
          />
          {hasEnteredPassword && <FormErrorText error={passwordMessage} />}
        </div>

        <div>
          <PasswordInputField
            label='Confirm Password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(s) => setConfirmPassword(s ?? "")}
          />

          {!passwordsMatch && <FormErrorText error='Passwords should match' />}
        </div>

        {}
      </div>

    <PrimaryButton
      isLoading={isLoading}
      disbabled={isLoading || !isPasswordValid}
      className='py-3.5' 
      onClick={handleResetPassword}
    >
      Reset Password
    </PrimaryButton>
    </form>
  )

}
