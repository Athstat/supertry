import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import BlueGradientCard from '../../shared/BlueGradientCard';
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
      <BlueGradientCard className='p-4 dark:border-none flex flex-col gap-4' >
        
        <div className='flex flex-row items-center justify-between' >
          <div className='flex flex-row items-center gap-2' >
            <Trophy />
            <p className='font-bold' >{league.title}</p>
          </div>

          <div className='bg-white w-6 h-6 flex flex-col items-center justify-center rounded-md' >
            <Globe className=' text-blue-500 w-5 h-5' />
          </div>
        </div>

        <div className='flex flex-row items-start justify-between' >
          <div>
            <p className={twMerge(
              'font-bold text-lg'
            )} >Rank #103</p>
            <p className='text-sm' >1041 points</p>
          </div>
          
          <div className='flex flex-col items-end justify-end' >
            <div className='flex flex-row items-center gap-1' >
              <p className='font-bold text-lg' >Top 1%</p>
              <Flame className='w-5 text-blue-100 h-5' />
            </div>
            <p className='text-sm' >Out of 894</p>
          </div>
        </div>

        <div className='pt-2 flex-row flex items-center justify-center gap-2' >
            <p className='text-sm' >Show More</p>
            <ArrowRight className='w-4 h-4' />
        </div>
      </BlueGradientCard>
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
