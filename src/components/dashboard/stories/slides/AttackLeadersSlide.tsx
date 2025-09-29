import { IFixture } from "../../../../types/games";
import { Zap, BarChart } from "lucide-react";

interface AttackLeadersSlideProps {
  game: IFixture;
}

// Mock attack stats data
const attackStats = [
  {
    category: "Tries Scored",
    player: {
      name: "Marcus Williams",
      team: "home",
      image: "https://via.placeholder.com/80x80?text=MW",
      value: "3"
    }
  },
  {
    category: "Metres Gained",
    player: {
      name: "Diego Martinez",
      team: "away", 
      image: "https://via.placeholder.com/80x80?text=DM",
      value: "127m"
    }
  },
  {
    category: "Line Breaks",
    player: {
      name: "James Thompson",
      team: "home",
      image: "https://via.placeholder.com/80x80?text=JT",
      value: "5"
    }
  },
  {
    category: "Defenders Beaten",
    player: {
      name: "Carlos Rodriguez",
      team: "away",
      image: "https://via.placeholder.com/80x80?text=CR",
      value: "8"
    }
  },
  {
    category: "Offloads",
    player: {
      name: "Ryan Jackson",
      team: "home",
      image: "https://via.placeholder.com/80x80?text=RJ",
      value: "6"
    }
  }
];

export default function AttackLeadersSlide({ game }: AttackLeadersSlideProps) {
  const getPlayerTeamColor = (team: string) => {
    return team === 'home' ? 'bg-blue-600' : 'bg-red-600';
  };

  const getPlayerTeamName = (team: string) => {
    return team === 'home' 
      ? game.team?.athstat_abbreviation || 'HOME'
      : game.opposition_team?.athstat_abbreviation || 'AWAY';
  };

  return (
    <div className="h-full flex flex-col px-4 bg-gradient-to-b from-gray-800 to-gray-900 overflow-y-auto">
      
      {/* Header */}
      <div className="text-center py-4 border-b border-gray-700 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={20} className="text-orange-400" />
          <h2 className="text-lg font-bold">Attack Leaders</h2>
        </div>
        <p className="text-xs text-gray-400">Top performing attackers</p>
      </div>

      {/* Stats Cards */}
      <div className="flex-1 space-y-4">
        {attackStats.map((stat, index) => (
          <div key={index} className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
            
            {/* Category header */}
            <div className="flex items-center gap-2 mb-3">
              <BarChart size={16} className="text-orange-400" />
              <h3 className="text-sm font-semibold text-gray-300">{stat.category}</h3>
            </div>

            {/* Player card */}
            <div className="flex items-center gap-4">
              
              {/* Player image */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                  <img 
                    src={stat.player.image}
                    alt={stat.player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Team indicator */}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getPlayerTeamColor(stat.player.team)} rounded-full flex items-center justify-center`}>
                  <span className="text-[10px] font-bold text-white">
                    {getPlayerTeamName(stat.player.team).charAt(0)}
                  </span>
                </div>
              </div>

              {/* Player info */}
              <div className="flex-1">
                <div className="text-lg font-bold text-white mb-1">
                  {stat.player.name}
                </div>
                <div className="text-sm text-gray-400">
                  {getPlayerTeamName(stat.player.team)}
                </div>
              </div>

              {/* Stat value */}
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">
                  {stat.player.value}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  {stat.category.split(' ')[0]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center py-4 mt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Based on current match performance
        </p>
      </div>
    </div>
  );
}
