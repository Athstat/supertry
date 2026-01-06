import { useState } from 'react';
import { User, Mail, Lock, Pencil, ArrowLeft } from 'lucide-react';
import PrimaryButton from '../../ui/buttons/PrimaryButton';

interface OnboardingStep4Props {
  username: string;
  email: string;
  password: string;
  onEditUsername: () => void;
  onEditEmail: () => void;
  onEditPassword: () => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export function OnboardingStep4Review({
  username,
  email,
  password,
  onEditUsername,
  onEditEmail,
  onEditPassword,
  onSubmit,
  onBack,
  isLoading,
  error,
}: OnboardingStep4Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Review your details</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Make sure everything looks good before creating your account
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Username Row */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditUsername}
            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>

        {/* Email Row */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditEmail}
            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>

        {/* Password Row */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Lock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Password</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {'•'.repeat(password.length)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditPassword}
            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <PrimaryButton
          onClick={onSubmit}
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full py-3"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </PrimaryButton>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
}
