import { useCallback, useMemo, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';

import { useNavigate } from 'react-router-dom';
import PlayerProfileModal from '../player/PlayerProfileModal';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { Check, Info, Loader } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { isGuestUserAtom } from '../../state/authUser.atoms';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';
import NoContentCard from '../shared/NoContentMessage';
import { useTabView } from '../shared/tabs/TabView';

import PlayerPickerV2 from '../player-picker/PlayerPickerV2';
import { useCreateFantasyTeam } from '../../hooks/fantasy/useCreateFantasyTeam';
import { useSubmitTeam } from '../../hooks/fantasy/useSubmitTeam';
import { useFantasyLeagueTeam } from './my-team/FantasyLeagueTeamProvider';
import MyTeamViewHeader from './my-team/MyTeamViewHeader';
import { TeamFormation3D } from '../team/TeamFormation';
import TeamBenchDrawer from './my-team/TeamBenchDrawer';
import { useHideBottomNavBar } from '../../hooks/navigation/useNavigationBars';


export default function CreateMyTeam() {

  const { leagueRound, swapState, budgetRemaining, swapPlayer, completeSwap, cancelSwap } = useCreateFantasyTeam();

  useHideBottomNavBar();

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showClaimAccountModal, setShowClaimAccountModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileModalPlayer, setProfileModalPlayer] = useState<IFantasyTeamAthlete>();

  const handleSuccess = useCallback(() => {
    setShowSuccessModal(true);
  }, [setShowSuccessModal])

  const { isSaving } = useSubmitTeam(handleSuccess);

  const { navigate: tabNavigate } = useTabView();

  const isGuestAccount = useAtomValue(isGuestUserAtom);

  const excludePlayers = useMemo(() => {
    return swapPlayer ? [swapPlayer] : []
  }, [swapPlayer])

  const onClosePickerModal = () => {
    cancelSwap();
  }

  const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

  const handleGoToStandings = () => {
    tabNavigate('standings');
  };

  const handleClosePlayerProfile = () => {
    setProfileModalPlayer(undefined);
    setShowProfileModal(false);
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (isGuestAccount) {
      setShowClaimAccountModal(true);
    }

    // else if (onViewTeam) {
    //   onViewTeam();
    // }
  }

  const handleCancelClaimAccount = () => {
    setShowClaimAccountModal(false);
  }

  const handleCloseClaimAccountModal = () => {
    setShowClaimAccountModal(false);
  }

  const handlePlayerClick = (player: IFantasyTeamAthlete) => {
    setProfileModalPlayer(player);
    setShowProfileModal(true);
  }


  if (!leagueRound) return;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <NoContentCard message="Whoops! Round has been locked, you can't pick your team now" />

        <PrimaryButton onClick={handleGoToStandings} className="w-fit">
          View Standings
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">


      <MyTeamViewHeader />

      <div className='mt-6 relative' >
        <TeamFormation3D
          onPlayerClick={handlePlayerClick}
        />
        <TeamBenchDrawer
        />
      </div>



      {<PlayerPickerV2
        isOpen={swapState.open}
        positionPool={swapState.position?.positionClass ?? undefined}
        remainingBudget={budgetRemaining}
        excludePlayers={excludePlayers}
        onSelectPlayer={completeSwap}
        onClose={onClosePickerModal}
        targetLeagueRound={leagueRound}
      />}


      {/* Player profile modal */}
      {profileModalPlayer && (
        <PlayerProfileModal
          player={profileModalPlayer}
          isOpen={showProfileModal}
          onClose={handleClosePlayerProfile}
        />
      )}

      {/* Loading Modal */}
      {isSaving && !showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-primary-500 dark:text-primary-400">
                <Loader className="w-10 h-10 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Joining the Scrum...</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please wait while we save your team
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          onContinue={handleCloseSuccessModal}
        />
      )}

      {/* Claim/Complete Account Modal */}
      {showClaimAccountModal && (
        <ClaimAccountModal
          onCancel={handleCancelClaimAccount}
          onClose={handleCloseClaimAccountModal}
        />
      )}
    </div>
  );
}


type SuccessModalProps = {
  onContinue?: () => void
}

function SuccessModal({ onContinue }: SuccessModalProps) {

  const { leagueRound } = useFantasyLeagueTeam();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your team has been successfully submitted
            {leagueRound ? ` to ${leagueRound.title}` : ''}
          </p>
          <PrimaryButton
            className="w-full"
            onClick={onContinue}
          >
            Let's Go!
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

type ClaimAccountModalProps = {
  onCancel?: () => void,
  onClose?: () => void
}

function ClaimAccountModal({ onCancel, onClose }: ClaimAccountModalProps) {

  const navigate = useNavigate();

  const handleTakeAction = () => {

    if (onClose) {
      onClose();
    }

    navigate('/profile');
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Complete Your Account</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Claim your account to secure your team, and manage your profile and notifications
          </p>
          <div className="flex flex-col gap-2">
            <PrimaryButton
              className="w-full rounded-lg py-2"
              onClick={handleTakeAction}
            >
              Go to Profile
            </PrimaryButton>
            <PrimaryButton
              className="w-full rounded-lg py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              onClick={onCancel}
            >
              Maybe later
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}