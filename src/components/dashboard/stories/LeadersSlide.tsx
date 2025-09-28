import { IRosterItem } from '../../../types/games';
import { IProTeam } from '../../../types/team';
import { Target, Shield, Zap } from 'lucide-react';

type LeaderType = 'attacking' | 'defensive' | 'kicking';

type LeadersSlideProps = {
  homeTeam?: IProTeam;
  awayTeam?: IProTeam;
  homePlayers: IRosterItem[];
  awayPlayers: IRosterItem[];
  type: LeaderType;
};

const getLeaderConfig = (type: LeaderType) => {
  switch (type) {
    case 'attacking':
      return {
        title: 'Attacking Leaders',
        icon: <Zap className="w-5 h-5 text-red-600" />,
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
        stats: ['Tries', 'Metres Gained', 'Line Breaks', 'Offloads', 'Defenders Beaten']
      };
    case 'defensive':
      return {
        title: 'Defensive Leaders',
        icon: <Shield className="w-5 h-5 text-blue-600" />,
        color: 'blue',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        stats: ['Tackles Made', 'Tackle Success %', 'Turnovers Won', 'Penalties Won', 'Lineout Steals']
      };
    case 'kicking':
      return {
        title: 'Kicking Leaders',
        icon: <Target className="w-5 h-5 text-green-600" />,
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        stats: ['Conversion %', 'Penalty Goal %', 'Kicks from Hand', 'Territory Gained', 'Drop Goals']
      };
  }
};

type PlayerWithBestStat = IRosterItem & {
  bestStat: string;
  statValue: number;
};

export default function LeadersSlide({ homeTeam, awayTeam, homePlayers, awayPlayers, type }: LeadersSlideProps) {
  const config = getLeaderConfig(type);
  
  // Mock data - in real implementation, this would come from stats API
  const getRandomStat = () => Math.floor(Math.random() * 100) + 1;
  const getRandomPercentage = () => Math.floor(Math.random() * 40) + 60; // 60-100%
  
  const getStatLeaders = (players: IRosterItem[]): PlayerWithBestStat[] => {
    const allPlayers = players.filter(p => !p.is_substitute);
    const statLeaders: PlayerWithBestStat[] = [];
    
    // For each stat category, find the best player
    config.stats.forEach(stat => {
      // Get all players with a random value for this stat
      const playersWithThisStat = allPlayers.map(player => {
        let statValue: number;
        if (stat.includes('%')) {
          statValue = getRandomPercentage();
        } else if (stat.includes('Metres') || stat.includes('Territory')) {
          statValue = Math.floor(Math.random() * 500) + 100;
        } else {
          statValue = getRandomStat();
        }
        
        return {
          ...player,
          bestStat: stat,
          statValue
        };
      });
      
      // Find the player with the highest value for this stat
      const leader = playersWithThisStat.reduce((best, current) => 
        current.statValue > best.statValue ? current : best
      );
      
      statLeaders.push(leader);
    });
    
    return statLeaders;
  };

  // Combine both teams' players and get stat leaders
  const allPlayers = [...homePlayers, ...awayPlayers];
  const playersWithStats = getStatLeaders(allPlayers);

  const PlayerCard = ({ player }: { player: PlayerWithBestStat }) => (
    <div className={`${config.bgColor} rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
      {/* Player Image */}
      <div className="flex items-center justify-center mb-3">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {player.athlete?.image_url ? (
            <img 
              src={player.athlete.image_url} 
              alt={player.athlete.player_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-gray-600">
              {player.athlete?.athstat_firstname?.[0]}{player.athlete?.athstat_lastname?.[0]}
            </span>
          )}
        </div>
      </div>

      {/* Player Name */}
      <div className="text-center mb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight">
          {player.athlete?.athstat_firstname} {player.athlete?.athstat_lastname}
        </h3>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-1">
          <span>#{player.player_number}</span>
          <span>•</span>
          <span>{player.position}</span>
        </div>
      </div>

      {/* Best Stat */}
      <div className="text-center">
        <div className={`text-2xl font-bold ${config.textColor} mb-1`}>
          {player.statValue}{player.bestStat.includes('%') ? '%' : ''}
        </div>
        <div className="text-xs text-gray-600 font-medium">
          {player.bestStat}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {config.icon}
          <h2 className="text-xl font-bold text-gray-800">{config.title}</h2>
        </div>
        <p className="text-sm text-gray-600">
          Top performers from {homeTeam?.athstat_name} vs {awayTeam?.athstat_name}
        </p>
      </div>

      {/* Player Cards Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playersWithStats.map((player, index) => (
            <PlayerCard 
              key={`player-${player.athlete?.tracking_id || index}`} 
              player={player} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
