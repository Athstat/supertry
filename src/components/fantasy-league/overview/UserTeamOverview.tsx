import { useState } from "react"
import { FantasyLeagueTeamWithAthletes, IDetailedFantasyAthlete, IFantasyLeagueRound } from "../../../types/fantasyLeague"
import { PlayerGameCard } from "../../player/PlayerGameCard"
import PlayerPointsBreakdownView from "../team-modal/points_breakdown/PlayerPointsBreakdownView"
import { IProAthlete } from "../../../types/athletes"
import DialogModal from "../../shared/DialogModal"

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
        <div>

            <div></div>
            {currentRound && userTeam && (
                <div className="flex flex-row items-center gap-2 overflow-y-auto no-scrollbar" >
                    {userTeam.athletes.map((a) => {
                        return <PlayerItem
                            key={a.athlete.tracking_id}
                            onClick={() => onSelectPlayer(a)} athlete={a}
                        />
                    })}
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
        <div onClick={onClick} className="flex flex-col items-center justify-center gap-2" >
            <PlayerGameCard player={athlete.athlete} />
            <p>{athlete.score || '-'}</p>
        </div>
    )
}
