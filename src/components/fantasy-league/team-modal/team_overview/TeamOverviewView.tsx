import { IProAthlete } from '../../../../types/athletes'
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from '../../../../types/fantasyLeague'
import { StatCard } from '../../../shared/StatCard'
import { TeamAthletesGridView } from './TeamAthletesGridView'

type Props = {
    roundTeam: FantasyLeagueTeamWithAthletes,
    currentRound: IFantasyLeagueRound,
    onSelectPlayer?: (player: IProAthlete) => void,
    hideStats?: boolean
}

/** Render team overview view */
export default function TeamOverviewView({ roundTeam, currentRound, onSelectPlayer, hideStats = false }: Props) {

    const overallScore = roundTeam ? roundTeam?.overall_score : 0;
    const teamValue = roundTeam ? roundTeam?.athletes?.reduce((sum, a) => {
        return sum + (a.purchase_price ?? 0);
    }, 0) : 0;

    const handleClickPlayer = (player: IProAthlete) => {
        if (onSelectPlayer) {
            onSelectPlayer(player);
        }
    }

    return (
        <div className='flex flex-col gap-4' >
            {!hideStats && <div className="grid grid-cols-2 gap-2" >

                <StatCard
                    label="Round"
                    value={currentRound?.title}
                // icon={<Trophy className="w-4 h-4" />}
                />

                <StatCard
                    label="Rank"
                    value={roundTeam?.rank}
                // icon={<ChartBarIncreasing className="w-4 h-4" />}
                />

                <StatCard
                    label="Points"
                    value={overallScore ? Math.floor(overallScore) : 0}
                />

                <StatCard
                    label="Team Value"
                    value={teamValue ? Math.floor(teamValue) : 0}
                // icon={<CircleDollarSignIcon className="w-4 h-4" />}
                />
            </div>}

            {/* <TeamFormation 
                        players={}
                    /> */}

            {roundTeam && <TeamAthletesGridView
                roundTeam={roundTeam}
                onClickPlayer={handleClickPlayer}
            />}
        </div>
    )
}
