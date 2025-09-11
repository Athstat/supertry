import { useState } from "react"
import { FantasyLeagueTeamWithAthletes, IDetailedFantasyAthlete, IFantasyLeagueRound } from "../../../types/fantasyLeague"
import PlayerPointsBreakdownView from "../team-modal/points_breakdown/PlayerPointsBreakdownView"
import { IProAthlete } from "../../../types/athletes"
import DialogModal from "../../shared/DialogModal"
import TeamJersey from "../../player/TeamJersey"

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
    onClick?: () => void
}

function PlayerItem({ athlete, onClick }: PlayerItemProps) {
    return (
        <div onClick={onClick} className="flex border dark:border-slate-700 min-w-[90px] max-w-[90px] h-[100px] rounded-xl overflow-clip p-0 flex-col" >
            
            <div className="h-[60%] w-full flex flex-col items-center justify-center" >
                <TeamJersey
                    teamId={athlete.athlete.team_id}
                    className="max-h-10 min-h-10 object-contain"
                    hideFade
                />
            </div>

            <div className="text-center bg-white dark:bg-slate-800/60 truncate border-t dark:border-slate-700 h-[40%] pt-1 w-full flex  flex-col items-center justify-center " >
                <p className="text-[10px] text-center truncate" >{athlete.athlete.athstat_lastname}</p>
                <p className="text-[10px]" >{athlete.score ? Math.floor(athlete.score) : '-'}</p>
            </div>
        </div>
    )
}
