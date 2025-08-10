import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { leagueService } from '../../services/leagueService';
import PrimaryButton from '../shared/buttons/PrimaryButton';

interface JoinLeagueByCodeProps {
  onSuccess?: () => void;
}

export default function JoinLeagueByCode({ onSuccess }: JoinLeagueByCodeProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 4) {
      setError('Please enter a valid league code');
      return;
    }

    try {
      setLoading(true);
      const res = await leagueService.joinLeagueByCode(trimmed);
      if (res.success) {
        setSuccess('Successfully joined the league!');
        setCode('');
        onSuccess?.();
      } else {
        setError(res.message || 'League code not found');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-md font-bold text-gray-700 dark:text-gray-300 mb-1">
            Enter League Code
          </label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC123"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-center tracking-wider font-mono"
            maxLength={18}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded">
            <Check size={16} />
            <span>{success}</span>
          </div>
        )}

        <PrimaryButton
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
        >
          {loading ? 'Joining...' : 'Find League'}
        </PrimaryButton>
      </form>
    </div>
  );
}
