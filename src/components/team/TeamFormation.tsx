import { Player } from "../../types/team";
import { TeamPlayerCard } from "./TeamPlayerCard";

interface TeamFormationProps {
  players: Player[];
  formation: string;
  onPlayerClick: (player: Player) => void;
}

export function TeamFormation({ players, onPlayerClick }: TeamFormationProps) {
  console.log("players", players);
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
    <div className="relative h-[580px] bg-gradient-to-b from-green-600 to-green-700 rounded-2xl overflow-hidden p-8">
      <div className="absolute inset-0 flex flex-col justify-between py-10 pl-16 pr-8">
        {/* Front Row - Top */}
        <div className="flex justify-center -translate-x-10">
          {positionGroups["Front Row"].map((player) => (
            <TeamPlayerCard
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Second Row - Left Side */}
        <div className="flex justify-start -translate-x-10 -translate-y-10">
          {positionGroups["Second Row"].map((player) => (
            <TeamPlayerCard
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Back Row - Center Left */}
        <div className="flex justify-center -translate-x-10 -translate-y-20">
          {positionGroups["Back Row"].map((player) => (
            <TeamPlayerCard
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Halfback - Center Right */}
        <div className="flex justify-center translate-x-10 -translate-y-20">
          {positionGroups["Halfback"].map((player) => (
            <TeamPlayerCard
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Back - Right Side */}
        <div className="flex justify-end -translate-y-20">
          {positionGroups["Back"].map((player) => (
            <TeamPlayerCard
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}