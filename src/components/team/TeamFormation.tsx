import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IFantasyLeagueTeamSlot } from '../../types/fantasyLeagueTeam';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { useMyTeamView } from '../fantasy-leagues/my-team/MyTeamStateProvider';
import { RugbyPitch3D } from '../shared/RugbyPitch';

interface TeamFormationProps {
  players: IFantasyLeagueTeamSlot[];
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  round: IFantasyLeagueRound
}

/** Renders a 3 Dimensional-looking pitch view */
export function TeamFormation3D({ players: slots, onPlayerClick, round }: TeamFormationProps) {

  const {navigate: navigateView} = useMyTeamView();

  const handleGoToEdit = () => {
    navigateView("edit");
  }

  return (
    <div className="relative w-full flex flex-col justify-center">
      
      <RugbyPitch3D />

    </div>
  );
}
