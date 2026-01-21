import { useEffect } from "react"
import { IProAthlete } from "../../types/athletes"
import { IFantasyLeagueTeam, FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from "../../types/fantasyLeague"
import PlayerPointsBreakdownView from "./PlayerPointsBreakdownView"
import { athleteAnalytics } from "../../services/analytics/athleteAnalytics"
import DialogModal from "../ui/modals/DialogModal"
import { useFantasyTeam } from "../../hooks/fantasy/useFantasyTeam"

type Props = {
    athlete: IProAthlete,
    team: IFantasyLeagueTeam | FantasyLeagueTeamWithAthletes,
    round?: IFantasyLeagueRound,
    onClose?: () => void,
    isOpen?: boolean
}

/** Renders a points breakdown modal */
export default function PointsBreakdownModal({athlete, team, onClose, isOpen} : Props) {
  
  const {leagueRound: round} = useFantasyTeam();

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
        />

    </DialogModal>
  )
}
