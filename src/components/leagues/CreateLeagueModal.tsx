import React, { useState, useEffect } from 'react';
import { X, Users, DollarSign, Calendar, Lock, Globe } from 'lucide-react';
import { userCreatedLeagueService } from '../../services/userCreatedLeagueService';
import { ICreateFantasyLeague } from '../../types/userCreatedLeague';
import { leagueService } from '../../services/leagueService';
import { ISeason } from '../../types/fantasyLeague';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeagueCreated: (league: any) => void;
}

export default function CreateLeagueModal({
  isOpen,
  onClose,
  onLeagueCreated,
}: CreateLeagueModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ICreateFantasyLeague>({
    title: '',
    description: '',
    is_public: true,
    max_teams: undefined,
    entry_fee: 0,
    prize_pool: 0,
    rules: '',
    season_id: '',
  });
  const [seasons, setSeasons] = useState<ISeason[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchSeasons();
    }
  }, [isOpen]);

  const fetchSeasons = async () => {
    setIsLoadingSeasons(true);
    const data = await leagueService.getAllSeasons();
    setSeasons(data);
    setIsLoadingSeasons(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('League name is required');
      return;
    }
    if (!formData.season_id) {
      setError('Please select a competition/season');
      return;
    }

    try {
      setIsCreating(true);
      setError('');

      const newLeague = await userCreatedLeagueService.createFantasyLeague(formData);
      onLeagueCreated(newLeague);
      onClose();

      // Reset form
      setFormData({
        title: '',
        description: '',
        is_public: true,
        max_teams: undefined,
        entry_fee: 0,
        prize_pool: 0,
        rules: '',
        season_id: '',
      });
    } catch (error: any) {
      setError(error.message || 'Failed to create league');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: keyof ICreateFantasyLeague, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New League</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* League Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              League Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter league name"
              required
            />
          </div>

          {/* Competition/Season Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Competition / Season *
            </label>
            {isLoadingSeasons ? (
              <div className="text-gray-500 dark:text-gray-400">Loading competitions...</div>
            ) : (
              <select
                value={formData.season_id}
                onChange={e => handleInputChange('season_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a competition/season</option>
                {seasons.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe your league..."
              rows={3}
            />
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Privacy Setting
            </label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  checked={formData.is_public}
                  onChange={() => handleInputChange('is_public', true)}
                  className="mr-2 text-primary-600 dark:text-primary-500 focus:ring-primary-500"
                />
                <Globe className="w-4 h-4 mr-1" />
                Public
              </label>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  checked={!formData.is_public}
                  onChange={() => handleInputChange('is_public', false)}
                  className="mr-2 text-primary-600 dark:text-primary-500 focus:ring-primary-500"
                />
                <Lock className="w-4 h-4 mr-1" />
                Invitation only
              </label>
            </div>
          </div>

          {/* League Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Max Teams */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Max Teams
              </label>
              <input
                type="number"
                value={formData.max_teams || ''}
                onChange={e =>
                  handleInputChange(
                    'max_teams',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="e.g., 12"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                min="2"
                max="50"
              />
            </div>

            {/* Join Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Join Deadline
              </label>
              <input
                type="datetime-local"
                value={formData.join_deadline || ''}
                onChange={e => handleInputChange('join_deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              League Rules
            </label>
            <textarea
              value={formData.rules}
              onChange={e => handleInputChange('rules', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter league rules..."
              rows={4}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2 px-4 rounded-md transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create League'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
