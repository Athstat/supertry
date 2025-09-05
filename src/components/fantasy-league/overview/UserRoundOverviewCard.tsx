import { ArrowRight, Lock } from "lucide-react"
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from "../../../types/fantasyLeague"
import BlueGradientCard from "../../shared/BlueGradientCard"
import { TranslucentButton } from "../../shared/buttons/PrimaryButton"
import { Shield } from "lucide-react"
import { Table } from "lucide-react"
import LeagueRoundCountdown from "../LeagueCountdown"
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils"
import { useTabView } from "../../shared/tabs/TabView"

type Props = {
    leagueRound: IFantasyLeagueRound,
    userTeam: FantasyLeagueTeamWithAthletes
}

export default function UserRoundOverviewCard({ leagueRound, userTeam }: Props) {

    const { navigate } = useTabView();
    const isLocked = isLeagueRoundLocked(leagueRound);

    const handleViewTeam = () => {
        navigate('my-team');
    }

    const handleViewStandings = () => {
        navigate('standings');
    }

    return (
        <div>
            <BlueGradientCard className="p-4 flex flex-col gap-4 w-full" >

                <div className="flex flex-row w-full items-center justify-between" >
                    <div>
                        <h3 className="font-bold text-xl" >{userTeam.team.name}</h3>
                        <div className="flex flex-row items-center gap-1" >
                            {isLocked && <Lock className="w-4 h-4" />}
                            <p>{leagueRound.title}</p>
                        </div>
                    </div>

                    <div>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

                {isLocked && Boolean(userTeam.rank) && <div className="flex flex-row items-center justify-center gap-6" >
                    <div className="flex flex-col items-center justify-center " >
                        <p className="font-bold text-4xl" >{userTeam.overall_score || '0'}</p>
                        <p className="text-xs" >Round Score</p>
                    </div>

                    <div className="flex flex-col items-center justify-center " >
                        <p className="font-bold text-4xl" >{userTeam.rank || '-'}</p>
                        <p className="text-xs" >Rank</p>
                    </div>
                </div>}

                {!isLocked && (
                    <LeagueRoundCountdown 
                        leagueRound={leagueRound}
                    />
                )}

                <div className="flex flex-row items-center justify-center gap-2" >
                    <TranslucentButton onClick={handleViewTeam} >
                        <Shield className='w-4 h-4' />
                        View Team
                    </TranslucentButton>

                    <TranslucentButton onClick={handleViewStandings} >
                        <Table className='w-4 h-4' />
                        Standings
                    </TranslucentButton>
                </div>

            </BlueGradientCard>
        </div>
    )
}

type NoTeamProps = {
    leagueRound: IFantasyLeagueRound
}

export function NoTeamRoundOverviewCard({ leagueRound }: NoTeamProps) {

    const hasLocked = isLeagueRoundLocked(leagueRound);
    const { navigate } = useTabView();


    const handlePickTeam = () => {
        navigate('my-team');
    }

    const handleViewStandings = () => {
        navigate('standings');
    }

    return (
        <div>
            <BlueGradientCard className="p-4 flex flex-col gap-4 w-full" >

                <div className="flex flex-row w-full items-center justify-between" >
                    <div className="flex flex-row items-center gap-2" >
                        <Lock />
                        <h3 className="font-bold text-xl" >{leagueRound.title}</h3>
                    </div>

                </div>

                {!hasLocked && <div className="flex flex-col gap-3" >
                    <p>You haven't picked a team yet</p>

                    <LeagueRoundCountdown leagueRound={leagueRound} />
                </div>}

                {hasLocked && <div>
                    <p>Whoops! The gates just closed and you didn't set a team this round. Don't worry — you'll be back on the next round.</p>
                </div>}

                {!hasLocked && <div className="flex flex-row items-center justify-center gap-2" >
                    <TranslucentButton
                        onClick={handlePickTeam}
                    >
                        {/* <Shield className='w-4 h-4' /> */}
                        Pick Team
                        <ArrowRight className="w-4 h-4" />
                    </TranslucentButton>
                </div>}

                {hasLocked && <div className="flex flex-row items-center justify-center gap-2" >
                    <TranslucentButton
                        onClick={handleViewStandings}
                    >
                        {/* <Shield className='w-4 h-4' /> */}
                        View Standings
                        <ArrowRight className="w-4 h-4" />
                    </TranslucentButton>
                </div>}
            </BlueGradientCard>
        </div>
    )
}

