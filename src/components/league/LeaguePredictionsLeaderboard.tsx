import React from 'react';

type LeaguePredictionsLeaderboardProps = {
  leagueId: string;
};

// Mock data for the leaderboard
const mockLeaderboardData = [
  {
    user_id: '1',
    username: 'JohnDoe',
    avatar_url: null,
    first_name: 'John',
    last_name: 'Doe',
    predictions_made: 24,
    correct_predictions: 18,
    wrong_predictions: 6,
    predictions_perc: 0.75,
    rank: 1,
  },
  {
    user_id: '2',
    username: 'JaneSmith',
    avatar_url: null,
    first_name: 'Jane',
    last_name: 'Smith',
    predictions_made: 24,
    correct_predictions: 16,
    wrong_predictions: 8,
    predictions_perc: 0.67,
    rank: 2,
  },
  {
    user_id: '3',
    username: 'MikeJohnson',
    avatar_url: null,
    first_name: 'Mike',
    last_name: 'Johnson',
    predictions_made: 22,
    correct_predictions: 14,
    wrong_predictions: 8,
    predictions_perc: 0.64,
    rank: 3,
  },
];

export default function LeaguePredictionsLeaderboard({
  leagueId,
}: LeaguePredictionsLeaderboardProps) {
  // In a real implementation, this would fetch data based on the leagueId
  const leaderboard = mockLeaderboardData;

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Predictions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Correct
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Accuracy
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800/20 divide-y divide-gray-200 dark:divide-slate-700">
            {leaderboard.map(user => (
              <tr key={user.user_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-200">
                        {user.first_name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.predictions_made}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.correct_predictions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                    {Math.round(user.predictions_perc * 100)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
