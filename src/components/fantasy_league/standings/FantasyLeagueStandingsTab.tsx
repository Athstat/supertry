import { EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { isGuestUser } from '../../../utils/deviceId/deviceIdUtils';
import LeagueStandingsTable from './LeagueStandingsTable';
import ClaimAccountNoticeCard from '../../auth/guest/ClaimAccountNoticeCard';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useLeagueRoundStandingsFilter } from '../../../hooks/fantasy/useLeagueRoundStandingsFilter';
import PrimaryButton from '../../ui/buttons/PrimaryButton';
import LeagueStandingsFilter from './StandingsFilter';
import { LeagueRoundCountdown2 } from '../LeagueCountdown';
import RoundedCard from '../../ui/cards/RoundedCard';


/** Renders fantasy league group standings */
export function FantasyLeagueStandingsTab() {

  const { userMemberRecord, sortedRounds, currentRound } = useFantasyLeagueGroup();

  const { authUser } = useAuth();
  const isGuest = isGuestUser(authUser);

  const { selectedRound, currentOption, setRoundFilterId } = useLeagueRoundStandingsFilter();

  return (
    <div className="flex flex-col gap-6 pb-32">

      {userMemberRecord && <div className='px-4' >
        <ClaimAccountNoticeCard reasonNum={2} />
      </div>}

      {currentRound && (
        <RoundedCard className='p-2 mx-4' >
          <LeagueRoundCountdown2 leagueRound={currentRound} />
        </RoundedCard>
      )}

      <LeagueStandingsFilter
        currentRound={currentOption}
        leagueRounds={sortedRounds}
        onChange={setRoundFilterId}
      />

      <div className="relative px-2">
        <div className={`${isGuest ? 'blur-[10px] pointer-events-none select-none' : ''}`}>
          <LeagueStandingsTable
            round={selectedRound}
          />
        </div>

        {isGuest && (
          <ClaimAccontCard />
        )}
      </div>

    </div>
  );
}

function ClaimAccontCard() {

  const navigate = useNavigate();

  const handleClickClaim = () => {
    navigate('/profile');
  }

  return (
    <div className="absolute inset-0 z-10 flex justify-center h-40 top-20">
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-6 flex flex-col items-center gap-3 text-center mx-4">
        <EyeOff className="w-10 h-10 text-slate-700 dark:text-slate-300" />
        <p className="font-medium">Claim your account to view scores</p>

        <PrimaryButton onClick={handleClickClaim} >Claim Account</PrimaryButton>
      </div>
    </div>
  )
}