import React from "react";
import { Player } from "../../types/team";

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
            <PlayerButton
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Second Row - Left Side */}
        <div className="flex justify-start -translate-x-10 -translate-y-10">
          {positionGroups["Second Row"].map((player) => (
            <PlayerButton
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Back Row - Center Left */}
        <div className="flex justify-center -translate-x-10 -translate-y-20">
          {positionGroups["Back Row"].map((player) => (
            <PlayerButton
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Halfback - Center Right */}
        <div className="flex justify-center translate-x-10 -translate-y-20">
          {positionGroups["Halfback"].map((player) => (
            <PlayerButton
              key={player.id}
              player={player}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </div>

        {/* Back - Right Side */}
        <div className="flex justify-end -translate-y-20">
          {positionGroups["Back"].map((player) => (
            <PlayerButton
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

function PlayerButton({
  player,
  onClick,
}: {
  player: Player;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center transition-transform hover:scale-105"
    >
      <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-800 flex items-center justify-center shadow-lg mb-1 overflow-hidden border-2 border-white/50">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src =
              "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
          }}
        />
      </div>
      <span className="text-xs font-medium text-white group-hover:text-yellow-300 transition-colors">
        {player.name}
      </span>
      <span className="text-xs font-medium text-white group-hover:text-yellow-300 transition-colors">
        {player.position}
      </span>
      <span className="text-xs text-white/80 group-hover:text-yellow-300/80 transition-colors">
        {player.points} pts
      </span>
    </button>
  );
}
