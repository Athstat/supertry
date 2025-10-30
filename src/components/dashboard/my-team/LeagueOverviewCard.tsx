import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useAuth } from '../../../contexts/AuthContext';
import BlueGradientCard from '../../shared/BlueGradientCard';
import { ArrowRight, Trophy, Globe } from 'lucide-react';
import RoundedCard from '../../shared/RoundedCard';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useMemberRankDetail } from '../../../hooks/fantasy/useMemberRankingDetail';
import FantasyLeagueGroupDataProvider from '../../fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { LeagueRoundCountdown2 } from '../../fantasy-league/LeagueCountdown';

type Props = {
  league: FantasyLeagueGroup;
};

/** Renders a league overview card */
export default function SmallLeagueOverviewCard({ league }: Props) {
  return (
    <Content league={league} />
  );
}

function Content({ league }: Props) {

  const { authUser } = useAuth();
  const shouldFetchRanking = Boolean(league.id) && Boolean(authUser?.kc_id);
  const { rankingDetail, isLoading } = useMemberRankDetail(league.id, authUser?.kc_id ?? '', shouldFetchRanking);

  const navigate = useNavigate();

  const handleShowMore = () => {
    navigate(`/league/${league.id}`);
  }

  if (isLoading) {
    return (
      <RoundedCard className='p-4 h-[170px] animate-pulse bg-slate-200/70 dark:bg-slate-800/70 border-none flex flex-col gap-4' >
      </RoundedCard>
    )
  }

  if (!rankingDetail) {
    return;
  }

  const { rank_percentile, overall_rank, total_points } = rankingDetail;

  return (
    <div className='flex flex-col gap-2' >
      <BlueGradientCard className='p-4 h-[170px] cursor-pointer dark:border-none flex flex-col gap-4' >

        <div className='flex flex-row items-center justify-between' >
          <div className='flex flex-row items-center gap-2' >
            <Trophy className='w-4 h-4' />
            <p className='font-bold' >{league.title}</p>
          </div>

          <div className='' >
            <Globe className=' w-6 h-6' />
          </div>
        </div>

        <div className='flex flex-row items-start justify-between' >
          <div>
            <p className={twMerge(
              'font-bold text-lg'
            )} >
              {overall_rank ? `Rank #${overall_rank}` : "-"}
            </p>

            <p className='text-sm text-white/80' >{total_points ? `${total_points} points` : "0 points"}</p>
          </div>

          <div className='flex flex-col items-end justify-end' >
            <div className='flex flex-row items-center gap-1' >
              <p className='font-bold text-lg' >Top {rank_percentile < 1 ? 1 : Math.floor(rank_percentile)}%</p>
              {rank_percentile <= 5 && (<Flame className='w-5 text-yellow-500 h-5' />)}
            </div>
            <p className='text-sm text-white/80' >Out of {rankingDetail.total_users}</p>
          </div>
        </div>

        <div onClick={handleShowMore} className='pt-2 flex-row flex items-center hover:text-primary-500 justify-center gap-2' >
          <p className='text-sm ' >View League</p>
          <ArrowRight className='w-4 h-4' />
        </div>

      </BlueGradientCard>
      <FantasyLeagueGroupDataProvider
        leagueId={league.id}
        loadingFallback={<CountDownLoadingSkeleton />}
      >
        <CountDown />
      </FantasyLeagueGroupDataProvider>
    </div>
  )
}

function CountDown() {

  const { currentRound } = useFantasyLeagueGroup();

  if (!currentRound) return;

  return (
    <BlueGradientCard>
      <LeagueRoundCountdown2 leagueRound={currentRound} />
    </BlueGradientCard>
  );
}

function CountDownLoadingSkeleton() {

  const { currentRound } = useFantasyLeagueGroup();

  if (!currentRound) return;

  return (
    <>
      <RoundedCard className='h-[30px] animate-pulse border-none' >
      </RoundedCard>
    </>
  );
}