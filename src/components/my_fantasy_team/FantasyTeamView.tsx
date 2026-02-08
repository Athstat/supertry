import MyTeamViewHeader from './MyTeamViewHeader';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../types/leagueConfig';
import MyTeamPitch from './MyTeamPitch';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  onBack?: () => void;
  onEditChange?: (isEditing: boolean) => void;
  pitchCN?: string
}

/** Renders a fantasy team view, with editor capabilities */
export default function FantasyTeamView({ pitchCN }: Props) {

  return (
    <div className="w-full h-full">
      <MyTeamViewHeader />

      <MyTeamPitch 
        className={pitchCN}
      />
    </div>
  );
}
