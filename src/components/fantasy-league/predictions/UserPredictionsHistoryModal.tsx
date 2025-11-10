/** Modal to display a user's prediction history for a league */

import useSWR from 'swr';
import { leaguePredictionsService } from '../../../services/fantasy/leaguePredictionsService';
import DialogModal from '../../shared/DialogModal';
import { LoadingState } from '../../ui/LoadingState';
import FixtureCard from '../../fixtures/FixtureCard';
import NoContentCard from '../../shared/NoContentMessage';

interface UserPredictionsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  leagueId: string;
  userId: string;
  username: string;
  roundId?: string;
}

export default function UserPredictionsHistoryModal({
  isOpen,
  onClose,
  leagueId,
  userId,
  username,
  roundId,
}: UserPredictionsHistoryModalProps) {
  const { data: predictions, isLoading } = useSWR(
    isOpen ? `league-predictions-history-${leagueId}-${userId}-${roundId}` : null,
    () => leaguePredictionsService.getUserPredictionsHistory(leagueId, userId, roundId)
  );

  return (
    <DialogModal open={isOpen} onClose={onClose} title={`${username}'s Predictions`}>
      <div className="max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : predictions && predictions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {predictions.map(prediction => {
              // Determine border color based on prediction result
              let borderColorClass = 'border-blue-500'; // Default: awaiting result

              if (prediction.game_finished) {
                if (prediction.is_correct) {
                  borderColorClass = 'border-green-500';
                } else {
                  borderColorClass = 'border-red-500';
                }
              }

              const containerClasses = `border-l-4 ${borderColorClass} rounded-xl overflow-hidden`;

              return (
                <div key={prediction.id} className={containerClasses}>
                  <FixtureCard
                    fixture={prediction.game}
                    showLogos
                    showCompetition
                    className="rounded-xl"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <NoContentCard message="No predictions found" />
        )}
      </div>
    </DialogModal>
  );
}
