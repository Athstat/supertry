import { Player } from "../../types/team";
import { TeamPlayerCard } from "./TeamPlayerCard";

interface TeamFormationProps {
  players: Player[];
  formation: string;
  onPlayerClick: (player: Player) => void;
}

export function TeamFormation({ players, onPlayerClick }: TeamFormationProps) {
  // Group players by position
  const positionGroups = {
    "Front Row": players.filter(
      (p) => p.position === "front-row" && !p.isSubstitute
    ),
    "Second Row": players.filter(
      (p) => p.position === "second-row" && !p.isSubstitute
    ),
    "Back Row": players.filter(
      (p) => p.position === "back-row" && !p.isSubstitute
    ),
    Halfback: players.filter(
      (p) => p.position === "half-back" && !p.isSubstitute
    ),
    Back: players.filter((p) => p.position === "back" && !p.isSubstitute),
  };

  

  return (
    <div className="relative h-[550px] lg:h-[650px] bg-green-700 rounded-2xl overflow-hidden">


      <div className="grid grid-cols-1 overflow-clip items-center" >
        <div className="flex flex-1 border-b-4 border-white/10 bg-green-800 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/0 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/10 bg-green-800 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/0 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/10 bg-green-800 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/0 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/10 bg-green-800 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/0 h-20" ></div>
        <div className="flex flex-1 border-b-4 border-white/10 bg-green-800 h-20" ></div>
      </div>

      <div className="absolute inset-0 flex flex-row flex-wrap items-center justify-center gap-2 p-6 lg:px-[10%]">

        {/* Front Row - Top */}
        {positionGroups["Front Row"].map((player) => (
          <TeamPlayerCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}

        {/* Second Row - Left Side */}
        {positionGroups["Second Row"].map((player) => (
          <TeamPlayerCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}

        {/* Back Row - Center Left */}
        {positionGroups["Back Row"].map((player) => (
          <TeamPlayerCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}

        {positionGroups["Halfback"].map((player) => (
          <TeamPlayerCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}

        {/* Back - Right Side */}
        {positionGroups["Back"].map((player) => (
          <TeamPlayerCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}
      </div>
    </div>
  );
}