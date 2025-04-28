import React, { forwardRef } from 'react'
import { RugbyPlayer } from '../../../types/rugbyPlayer';
import { Crosshair, RulerDimensionLineIcon, Target } from 'lucide-react';
import { EnhancedStatBar } from '../../shared/EnhancedStatBar';
import { ExpanedStats } from '../../../screens/PlayerProfileScreen';
import { AthleteSportsActionAggregated, getPlayerAggregatedStat } from '../../../types/sports_actions';
import { StatCard } from '../../shared/StatCard';
import { MdSportsRugby } from 'react-icons/md';

type Props = {
    player: RugbyPlayer,
    expandedStats: ExpanedStats,
    toggleStatExpanded: (key: string) => void,
    aggregatedStats: AthleteSportsActionAggregated[]
}

export const PlayerProfileKicking = forwardRef<HTMLDivElement, Props>(({ player, expandedStats, toggleStatExpanded, aggregatedStats }, ref) => {

    const kicksFromHand = getPlayerAggregatedStat("KicksFromHand", aggregatedStats);
    const kickMetres = getPlayerAggregatedStat("KicksFromHandMetres", aggregatedStats);

    return (
        <div
            ref={ref}
            className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
        >
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Kicking</h2>
            <div className="space-y-4">

                <div className='grid grid-cols-2 gap-3' >
                    {kicksFromHand && <StatCard
                        label='Kicks From hand'
                        value={kicksFromHand.action_count}
                        icon={<MdSportsRugby className="text-orange-500" size={20} />}
                    />}

                    {kickMetres && <StatCard
                        label='Kick Metres'
                        value={kickMetres.action_count + ""}
                        icon={<RulerDimensionLineIcon className="text-green-500" size={20} />}
                    />}
                </div>

                {player.points_kicking !== undefined && (
                    <EnhancedStatBar
                        id="points_kicking"
                        label="Points Kicking"
                        value={player.points_kicking}
                        maxValue={5}
                        icon={<Crosshair className="text-orange-500" size={20} />}
                        expanded={expandedStats["points_kicking"] || false}
                        onToggle={() => toggleStatExpanded("points_kicking")}
                        description="Accuracy and reliability in penalty and conversion kicks"
                        isExpanded={expandedStats["points_kicking"] || false}
                    />
                )}
                {player.infield_kicking !== undefined && (
                    <EnhancedStatBar
                        id="infield_kicking"
                        label="Infield Kicking"
                        value={player.infield_kicking}
                        maxValue={5}
                        icon={<Target className="text-cyan-500" size={20} />}
                        expanded={expandedStats["infield_kicking"] || false}
                        onToggle={() => toggleStatExpanded("infield_kicking")}
                        description="Tactical kicking ability during open play"
                        isExpanded={expandedStats["infield_kicking"] || false}
                    />
                )}
            </div>
        </div>
    )
});
