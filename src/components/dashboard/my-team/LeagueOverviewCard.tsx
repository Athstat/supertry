import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { ArrowRight, Globe, Info, Lock, Plus, Trophy } from 'lucide-react';
import RoundedCard from '../../shared/RoundedCard';
import SecondaryText from '../../shared/SecondaryText';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import WarningCard from '../../shared/WarningCard';
import { Flame } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

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

  return (
    <div>
      <RoundedCard className='p-4 dark:border-none flex flex-col gap-4' >
        
        <div className='flex flex-row items-center justify-between' >
          <div className='flex flex-row items-center gap-2' >
            <Trophy className='w-4 h-4' />
            <p className='font-semobold' >{league.title}</p>
          </div>

          <div className='' >
            <Globe className=' w-6 h-6' />
          </div>
        </div>

        <div className='flex flex-row items-start justify-between' >
          <div>
            <p className={twMerge(
              'font-bold text-lg'
            )} >Rank #103</p>
            <SecondaryText className='text-sm' >1041 points</SecondaryText>
          </div>
          
          <div className='flex flex-col items-end justify-end' >
            <div className='flex flex-row items-center gap-1' >
              <p className='font-bold text-lg' >Top 1%</p>
              <Flame className='w-5 text-yellow-500 h-5' />
            </div>
            <SecondaryText className='text-sm' >Out of 894</SecondaryText>
          </div>
        </div>

        <div className='pt-2 flex-row flex items-center justify-center gap-2' >
            <SecondaryText className='text-sm' >Show More</SecondaryText>
            <ArrowRight className='w-4 h-4' />
        </div>
      </RoundedCard>
    </div>
  );
}

function NotTeamCreated() {
  const navigate = useNavigate();
  const { currentRound } = useFantasyLeagueGroup();

  if (!currentRound) return;

  const goToCreateTeam = () => {
    navigate(`/league/${currentRound.fantasy_league_group_id}?journey=team-creation`);
  };

  return (
    <WarningCard className="px-4 py-2 text-center gap-4  flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <Info className="w-4 h-4" />
        <p className="text-xs text-left">You haven't picked a team for {currentRound.title} yet</p>
      </div>

      <PrimaryButton onClick={goToCreateTeam} className="w-fit text-xs px-2">
        {/* <p className='text-[10px]' >Pick Team</p> */}
        <Plus className="w-4 h-4" />
      </PrimaryButton>
    </WarningCard>
  );
}

function NotTeamCreatedLeagueLocked() {
  const navigate = useNavigate();
  const { currentRound } = useFantasyLeagueGroup();

  if (!currentRound) return;

  const goToCreateTeam = () => {
    navigate(`/league/${currentRound.fantasy_league_group_id}?journey=team-creation`);
  };

  return (
    <RoundedCard className="p-6 text-center h-[200px] gap-4 border-dotted border-4 flex flex-col items-center justify-center">
      <SecondaryText className="text-base">
        You can't pick a team because, round '{currentRound.title}', has been locked{' '}
      </SecondaryText>

      <PrimaryButton disabled={true} onClick={goToCreateTeam} className="w-fit px-6 py-2">
        <p>Pick Team</p>
        <Lock className="w-4 h-4" />
      </PrimaryButton>
    </RoundedCard>
  );
}
