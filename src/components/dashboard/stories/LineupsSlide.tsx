import { IRosterItem } from '../../../types/games';
import { IProTeam } from '../../../types/team';
import TeamLogo from '../../team/TeamLogo';

type LineupsSlideProps = {
  homeTeam?: IProTeam;
  awayTeam?: IProTeam;
  homePlayers: IRosterItem[];
  awayPlayers: IRosterItem[];
};

export default function LineupsSlide({ homeTeam, awayTeam, homePlayers, awayPlayers }: LineupsSlideProps) {
  // Sort players by position for better lineup display
  const sortedHomePlayers = [...homePlayers].sort((a, b) => (a.player_number || 99) - (b.player_number || 99));
  const sortedAwayPlayers = [...awayPlayers].sort((a, b) => (a.player_number || 99) - (b.player_number || 99));

  const PlayerCard = ({ player }: { player: IRosterItem }) => (
    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 min-w-[80px]">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 mb-1">
        {player.player_number || '?'}
      </div>
      <span className="text-xs font-medium text-center leading-tight">
        {player.athlete?.athstat_lastname || 'Unknown'}
      </span>
      <span className="text-xs text-gray-500">
        {player.position}
      </span>
      {player.is_captain && (
        <span className="text-xs bg-yellow-200 text-yellow-800 px-1 rounded mt-1">C</span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Starting Lineups</h2>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Home Team Lineup */}
        <div className="flex flex-col">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TeamLogo url={homeTeam?.image_url} className="w-8 h-8" />
            <h3 className="font-semibold text-gray-800">{homeTeam?.athstat_name}</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2 justify-items-center">
            {sortedHomePlayers.slice(0, 15).map((player, index) => (
              <PlayerCard key={`home-${player.athlete?.tracking_id || index}`} player={player} />
            ))}
          </div>
          
          {/* Substitutes */}
          {sortedHomePlayers.filter(p => p.is_substitute).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Substitutes</h4>
              <div className="flex gap-2 flex-wrap">
                {sortedHomePlayers.filter(p => p.is_substitute).map((player, index) => (
                  <PlayerCard key={`home-sub-${player.athlete?.tracking_id || index}`} player={player} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Away Team Lineup */}
        <div className="flex flex-col">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TeamLogo url={awayTeam?.image_url} className="w-8 h-8" />
            <h3 className="font-semibold text-gray-800">{awayTeam?.athstat_name}</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2 justify-items-center">
            {sortedAwayPlayers.slice(0, 15).map((player, index) => (
              <PlayerCard key={`away-${player.athlete?.tracking_id || index}`} player={player} />
            ))}
          </div>
          
          {/* Substitutes */}
          {sortedAwayPlayers.filter(p => p.is_substitute).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Substitutes</h4>
              <div className="flex gap-2 flex-wrap">
                {sortedAwayPlayers.filter(p => p.is_substitute).map((player, index) => (
                  <PlayerCard key={`away-sub-${player.athlete?.tracking_id || index}`} player={player} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
