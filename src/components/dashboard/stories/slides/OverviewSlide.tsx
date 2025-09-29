import { IFixture } from "../../../../types/games";
import { MapPin, Trophy, Calendar } from "lucide-react";

interface OverviewSlideProps {
  game: IFixture;
}

export default function OverviewSlide({ game }: OverviewSlideProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreDisplay = () => {
    if (game.game_status === 'completed' && game.team_score !== undefined && game.opposition_score !== undefined) {
      return `${game.team_score} - ${game.opposition_score}`;
    }
    return formatDate(game.kickoff_time);
  };

  return (
    <div className="h-full flex flex-col justify-center px-6 bg-gradient-to-b from-gray-800 to-gray-900">
      
      {/* Team logos and names */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Home team */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-3 bg-gray-700 rounded-full flex items-center justify-center">
              {game.team?.on_dark_image_url || game.team?.image_url ? (
                <img 
                  src={game.team.on_dark_image_url || game.team.image_url}
                  alt={game.team.athstat_name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-400">
                  {game.team?.athstat_abbreviation || 'TM'}
                </span>
              )}
            </div>
            <div className="text-sm font-semibold text-center max-w-20">
              {game.team?.athstat_name || 'Team'}
            </div>
          </div>

          {/* VS and score */}
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-gray-400 mb-2">VS</div>
            <div className="text-xl font-bold">
              {getScoreDisplay()}
            </div>
            {game.game_status && (
              <div className="text-xs text-gray-400 mt-1 capitalize">
                {game.game_status.replace('_', ' ')}
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-3 bg-gray-700 rounded-full flex items-center justify-center">
              {game.opposition_team?.on_dark_image_url || game.opposition_team?.image_url ? (
                <img 
                  src={game.opposition_team.on_dark_image_url || game.opposition_team.image_url}
                  alt={game.opposition_team.athstat_name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-400">
                  {game.opposition_team?.athstat_abbreviation || 'OPP'}
                </span>
              )}
            </div>
            <div className="text-sm font-semibold text-center max-w-20">
              {game.opposition_team?.athstat_name || 'Opposition'}
            </div>
          </div>
        </div>
      </div>

      {/* Match details */}
      <div className="space-y-4">
        
        {/* Competition */}
        {game.competition_name && (
          <div className="flex items-center gap-3 bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <Trophy size={18} className="text-yellow-400" />
            <div>
              <div className="text-xs text-gray-400">Competition</div>
              <div className="text-sm font-medium">{game.competition_name}</div>
            </div>
          </div>
        )}

        {/* Venue */}
        {game.venue && (
          <div className="flex items-center gap-3 bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <MapPin size={18} className="text-green-400" />
            <div>
              <div className="text-xs text-gray-400">Venue</div>
              <div className="text-sm font-medium">{game.venue}</div>
              {game.location && (
                <div className="text-xs text-gray-400">{game.location}</div>
              )}
            </div>
          </div>
        )}

        {/* Kickoff time */}
        {game.kickoff_time && (
          <div className="flex items-center gap-3 bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <Calendar size={18} className="text-blue-400" />
            <div>
              <div className="text-xs text-gray-400">Kickoff Time</div>
              <div className="text-sm font-medium">{formatDate(game.kickoff_time)}</div>
            </div>
          </div>
        )}

        {/* Extra info */}
        {game.extra_info && (
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Match Info</div>
            <div className="text-sm">{game.extra_info}</div>
          </div>
        )}

        {/* Round info */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Round</div>
          <div className="text-sm font-medium">Round {game.round}</div>
        </div>
      </div>
    </div>
  );
}
