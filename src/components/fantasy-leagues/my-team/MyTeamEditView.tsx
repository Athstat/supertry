import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { useEffect, useState } from 'react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import { useFantasyLeagueTeam } from './FantasyLeagueTeamProvider';
import { EditableTeamSlotItem } from './EditableTeamSlotItem';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import WarningCard from '../../shared/WarningCard';
import { fantasyAnalytics } from '../../../services/analytics/fantasyAnalytics';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  team: IFantasyLeagueTeam;
  onEditChange?: (isEditing: boolean) => void;
};
/** Renders My Team Edit Grid */
export default function MyTeamEditView({ leagueRound }: Props) {
  
  const { slots } = useFantasyLeagueTeam();
  const { league } = useFantasyLeagueGroup();

  const {initiateSwap, initateSwapOnEmptySlot } = useFantasyLeagueTeam();

  const [playerModalPlayer, setPlayerModalPlayer] = useState<IFantasyTeamAthlete>();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handlePlayerClick = (player: IFantasyTeamAthlete) => {
    setPlayerModalPlayer(player);
    setShowProfileModal(true);
  };

  const handleClosePlayerProfileModal = () => {
    setShowProfileModal(false);
    setPlayerModalPlayer(undefined);
  };

  const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

  useEffect(() => {
    fantasyAnalytics.trackVisitedEditTeamTab(league?.id, leagueRound?.id);
  }, [league?.id, leagueRound?.id]);


  return (
    <div className='p-4'>
      {isLocked && leagueRound && (
        <WarningCard className="text-sm">
          <p>
            Team selection for <strong>{leagueRound.title}</strong> has been locked. You can no
            longer make changes to your lineup after the deadline has passed
          </p>
        </WarningCard>
      )}

      <div className="mt-4 grid gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))]">
        {slots.map(s => {
          return (
            <EditableTeamSlotItem
              key={s.slotNumber}
              slot={s}
              onPlayerClick={handlePlayerClick}
              onInitiateSwap={initiateSwap}
              onAddPlayerToEmptySlot={initateSwapOnEmptySlot}
            />
          );
        })}
      </div>

      {/* Player profile modal */}
      {playerModalPlayer && (
        <PlayerProfileModal
          player={playerModalPlayer}
          isOpen={showProfileModal}
          onClose={handleClosePlayerProfileModal}
        />
      )}
    </div>
  );
}
