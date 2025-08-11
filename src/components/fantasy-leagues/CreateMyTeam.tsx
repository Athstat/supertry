import { useEffect, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { Player } from '../../types/player';
import { Position } from '../../types/position';
import PlayerSelectionModal from '../team-creation/PlayerSelectionModal';
import { RugbyPlayer } from '../../types/rugbyPlayer';
import { seasonService } from '../../services/seasonsService';
import { useParams } from 'react-router-dom';
import { PlayerGameCard } from '../player/PlayerGameCard';
import { IProAthlete } from '../../types/athletes';
import PlayerProfileModal from '../player/PlayerProfileModal';

export default function CreateMyTeam() {
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, Player>>({});
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [players, setPlayers] = useState<RugbyPlayer[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete | undefined>(undefined);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const { leagueId } = useParams();

  useEffect(() => {
    const loadAthletes = async () => {
      if (!leagueId) return;
      try {
        //const athletes = await seasonService.getSeasonAthletes(leagueId);
        const athletes = await seasonService.getSeasonAthletes(
          '695fa717-1448-5080-8f6f-64345a714b10'
        );
        console.log('athletes: ', athletes);
        const mapped: RugbyPlayer[] = athletes.map(a => ({
          id: a.tracking_id,
          tracking_id: a.tracking_id,
          player_name: a.player_name,
          team_name: a.team?.athstat_name || 'Unknown Team',
          team_logo: a.team?.image_url || '',
          position_class: a.position_class,
          position: a.position,
          price: a.price ?? 0,
          power_rank_rating: a.power_rank_rating ?? 0,
          image_url: a.image_url,
          team_id: a.team_id,
          form: a.form,
          available: a.available,
          // Required fields in RugbyPlayer
          scoring: 0,
          defence: 0,
          attacking: 0,
        }));
        setPlayers(mapped);
      } catch (e) {
        console.error('Failed to load athletes for season ', leagueId, e);
      }
    };

    loadAthletes();
  }, [leagueId]);

  console.log('players: ', players);

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

  const toIProAthlete = (p: Player): IProAthlete => ({
    tracking_id: p.id,
    player_name: p.name,
    power_rank_rating: p.power_rank_rating,
    image_url: p.image_url,
    position: p.position,
    // Defaults/fallbacks for required fields
    gender: 'M',
    form: 'NEUTRAL',
    team_id: '',
    team: {
      athstat_id: '',
      source_id: '',
      athstat_name: p.team,
      image_url: p.image_url,
      sport: '',
      organization: '',
    },
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
        {positions.map((p, index) => {
          const selected = selectedPlayers[p.name];
          return (
            <div key={p.position_class} className="flex flex-col">
              <button
                onClick={() => {
                  const pos = toPosition(p, index);
                  setActivePosition(pos);
                  if (selected) {
                    setPlayerModalPlayer(toIProAthlete(selected));
                    setShowPlayerModal(true);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 flex items-center justify-center"
              >
                {selected ? (
                  <div className="w-full h-full p-2">
                    <PlayerGameCard
                      player={toIProAthlete(selected)}
                      className="w-full h-full"
                      blockGlow
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl">+</span>
                    <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{p.name}</span>
                  </div>
                )}
              </button>

              {selected && (
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    className="text-xs w-full rounded-lg py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/50"
                    onClick={() => {
                      setSelectedPlayers(prev => {
                        const copy = { ...prev } as Record<string, Player>;
                        delete copy[p.name];
                        return copy;
                      });
                      if (captainId === selected.id) setCaptainId(null);
                    }}
                  >
                    Remove
                  </button>

                  <button
                    className={`${
                      captainId === selected.id
                        ? 'text-xs w-full rounded-lg py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                        : 'text-xs w-full rounded-lg py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                    onClick={() => {
                      if (captainId !== selected.id) setCaptainId(selected.id);
                    }}
                    disabled={captainId === selected.id}
                  >
                    {captainId === selected.id ? 'Captain' : 'Set as Captain'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && activePosition && (
        <PlayerSelectionModal
          visible={isModalOpen}
          selectedPosition={activePosition}
          players={players}
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
          leagueId={leagueId}
        />
      )}

      {/* Player profile modal */}
      {playerModalPlayer && (
        <PlayerProfileModal
          player={playerModalPlayer}
          isOpen={showPlayerModal}
          onClose={() => {
            setPlayerModalPlayer(undefined);
            setShowPlayerModal(false);
          }}
        />
      )}
    </div>
  );
}
