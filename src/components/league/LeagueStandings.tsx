import React, { useRef, useEffect } from 'react';
import { Trophy, Filter, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TeamStats } from '../../types/league';

interface LeagueStandingsProps {
  teams: TeamStats[];
  showJumpButton: boolean;
  onJumpToTeam: () => void;
}

export function LeagueStandings({ teams, showJumpButton, onJumpToTeam }: LeagueStandingsProps) {
  const userTeamRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const ROW_HEIGHT = 53;
  const HEADER_HEIGHT = 56;
  const TABLE_HEIGHT = (ROW_HEIGHT * 6) + HEADER_HEIGHT;

  const getRankChange = (currentRank: number, lastRank: number) => {
    if (currentRank < lastRank) {
      return <ArrowUp className="text-green-500" size={16} />;
    } else if (currentRank > lastRank) {
      return <ArrowDown className="text-red-500" size={16} />;
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm overflow-hidden border border-gray-200 dark:border-dark-600">
      <div className="p-4 border-b border-gray-100 dark:border-dark-600 sticky top-0 bg-white dark:bg-dark-850 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
            <Trophy size={24} className="text-primary-500" />
            League Standings
          </h2>
          <div className="flex items-center gap-2">
            {showJumpButton && (
              <button
                onClick={onJumpToTeam}
                className="flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors"
              >
                <ChevronDown size={16} />
                <span className="text-sm font-medium">Jump to My Team</span>
              </button>
            )}
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={tableRef}
        className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-600 scrollbar-track-gray-100 dark:scrollbar-track-dark-800" 
        style={{ height: `${TABLE_HEIGHT}px` }}
      >
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 dark:bg-dark-800 z-10">
            <tr>
              <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Rank</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Team</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Manager</th>
              <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">GW</th>
              <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
            {teams.map((team) => (
              <tr
                key={team.id}
                ref={team.isUserTeam ? userTeamRef : null}
                className={`hover:bg-gray-50 dark:hover:bg-dark-800 cursor-pointer transition-colors ${
                  team.isUserTeam ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                }`}
              >
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${
                      team.rank === 1 ? 'text-yellow-500 dark:text-yellow-400' :
                      team.rank === 2 ? 'text-gray-400 dark:text-gray-500' :
                      team.rank === 3 ? 'text-amber-600 dark:text-amber-500' :
                      'text-gray-900 dark:text-gray-100'
                    }`}>
                      {team.rank}
                    </span>
                    {getRankChange(team.rank, team.lastRank)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="font-medium dark:text-gray-100">{team.teamName}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{team.managerName}</td>
                <td className="py-3 px-4 text-right font-medium dark:text-gray-300">{team.weeklyPoints}</td>
                <td className="py-3 px-4 text-right font-bold text-primary-600 dark:text-primary-400">{team.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}