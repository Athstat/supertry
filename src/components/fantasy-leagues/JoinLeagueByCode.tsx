import { AlertCircle } from 'lucide-react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { useQueryState } from '../../hooks/useQueryState';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import NoContentCard from '../shared/NoContentMessage';
import SecondaryText from '../shared/SecondaryText';
import { FantasyLeagueGroupCard } from './league_card_small/FantasyLeagueGroupCard';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { useJoinLeague } from '../../hooks/leagues/useJoinLeague';
import { Toast } from '../ui/Toast';

type JoinLeagueByCodeProps = {
}

export default function JoinLeagueByCode({}: JoinLeagueByCodeProps) {

  const [code, setCode] = useQueryState('code');

  const isCodeValid = code && code?.length >= 6

  const fetchKey = code ? swrFetchKeys.getLeaguesByEntryCode(code) : null;
  const { data: leagues, isLoading: loadingLeagues, error } = useSWR(fetchKey, () => fantasyLeagueGroupsService.getLeagueByEntryCode(code ?? ""));


  return (
    <div className="flex flex-col gap-4">

      <form className="space-y-3 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
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

  const { isLoading, error, handleJoinLeague: joinLeague, clearError } = useJoinLeague();

  const handleJoinLeague = () => {
    joinLeague(league, `/league/${league.id}`);
  }

  return (
    <div className='gap-2 flex flex-col' >
      <FantasyLeagueGroupCard
        leagueGroup={league}
        onClick={handleJoinLeague}
      />

      <PrimaryButton
        isLoading={isLoading}
        onClick={handleJoinLeague}
        disabled={isLoading}
      >
        Join {league.title}
      </PrimaryButton>

      <Toast
        message={error ?? ""}
        type="error"
        isVisible={error !== undefined}
        onClose={clearError}
        duration={3000}
      />
    </div>
  )

}