import { useEffect } from "react"
import { IProAthlete } from "../../types/athletes"
import { IFantasyLeagueTeam, FantasyLeagueTeamWithAthletes } from "../../types/fantasyLeague"
import PlayerPointsBreakdownView from "./PlayerPointsBreakdownView"
import { athleteAnalytics } from "../../services/analytics/athleteAnalytics"
import DialogModal from "../ui/modals/DialogModal"
import { ISeasonRound } from "../../types/fantasy/fantasySeason"

type Props = {
  athlete: IProAthlete,
  team: IFantasyLeagueTeam | FantasyLeagueTeamWithAthletes,
  round?: ISeasonRound,
  onClose?: () => void,
  isOpen?: boolean,
  multiplier?: number,
  multiplierDescription?: string,
}

/** Renders a points breakdown modal */
export default function PointsBreakdownModal({ athlete, team, onClose, isOpen, multiplier, multiplierDescription, round }: Props) {


  useEffect(() => {

    athleteAnalytics.trackPointsBreakdownViewed(
      athlete.tracking_id,
      round?.season || '',
      round?.round_number ?? 0
    );

  }, [round, athlete]);

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
        multiplier={multiplier}
        multiplierDesc={multiplierDescription}
      />

    </DialogModal>
  )
}
