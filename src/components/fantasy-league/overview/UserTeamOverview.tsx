import { useState } from "react"
import { FantasyLeagueTeamWithAthletes, IDetailedFantasyAthlete, IFantasyLeagueRound } from "../../../types/fantasyLeague"
import PlayerPointsBreakdownView from "../team-modal/points_breakdown/PlayerPointsBreakdownView"
import { IProAthlete } from "../../../types/athletes"
import DialogModal from "../../shared/DialogModal"
import TeamJersey from "../../player/TeamJersey"
import { usePlayerSquadReport } from "../../../hooks/fantasy/usePlayerSquadReport"
import { twMerge } from "tailwind-merge"
import SecondaryText from "../../shared/SecondaryText"

type Props = {
    userTeam: FantasyLeagueTeamWithAthletes,
    leagueRound: IFantasyLeagueRound
}

export default function UserTeamOverview({ userTeam, leagueRound: currentRound }: Props) {

    const [selectPlayer, setSelectPlayer] = useState<IProAthlete>();

    const onClosePointsBreakdown = () => {
        setSelectPlayer(undefined);
    }

    const onSelectPlayer = (a: IDetailedFantasyAthlete) => {
        setSelectPlayer(a.athlete);
    }

    console.log("User Team ", userTeam);

    return (
        <div className="flex flex-col gap-4" >

            <div>
                <div>
                    <p className="font-bold" >Squad</p>
                </div>
            </div>
            {currentRound && userTeam && (
                <div className="w-full relative max-h-[200px]rounded-xl" >
                    <div className="flex flex-row items-center gap-2 overflow-y-auto no-scrollbar" >

                        {userTeam.athletes.map((a) => {
                            return <PlayerItem
                                key={a.athlete.tracking_id}
                                onClick={() => onSelectPlayer(a)} athlete={a}
                                team={userTeam}
                            />
                        })}
                    </div>
                </div>
            )}

            {(selectPlayer && userTeam &&
                <DialogModal
                    open={true}
                    onClose={onClosePointsBreakdown}
                >
                    <PlayerPointsBreakdownView
                        athlete={selectPlayer}
                        team={userTeam}
                        round={currentRound}
                        onClose={onClosePointsBreakdown}
                    />
                </DialogModal>
            )}
        </div>
    )
}

type PlayerItemProps = {
    athlete: IDetailedFantasyAthlete,
    onClick?: () => void,
    team: FantasyLeagueTeamWithAthletes
}

function PlayerItem({ athlete, onClick, team }: PlayerItemProps) {

    const { report, reportText, isAvailable, isLoading, notAvailable } = usePlayerSquadReport(team.id, athlete.athlete.tracking_id);

    if (isLoading) {
        return (
            <div
                onClick={onClick}
                className={twMerge(
                    "flex border dark:border-slate-700 min-w-[90px] max-w-[90px] h-[100px] rounded-xl overflow-clip p-0 flex-col",

                )}
            ></div>
        )
    }

    console.log("Team Id ", team.id)

    return (
        <div
            onClick={onClick}
            className={twMerge(
                "flex border cursor-pointer dark:border-slate-700 min-w-[90px] max-w-[90px] h-[100px] rounded-xl overflow-clip p-0 flex-col",
                notAvailable && 'border-yellow-600 dark:border-yellow-900 bg-yellow-100 dark:bg-yellow-600/20 opacity-80'
            )}
        >
            <div className="h-[60%] w-full flex flex-col items-center justify-center" >
                <TeamJersey
                    teamId={athlete.athlete.team_id}
                    className="max-h-10 min-h-10 object-contain"
                    hideFade
                />
            </div>



            <div className={twMerge(
                "text-center bg-white dark:bg-slate-800/60 truncate border-t dark:border-slate-700 h-[40%] pt-1 w-full flex  flex-col items-center justify-center ",
                notAvailable && 'bg-yellow-200 dark:bg-yellow-900/30'
            )} >
                <p className="text-[10px] text-center truncate" >{athlete.athlete.athstat_lastname}</p>
                <SecondaryText
                    className={twMerge(
                        "text-[10px]",
                        notAvailable && 'text-yellow-600 dark:text-yellow-200'
                    )}
                >
                    {athlete.score ? Math.floor(athlete.score) : reportText}
                </SecondaryText>
            </div>
        </div>
    )
}
