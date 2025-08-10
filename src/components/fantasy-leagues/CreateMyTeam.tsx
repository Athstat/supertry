import { useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { Player } from '../../types/player';
import { Position } from '../../types/position';
import PlayerSelectionModal from '../team-creation/PlayerSelectionModal';

export default function CreateMyTeam() {
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, Player>>({});
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const positions = [
    { name: 'Front Row', position_class: 'front-row' },
    { name: 'Second Row', position_class: 'second-row' },
    { name: 'Back Row', position_class: 'back-row' },
    { name: 'Halfback', position_class: 'half-back' },
    { name: 'Back', position_class: 'back' },
    { name: 'Super Sub', position_class: 'super-sub', isSpecial: true },
  ];

  const toPosition = (
    p: { name: string; position_class: string; isSpecial?: boolean },
    index: number
  ): Position => ({
    id: p.position_class || String(index),
    name: p.name,
    shortName: p.name.slice(0, 2).toUpperCase(),
    x: '0',
    y: '0',
    positionClass: p.position_class,
    isSpecial: Boolean(p.isSpecial),
  });

  return (
    <div className="w-full py-4">
      {/* Top stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Selected
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {Object.keys(selectedPlayers).length}/6
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Budget
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {240 - Object.values(selectedPlayers).reduce((sum, p) => sum + p.price, 0)}/240
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-3">
        <PrimaryButton disabled className="w-full">
          Save
        </PrimaryButton>
      </div>

      {/* 2x3 grid of position slots */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {positions.map((p, index) => (
          <button
            key={p.position_class}
            onClick={() => {
              const pos = toPosition(p, index);
              setActivePosition(pos);
              setIsModalOpen(true);
            }}
            className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl">+</span>
              <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{p.name}</span>
            </div>
          </button>
        ))}
      </div>

      {isModalOpen && activePosition && (
        <PlayerSelectionModal
          visible={isModalOpen}
          selectedPosition={activePosition}
          players={[]}
          remainingBudget={
            240 - Object.values(selectedPlayers).reduce((sum, p) => sum + (p.price || 0), 0)
          }
          selectedPlayers={Object.values(selectedPlayers).map(p => ({ tracking_id: p.id }))}
          handlePlayerSelect={rugbyPlayer => {
            const mapped: Player = {
              id: rugbyPlayer.tracking_id || rugbyPlayer.id || Math.random().toString(),
              name: rugbyPlayer.player_name || 'Unknown Player',
              team: rugbyPlayer.team_name || 'Unknown Team',
              position: activePosition.name,
              price: rugbyPlayer.price || 0,
              points: rugbyPlayer.power_rank_rating || 0,
              image_url: rugbyPlayer.image_url,
              power_rank_rating: rugbyPlayer.power_rank_rating,
            };
            setSelectedPlayers(prev => ({ ...prev, [activePosition.name]: mapped }));
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
          roundId={0}
        />
      )}
    </div>
  );
}
