import React from 'react'
import { IFantasyLeagueRound } from '../../types/fantasyLeague'
import { Users } from 'lucide-react'

type Props = {
    league: IFantasyLeagueRound,
    handleJoinLeague: (league: IFantasyLeagueRound) => void,
    handleViewLeague: (league: IFantasyLeagueRound) => void,

}

export default function LeagueSmallCard({league, handleJoinLeague, handleViewLeague} : Props) {
    return (
        <div
            key={league.id}
            className="bg-gray-50 dark:bg-dark-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold dark:text-white">
                    {league.title}
                </h3>
                <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                    {league.status || "Live"}
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Users size={16} />
                <span>{league.participants_count || "0"}</span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => handleViewLeague(league)}
                    className="flex-1 bg-transparent border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 py-2 rounded-lg hover:bg-primary-50/30 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium"
                >
                    View League
                </button>
                <button
                    onClick={() => handleJoinLeague(league)}
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                    Join Now
                </button>
            </div>
        </div>
    )
}
