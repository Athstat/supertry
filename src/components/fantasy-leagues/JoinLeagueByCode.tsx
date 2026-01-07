import { AlertCircle, Check, ChevronRight, Users } from 'lucide-react';
import PrimaryButton from '../ui/buttons/PrimaryButton';
import { useQueryState } from '../../hooks/web/useQueryState';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import NoContentCard from '../ui/typography/NoContentMessage';
import SecondaryText from '../ui/typography/SecondaryText';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { useJoinLeague } from '../../hooks/leagues/useJoinLeague';
import { Toast } from '../ui/Toast';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import WarningCard from '../ui/cards/WarningCard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';


export default function JoinLeagueByCode() {


  const [code, setCode] = useQueryState<string>('code');

  const isCodeValid = code && code?.length >= 6;

  const fetchKey = code ? swrFetchKeys.getLeaguesByEntryCode(code) : null;
  const { data: leagues, isLoading: loadingLeagues, error } = useSWR(fetchKey, () => fantasyLeagueGroupsService.getLeagueByEntryCode(code ?? ""));

  useEffect(() => {
    fantasyAnalytics.trackAttemptedJoinLeagueByCode();
  }, []);

  return (
    <div className="flex flex-col gap-4">

      <form onSubmit={(e) => e.preventDefault()} className="space-y-3 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <label className="block text-md font-bold text-gray-700 dark:text-gray-300 mb-1">
          Enter League Code
        </label>

        <SecondaryText>
          Enter 6 digit entry code
        </SecondaryText>

        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. ABC123"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-center tracking-wider font-mono"
          maxLength={6}
        />

        {error && (
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <PrimaryButton
          type="submit"
          disabled={loadingLeagues || !isCodeValid}
          isLoading={loadingLeagues}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
        >
          Find League
        </PrimaryButton>
      </form>

      {leagues?.length === 0 && code && isCodeValid && (
        <div>

          <NoContentCard
            message={`Oops, we couldn't find any league(s) with the join code '${code}' `}
          />
        </div>
      )}

      {leagues && leagues?.length > 0 && (
        <div className='flex flex-col gap-2' >
          {leagues.map((league) => {
            return <JoinLeagueCard
              league={league}
              key={league.id}
            />
          })}
        </div>
      )}
    </div>
  );
}

type JoinCardProps = {
  league: FantasyLeagueGroup
}

function JoinLeagueCard({ league }: JoinCardProps) {

  return (
    <div className='gap-2 flex flex-col' >
      <JoinFantasyLeagueGroupCard
        leagueGroup={league}
      />
    </div>
  )

}



type Props = {
  leagueGroup: FantasyLeagueGroup,
  onClick?: (league: FantasyLeagueGroup) => void,
  custom?: number
}

/** Renders a fantasy league group card */
function JoinFantasyLeagueGroupCard({ leagueGroup, custom = 0}: Props) {

  const key = swrFetchKeys.getLeagueGroupMembers(leagueGroup.id);
  const { data: members, isLoading: loadingMembers } = useSWR(key, () => fantasyLeagueGroupsService.getGroupMembers(leagueGroup.id));

  const membersCount = members ? members.length : '-';

  const { isLoading, error, handleJoinLeague: joinLeague, clearError } = useJoinLeague();

  const navigate = useNavigate()

  const { authUser } = useAuth();

  const isJoined = (members ?? []).find((m) => {
    return m.user.kc_id === authUser?.kc_id
  }) !== undefined;

  const handleOnClick = () => {

    if (isJoined) {
      navigate(`/league/${leagueGroup.id}/standings`);
    }

  }

  const handleJoinLeague = () => {

    if (isJoined) {
      return;
    }

    joinLeague(leagueGroup, `/league/${leagueGroup.id}/standings`);
  }


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
            delay: custom * 0.1,
          },
        },
      }}
      onClick={handleOnClick}
      className="bg-white dark:bg-gray-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 space-y-2"
      whileHover={{
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300 },
      }}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start">
        <div className="flex-1 flex min-w-0 flex-col gap-2">

          <div className="flex flex-row items-center gap-12" >

            {/* <Trophy /> */}

            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {leagueGroup.title}
            </h3>
          </div>

          <div>
            {leagueGroup.season.name && (
              <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
                {leagueGroup.season.name}
              </p>
            )}
          </div>

        </div>
        <div className="flex items-center gap-2 ml-2">
          {isJoined && (
            <div className="px-2 py-0.5 text-xs rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold flex items-center gap-1">
              <Check size={10} />
              Joined
            </div>
          )}
          {/* {getStatusBadge()} */}
        </div>
      </div>

      {/* Description - Single line with truncation */}
      {leagueGroup.description && (
        <p className="text-sm italic text-gray-600 dark:text-gray-300 truncate">
          {leagueGroup.description}
        </p>
      )}

      {/* Metadata Row - Compressed single line */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">

          {!loadingMembers && <div className="flex text-slate-800 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-xl px-3 py-1 items-center gap-1">
            <Users size={12} />
            <span>{membersCount} Team{membersCount === 1 ? "" : 's'}</span>
          </div>}

          {loadingMembers && (
            <div className="w-6 h-2 rounded-full animate-pulse bg-slate-100 dark:bg-slate-800" >

            </div>
          )}

        </div>

        <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
      </div>

      {/* Join Deadline Countdown */}
      {/* {!isLocked && adjustedDeadline && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <JoinDeadlineCountdown joinDeadline={adjustedDeadline} />
        </div>
      )} */}

      {!isJoined && !loadingMembers && <PrimaryButton
        isLoading={isLoading}
        onClick={handleJoinLeague}
        disabled={isLoading}
        className={isJoined ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700' : ''}
      >
        {isJoined ? `View League` : `Join ${leagueGroup.title}`}
      </PrimaryButton>}

      {isJoined && !loadingMembers && (
        <div>
          <WarningCard className='text-sm py-2 px-3' >
            You are already a member of this fantasy league
          </WarningCard>
        </div>
      )}

      {loadingMembers && (
        <PrimaryButton
          className={isJoined ? 'bg-slate-300 opacity-30 h-10 animate-pulse text-slate-800 border-none border-slate-300 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700' : ''}
        >

        </PrimaryButton>
      )}

      <Toast
        message={error ?? ""}
        type="error"
        isVisible={error !== undefined}
        onClose={clearError}
        duration={3000}
      />
    </motion.div>
  );
}