import { IFixture } from "../../../../types/games";
import { Users } from "lucide-react";

interface LineupsSlideProps {
  game: IFixture;
}

// Mock lineup data for demonstration
const mockLineup = {
  home: [
    { name: "J. Williams", position: "Prop", number: 1 },
    { name: "M. Johnson", position: "Hooker", number: 2 },
    { name: "T. Brown", position: "Prop", number: 3 },
    { name: "L. Davis", position: "Lock", number: 4 },
    { name: "R. Wilson", position: "Lock", number: 5 },
    { name: "S. Garcia", position: "Flanker", number: 6 },
    { name: "D. Miller", position: "Flanker", number: 7 },
    { name: "C. Anderson", position: "No. 8", number: 8 },
    { name: "A. Thomas", position: "Scrum-half", number: 9 },
    { name: "K. Jackson", position: "Fly-half", number: 10 },
    { name: "P. White", position: "Wing", number: 11 },
    { name: "O. Harris", position: "Centre", number: 12 },
    { name: "N. Martin", position: "Centre", number: 13 },
    { name: "B. Thompson", position: "Wing", number: 14 },
    { name: "E. Garcia", position: "Fullback", number: 15 }
  ],
  away: [
    { name: "F. Martinez", position: "Prop", number: 1 },
    { name: "H. Robinson", position: "Hooker", number: 2 },
    { name: "G. Clark", position: "Prop", number: 3 },
    { name: "I. Rodriguez", position: "Lock", number: 4 },
    { name: "J. Lewis", position: "Lock", number: 5 },
    { name: "K. Lee", position: "Flanker", number: 6 },
    { name: "L. Walker", position: "Flanker", number: 7 },
    { name: "M. Hall", position: "No. 8", number: 8 },
    { name: "N. Allen", position: "Scrum-half", number: 9 },
    { name: "O. Young", position: "Fly-half", number: 10 },
    { name: "P. Hernandez", position: "Wing", number: 11 },
    { name: "Q. King", position: "Centre", number: 12 },
    { name: "R. Wright", position: "Centre", number: 13 },
    { name: "S. Lopez", position: "Wing", number: 14 },
    { name: "T. Hill", position: "Fullback", number: 15 }
  ]
};

export default function LineupsSlide({ game }: LineupsSlideProps) {
  return (
    <div className="h-full flex flex-col px-4 bg-gradient-to-b from-gray-800 to-gray-900 overflow-y-auto">
      
      {/* Header */}
      <div className="text-center py-4 border-b border-gray-700 mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users size={20} className="text-blue-400" />
          <h2 className="text-lg font-bold">Starting Lineups</h2>
        </div>
        <p className="text-xs text-gray-400">Expected Starting XV</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        
        {/* Home Team */}
        <div className="space-y-3">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center">
              {game.team?.on_dark_image_url || game.team?.image_url ? (
                <img 
                  src={game.team.on_dark_image_url || game.team.image_url}
                  alt={game.team.athstat_name}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-gray-400">
                  {game.team?.athstat_abbreviation || 'H'}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-center">
              {game.team?.athstat_abbreviation || 'Home'}
            </h3>
          </div>
          
          <div className="space-y-1">
            {mockLineup.home.map((player) => (
              <div key={player.number} className="bg-gray-800 bg-opacity-50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {player.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{player.name}</div>
                    <div className="text-xs text-gray-400">{player.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Away Team */}
        <div className="space-y-3">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center">
              {game.opposition_team?.on_dark_image_url || game.opposition_team?.image_url ? (
                <img 
                  src={game.opposition_team.on_dark_image_url || game.opposition_team.image_url}
                  alt={game.opposition_team.athstat_name}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-gray-400">
                  {game.opposition_team?.athstat_abbreviation || 'A'}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-center">
              {game.opposition_team?.athstat_abbreviation || 'Away'}
            </h3>
          </div>
          
          <div className="space-y-1">
            {mockLineup.away.map((player) => (
              <div key={player.number} className="bg-gray-800 bg-opacity-50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {player.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{player.name}</div>
                    <div className="text-xs text-gray-400">{player.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
