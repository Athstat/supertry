import { Dumbbell, RulerDimensionLine, RulerIcon, StarIcon, Target, VenetianMaskIcon, Wand2, Zap } from "lucide-react"
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { EnhancedStatBar } from "../../shared/EnhancedStatBar"
import { GroupedStatsGrid } from "../../shared/GroupedStatsGrid"
import { forwardRef } from "react"
import { ExpanedStats } from "../../../screens/PlayerProfileScreen"
import { AthleteSportsActionAggregated, getPlayerAggregatedStat } from "../../../types/sports_actions"
import { StatCard } from "../../shared/StatCard"
import { MdOutlineSportsRugby } from "react-icons/md"
import { GrRun } from "react-icons/gr"

type Props = {
    player: RugbyPlayer,
    expandedStats: ExpanedStats,
    toggleStatExpanded: (key: string) => void,
    aggregatedStats: AthleteSportsActionAggregated[]
}

export const PlayerProfileAttack = forwardRef<HTMLDivElement, Props>(({ player, expandedStats, toggleStatExpanded, aggregatedStats }, ref) => {

    const carries = getPlayerAggregatedStat("Carries", aggregatedStats);
    const passes = getPlayerAggregatedStat("Passes", aggregatedStats);
    const defendersBeaten = getPlayerAggregatedStat("DefendersBeaten", aggregatedStats);
    const offloads = getPlayerAggregatedStat("Offloads", aggregatedStats);
    const metres = getPlayerAggregatedStat("Metres", aggregatedStats);
    const tries = getPlayerAggregatedStat("Tries", aggregatedStats);

    return (
        <GroupedStatsGrid className="grid-cols-none space-y-4" title="Attack" ref={ref}>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-2" >
                {tries && <StatCard
                    label="Tries"
                    value={tries.action_count}
                    icon={<MdOutlineSportsRugby className="text-red-500" size={20} />}
                />}

                {carries && <StatCard
                    label="Carries"
                    value={carries.action_count}
                    icon={<VenetianMaskIcon className="text-red-500" size={20} />}
                />}

                {metres && <StatCard
                    label="Metres Gained"
                    value={metres.action_count}
                    icon={<RulerDimensionLine className="text-red-500" size={20} />}
                />}

                {defendersBeaten && <StatCard
                    label="Defenders Beaten"
                    value={defendersBeaten.action_count}
                    icon={<GrRun className="text-blue-500" size={20} />}
                />}

                {offloads && <StatCard
                    label="Offloads"
                    value={offloads.action_count}
                    icon={<Wand2 className="text-red-500" size={20} />}
                />}

                {passes && <StatCard
                    label="Passes"
                    value={passes.action_count}
                    icon={<StarIcon className="text-yellow-500" size={20} />}
                />}

            </div>

            {player.strength !== undefined && (
                <EnhancedStatBar
                    id="strength"
                    label="Strength"
                    value={player.strength}
                    maxValue={5}
                    icon={<Dumbbell className="text-red-500" size={20} />}
                    expanded={expandedStats["strength"] || false}
                    onToggle={() => toggleStatExpanded("strength")}
                    description="Physical power in contact situations and scrums"
                    isExpanded={expandedStats["strength"] || false}
                />
            )}
            {player.playmaking !== undefined && (
                <EnhancedStatBar
                    id="playmaking"
                    label="Playmaking"
                    value={player.playmaking}
                    maxValue={5}
                    icon={<Target className="text-blue-500" size={20} />}
                    expanded={expandedStats["playmaking"] || false}
                    onToggle={() => toggleStatExpanded("playmaking")}
                    description="Ability to create opportunities and execute strategic plays"
                    isExpanded={expandedStats["playmaking"] || false}
                />
            )}
            {player.ball_carrying !== undefined && (
                <EnhancedStatBar
                    id="ball_carrying"
                    label="Ball Carrying"
                    value={player.ball_carrying}
                    maxValue={5}
                    icon={<Zap className="text-green-500" size={20} />}
                    expanded={expandedStats["ball_carrying"] || false}
                    onToggle={() => toggleStatExpanded("ball_carrying")}
                    description="Effectiveness in advancing with the ball and breaking tackles"
                    isExpanded={expandedStats["ball_carrying"] || false}
                />
            )}

        </GroupedStatsGrid>
    )
});
