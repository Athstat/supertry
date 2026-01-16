import { IProAthlete } from '../../../types/athletes';
import { formatPosition } from '../../../utils/athletes/athleteUtils';
import { DollarSign } from 'lucide-react';

type Props = {
  player: IProAthlete;
};

/** Renders a premium hero card for the player profile */
export default function PlayerHeroCard({ player }: Props) {
  // Get the appropriate player image based on theme
  const playerImage = player.on_dark_image_url || player.image_url;
  const teamLogo = player.team?.image_url;
  const rating = player.power_rank_rating || 0;
  const price = player.price || 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black shadow-2xl">
      {/* Frosted glass overlay */}
      <div className="absolute inset-0 bg-white/5 dark:bg-white/5 backdrop-blur-xl" />

      {/* Team logo watermark */}
      {teamLogo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img src={teamLogo} alt="Team watermark" className="w-64 h-64 object-contain" />
        </div>
      )}

      {/* Content container */}
      <div className="relative p-6 flex flex-col items-center">
        {/* Top badges row */}
        <div className="w-full flex justify-between items-start mb-4">
          {/* Price badge */}
          {price > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-md ring-1 ring-green-500/30 shadow-lg shadow-green-500/20">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-white">{price}</span>
            </div>
          )}

          {/* Rating badge */}
          {rating > 0 && (
            <div className="px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-md ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/20">
              <span className="text-3xl font-bold text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Player image */}
        {playerImage && (
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-2xl" />
            <img
              src={playerImage}
              alt={player.player_name}
              className="w-48 h-48 object-contain transition-all duration-500 ease-out group-hover:scale-105 group-hover:drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))',
              }}
            />
          </div>
        )}

        {/* Player name and position */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">{player.player_name}</h2>
          {player.position && (
            <p className="text-lg text-slate-300 font-medium">{formatPosition(player.position)}</p>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
