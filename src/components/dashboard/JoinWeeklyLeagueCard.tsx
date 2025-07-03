import { Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { leagueService } from '../../services/leagueService';
import { activeLeaguesFilter } from '../../utils/leaguesUtils';
import { differenceInDays } from 'date-fns';

const JoinWeeklyLeagueCard = () => {
  const navigate = useNavigate();

  // Fetch all leagues
  const { data: leagues, isLoading } = useFetch('all-leagues', null, leagueService.getAllLeagues);

  // Get the next active league
  const activeLeagues = activeLeaguesFilter(leagues || []);
  const nextLeague = activeLeagues[0];

  // Calculate time left until league starts
  const getTimeLeft = () => {
    if (!nextLeague?.join_deadline) return 'No leagues available';

    const today = new Date();
    const deadline = new Date(nextLeague.join_deadline);
    const daysDiff = differenceInDays(deadline, today);

    if (daysDiff < 0) return 'League has started';
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return '1 day left';
    return `${daysDiff} days left`;
  };

  // Get participant count
  const getParticipantCount = () => {
    if (!nextLeague) return '0 joined';
    return `${nextLeague.participants_count || 0} joined`;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-blue-200 rounded mb-1"></div>
            <div className="h-4 bg-blue-200 rounded mb-4"></div>
            <div className="flex gap-4 mb-4">
              <div className="h-4 bg-blue-200 rounded w-20"></div>
              <div className="h-4 bg-blue-200 rounded w-24"></div>
            </div>
            <div className="h-12 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-1">Weekly Rugby Fantasy Leagues</h2>
        <p className="text-sm text-blue-100 mb-4">
          Create your dream team and compete in weekly leagues
        </p>

        <div className="flex flex-wrap gap-4 mb-4">
          {/* Joined count */}
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-200" />
            <span className="text-sm font-medium">{getParticipantCount()}</span>
          </div>

          {/* Time left */}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-200" />
            <span className="text-sm font-medium">{getTimeLeft()}</span>
          </div>
        </div>

        <button
          className="w-full bg-white text-primary-800 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={() => navigate('/leagues')}
        >
          Join A Weekly League →
        </button>
      </div>
    </div>
  );
};

export default JoinWeeklyLeagueCard;

type BannerProps = {
  link?: string
}

export function HeroImageBanner({link = "/images/africa_banner.jpg"} : BannerProps) {
  return (
    <div className="w-full overflow-clip bg-slate-100 dark:border-slate-700 rounded-xl relative">
      <img
        src={link}
        alt="Africa Cup Banner"
        className="w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 py-4 flex flex-col items-start">
        <h3
          className="text-white text-lg font-bold drop-shadow-xl mb-2"
          style={{
        textShadow:
          '0 4px 24px #000, 0 2px 8px #000, 0 1px 0 #000, 2px 2px 8px #000, -2px 2px 8px #000'
          }}
        >
        </h3>
      </div>
    </div>
  )
}