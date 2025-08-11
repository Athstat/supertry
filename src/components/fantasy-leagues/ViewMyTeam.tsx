import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { PlayerGameCard } from '../player/PlayerGameCard';
import { PlayerForm } from '../../types/rugbyPlayer';
import PlayerProfileModal from '../player/PlayerProfileModal';
import { IProAthlete } from '../../types/athletes';

export default function ViewMyTeam({
  leagueRound,
  team,
}: {
  leagueRound?: IFantasyLeagueRound;
  team: IFantasyLeagueTeam;
}) {
  const [captainAthleteId, setCaptainAthleteId] = useState<string | undefined>(() =>
    team.athletes?.find(a => a.is_captain)?.athlete_id
  );
  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete | undefined>(undefined);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  // Stable mapping of 6 slots like in CreateMyTeam
  const positions = [
    { name: 'Front Row', position_class: 'front-row' },
    { name: 'Second Row', position_class: 'second-row' },
    { name: 'Back Row', position_class: 'back-row' },
    { name: 'Halfback', position_class: 'half-back' },
    { name: 'Back', position_class: 'back' },
    { name: 'Super Sub', position_class: 'super-sub', isSpecial: true },
  ];

  const athletesBySlot = useMemo(() => {
    const map: Record<number, IFantasyTeamAthlete | undefined> = {};
    (team.athletes || []).forEach(a => {
      if (a?.slot != null) map[a.slot] = a;
    });
    return map;
  }, [team.athletes]);

  // Minimal mapper to PlayerGameCard shape
  const toIProAthlete = (a: IFantasyTeamAthlete): IProAthlete => ({
    tracking_id: a.tracking_id || a.athlete_id,
    player_name: a.player_name,
    power_rank_rating: a.power_rank_rating || a.total_points || 0,
    image_url: a.image_url,
    position: a.position,
    gender: a.gender || 'M',
    form: ('NEUTRAL' as PlayerForm),
    team_id: String(a.team_id || ''),
    team: {
      athstat_id: '',
      source_id: '',
      athstat_name: a.team_name || '',
      image_url: a.team_logo || a.image_url || '',
      sport: '',
      organization: '',
    },
  });

  const selectedCount = (team.athletes || []).length;

  return (
    <div className="w-full py-4">
      <div className="flex flex-row items-center justify-between mb-5">
        <div className="flex flex-row items-center gap-2" style={{ marginTop: -20 }}>
          <Users />
          <p className="font-bold text-xl">My Team</p>
        </div>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Selected
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {selectedCount}/6
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Round
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {leagueRound?.title || '—'}
          </div>
        </div>
      </div>

      {/* 2x3 grid of slots with player cards */}
      <div className="mt-4 grid gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))]">
        {positions.map((p, index) => {
          const slot = index + 1;
          const athlete = athletesBySlot[slot];
          return (
            <div key={p.position_class} className="flex flex-col w-full min-w-0">
              <div className="w-full min-w-0 aspect-square overflow-hidden p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                {athlete ? (
                  <div className="w-full h-full">
                    <PlayerGameCard
                      player={toIProAthlete(athlete)}
                      className="w-full h-full"
                      blockGlow
                      onClick={() => {
                        const p = toIProAthlete(athlete);
                        setPlayerModalPlayer(p);
                        setShowPlayerModal(true);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full rounded-lg bg-white/40 dark:bg-gray-900/20">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{p.name}</span>
                  </div>
                )}
              </div>

              {athlete && (
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    className={`${
                      captainAthleteId === athlete.athlete_id
                        ? 'text-xs w-full rounded-lg py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                        : 'text-xs w-full rounded-lg py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                    onClick={() => {
                      if (captainAthleteId !== athlete.athlete_id) setCaptainAthleteId(athlete.athlete_id);
                    }}
                    disabled={captainAthleteId === athlete.athlete_id}
                  >
                    {captainAthleteId === athlete.athlete_id ? 'Captain' : 'Make Captain'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
