import { Player } from "../../types/team";
import RugbyPitch from "../shared/RugbyPitch";
import { AthleteFantasyCard } from "./TeamPlayerCard";

interface TeamFormationProps {
  players: Player[];
  formation: string;
  onPlayerClick: (player: Player) => void;
}

export function TeamFormation({ players, onPlayerClick }: TeamFormationProps) {

  const positionGroups = {
    "Front Row": players.filter(
      (p) => p.position_class === "front-row" && p.is_starting
    ),
    "Second Row": players.filter(
      (p) => p.position_class === "second-row" && p.is_starting
    ),
    "Back Row": players.filter(
      (p) => p.position_class === "back-row" && p.is_starting
    ),
    Halfback: players.filter(
      (p) => p.position_class === "half-back" && p.is_starting
    ),
    Back: players.filter((p) => p.position_class === "back" && p.is_starting),
  };


  return (
    <div className="relative h-[650px] lg:h-[650px] bg-green-700 rounded-2xl overflow-hidden">
      <RugbyPitch />

      <div className="absolute inset-0 flex flex-row flex-wrap items-center justify-center gap-2 p-6 lg:px-[10%]">
        {/* Front Row - Top */}
        {positionGroups["Front Row"].map(
          (player) => (
            (
              <AthleteFantasyCard
                key={player.id}
                player={player}
                onClick={() => onPlayerClick(player)}
                className="md:w-44 md:h-56 w-32 h-40"
              />
            )
          )
        )}

        {/* Second Row - Left Side */}
        {positionGroups["Second Row"].map((player) => (
          <AthleteFantasyCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}

        {/* Back Row - Center Left */}
        {positionGroups["Back Row"].map((player) => (
          <AthleteFantasyCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}

        {positionGroups["Halfback"].map((player) => (
          <AthleteFantasyCard
            key={player.id}
            player={player}
            onClick={() => onPlayerClick(player)}
            className="md:w-44 md:h-56 w-32 h-40"
          />
        ))}

        {/* Back - Right Side */}
        {positionGroups["Back"].map((player) => (
          <AthleteFantasyCard
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
