import React from "react";
import { motion, useTransform } from "framer-motion";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { PlayerCard } from "./PlayerCard";
import { EmptyState } from "./EmptyState";

interface PlayerListProps {
  filteredPlayers: RugbyPlayer[];
  loading: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  scrollY: any; // motion value
  handleSelectPlayer: (player: RugbyPlayer) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  filteredPlayers,
  loading,
  containerRef,
  scrollY,
  handleSelectPlayer,
}) => {
  // Create opacity transform from scroll position
  const gradientOpacity = useTransform(scrollY, [0, 30], [1, 0.4]);

  return (
    <>
      {/* Gradient fade for depth effect - appears after header */}
      <motion.div
        className="h-[3px] z-10 pointer-events-none relative w-full"
        style={{
          background:
            "linear-gradient(to bottom, var(--gradient-shadow-color), transparent)",
          opacity: gradientOpacity,
        }}
      />

      {/* Scrollable content area with cards */}
      <div
        ref={containerRef}
        className="overflow-y-auto flex-1 px-2 pt-2 pb-3 scroll-smooth"
      >
        {filteredPlayers.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPlayers.map((player, index) => {
              // Create a unique layout ID for this player card
              const cardLayoutId = `player-card-${
                player.id || player.tracking_id || Math.random()
              }`;

              return (
                <motion.div
                  key={player.id || player.tracking_id || Math.random()}
                >
                  <PlayerCard
                    player={player}
                    handleSelectPlayer={handleSelectPlayer}
                    isFirstCard={index === 0} // First card in the list should always glint
                    layoutId={cardLayoutId}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
        {/* Add some empty space at the bottom for better scrolling experience */}
        <div className="h-4" />
      </div>
    </>
  );
};
