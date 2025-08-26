import { IProAthlete } from "../../../../types/athletes"
import { IFantasyLeagueTeam, FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from "../../../../types/fantasyLeague"
import { IFantasyTeamAthlete } from "../../../../types/fantasyTeamAthlete"
import DialogModal from "../../../shared/DialogModal"
import PlayerPointsBreakdownView from "./PlayerPointsBreakdownView"

type Props = {
    athlete: IProAthlete | IFantasyTeamAthlete,
    team: IFantasyLeagueTeam | FantasyLeagueTeamWithAthletes,
    round: IFantasyLeagueRound,
    onClose?: () => void,
    isOpen?: boolean
}

/** Renders a points breakdown modal */
export default function PointsBreakdownModal({athlete, team, round, onClose, isOpen} : Props) {
  return (
    <DialogModal
        open={isOpen}
        title={athlete.player_name}
        onClose={onClose}
        hw="min-h-[90vh] max-h-[90vh]"
    >

        <PlayerPointsBreakdownView 
            athlete={athlete}
            team={team}
            round={round}
        />

    </DialogModal>
  )
}
