import { useEffect, useState } from 'react';
import { EditableTeamSlotItem } from './EditableTeamSlotItem';
import { useFantasyLeagueTeam } from '../../hooks/fantasy/useFantasyTeam';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { IGamesLeagueConfig } from '../../types/leagueConfig';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';
import PlayerProfileModal from '../player/PlayerProfileModal';
import WarningCard from '../shared/WarningCard';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  onEditChange?: (isEditing: boolean) => void;
};

// TODO: Delete Component
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
