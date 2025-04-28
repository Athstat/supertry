import { CircleXIcon, PercentIcon, Shield } from 'lucide-react'
import { EnhancedStatBar } from '../../shared/EnhancedStatBar'
import { forwardRef } from 'react'
import { ExpanedStats } from '../../../screens/PlayerProfileScreen'
import { RugbyPlayer } from '../../../types/rugbyPlayer'
import { AthleteSportsActionAggregated, getPlayerAggregatedStat } from '../../../types/sports_actions'
import { StatCard } from '../../shared/StatCard'

type Props = {
    player: RugbyPlayer,
    expandedStats: ExpanedStats,
    toggleStatExpanded: (key: string) => void,
    aggregatedStats: AthleteSportsActionAggregated[]
}

export const PlayerProfileDefending = forwardRef<HTMLDivElement, Props>(({ player, toggleStatExpanded, expandedStats, aggregatedStats }, ref) => {

    const tackles = getPlayerAggregatedStat("TacklesMade", aggregatedStats);
    const missedTackles = getPlayerAggregatedStat("TacklesMissed", aggregatedStats);
    const tacklesPerc = getPlayerAggregatedStat("TackleSuccess", aggregatedStats);

    return (
        <div
            ref={ref}
            className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
        >
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Defense</h2>
            <div className="space-y-4">

                <div className='grid grid-cols-2 gap-3' >
                    {tackles && <StatCard
                        label='Tackles Made'
                        value={tackles.action_count}
                        icon={<Shield className="text-indigo-500" size={20} />}
                    />}

                    {missedTackles && <StatCard
                        label='Missed Tackles'
                        value={missedTackles.action_count}
                        icon={<CircleXIcon className="text-red-500" size={20} />}
                    />}

                    {tacklesPerc && <StatCard
                        label='Tackle Success'
                        value={Math.round(tacklesPerc.action_count * 100) + "%"}
                        icon={<PercentIcon className="text-green-500" size={20} />}
                    />}
                </div>

                {player.tackling !== undefined && (
                    <EnhancedStatBar
                        id="tackling"
                        label="Tackling"
                        value={player.tackling}
                        maxValue={5}
                        icon={<Shield className="text-indigo-500" size={20} />}
                        expanded={expandedStats["tackling"] || false}
                        onToggle={() => toggleStatExpanded("tackling")}
                        description="Ability to stop opponents and prevent line breaks"
                        isExpanded={expandedStats["tackling"] || false}
                    />
                )}
            </div>
        </div>
    )
});
