import React, { useState } from 'react';
import { Star, Zap, ChevronLeft, Edit2, AlertCircle, LayoutGrid, List, CheckCircle, Trophy, Users } from 'lucide-react';
import { Position } from '../types/position';
import { Player } from '../types/player';
import { positionGroups } from '../data/positionGroups';

interface ReviewTeamScreenProps {
  teamName: string;
  isFavorite: boolean;
  selectedPlayers: Record<string, Player>;
  onEdit: () => void;
  onSubmit: () => void;
  onToggleFavorite: () => void;
}

type ViewMode = 'list' | 'grid';

export function ReviewTeamScreen({
  teamName,
  isFavorite,
  selectedPlayers,
  onEdit,
  onSubmit,
  onToggleFavorite,
}: ReviewTeamScreenProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const totalCost = Object.values(selectedPlayers).reduce((acc, player) => acc + player.cost, 0);
  const averagePR = Object.values(selectedPlayers).reduce((acc, player) => acc + player.pr, 0) / 15;

  const handleSubmitSuccess = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const handleNavigateAfterSuccess = () => {
    setShowSuccessModal(false);
    onSubmit();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 px-2 sm:py-6 sm:px-4">
      <div className="container mx-auto max-w-[1400px]">
        {/* Header Card */}
        <div className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 dark:border-dark-600">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onEdit}
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Edit Team</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-dark-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-dark-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
              </div>
              <button
                onClick={onToggleFavorite}
                className={`${
                  isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'
                } hover:text-yellow-500 p-2 rounded-lg transition-colors`}
              >
                <Star size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-gray-100">{teamName}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-3 sm:p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-500">{totalCost} pts</div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-3 sm:p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Average PR</div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-500">{averagePR.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Position Groups */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
          {positionGroups.map((group) => (
            <div key={group.name} className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm overflow-hidden border border-gray-200 dark:border-dark-600">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-dark-600">
                <h2 className="text-lg sm:text-xl font-semibold dark:text-gray-100">{group.name}</h2>
              </div>

              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-dark-800">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                          <div className="w-40">Player</div>
                        </th>
                        <th className="py-3 px-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Position</th>
                        <th className="py-3 px-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Team</th>
                        <th className="py-3 px-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">PR</th>
                        <th className="py-3 px-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Cost</th>
                        <th className="py-3 px-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
                      {group.positions.map((position) => {
                        const player = selectedPlayers[position.id];
                        if (!player) return null;

                        return (
                          <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={player.image}
                                  alt={player.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <span className="font-medium truncate dark:text-gray-100">{player.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{position.name}</td>
                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{player.team}</td>
                            <td className="py-3 px-2 text-right font-medium text-yellow-600 dark:text-yellow-500 whitespace-nowrap">{player.pr}</td>
                            <td className="py-3 px-2 text-right font-medium text-green-600 dark:text-green-500 whitespace-nowrap">{player.cost} pts</td>
                            <td className="py-3 px-2">
                              <div className="flex justify-center">
                                <button
                                  onClick={onEdit}
                                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                  {group.positions.map((position) => {
                    const player = selectedPlayers[position.id];
                    if (!player) return null;

                    return (
                      <div 
                        key={position.id} 
                        className="relative bg-gray-50 dark:bg-dark-800 rounded-xl p-4 transition-transform hover:scale-[1.02] focus-within:scale-[1.02]"
                      >
                        <button
                          onClick={onEdit}
                          className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                          aria-label="Edit player"
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <div className="flex flex-col">
                          <div className="w-full aspect-[4/3] mb-3 relative rounded-lg overflow-hidden">
                            <img
                              src={player.image}
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-semibold text-base sm:text-lg truncate pr-8 dark:text-gray-100" title={player.name}>
                            {player.name}
                          </h3>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 whitespace-nowrap">{position.name}</div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Zap size={14} className="text-yellow-500" />
                              <span className="dark:text-gray-300">PR: {player.pr}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-dark-600">
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate" title={player.team}>
                              {player.team}
                            </div>
                            <div className="font-semibold text-green-600 dark:text-green-500 whitespace-nowrap">
                              {player.cost} pts
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm p-4 sm:p-6 max-w-2xl mx-auto border border-gray-200 dark:border-dark-600">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">Please review your team carefully before submitting</span>
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all active:transform active:scale-[0.98]"
            >
              Submit Team
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all border border-gray-200 dark:border-dark-600">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Confirm Submission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to submit your team? You won't be able to make changes after submission.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors order-2 sm:order-1 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSuccess}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors order-1 sm:order-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up border border-gray-200 dark:border-dark-600">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Submitted!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Congratulations! Your team has been successfully submitted to Premier Weekly League.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleNavigateAfterSuccess}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trophy size={20} />
                  Go to League
                </button>
                <button 
                  onClick={handleNavigateAfterSuccess}
                  className="w-full bg-white dark:bg-dark-800 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-xl font-semibold border-2 border-indigo-600 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-dark-700 transition-all flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  View Your Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}