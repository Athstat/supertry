import { Fragment } from "react/jsx-runtime";
import { FANTASY_TEAM_POSITIONS } from "../../../types/constants";
import { AthleteWithTrackingId, IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { PlayerGameCard } from "../../player/PlayerGameCard";
import { useEffect, useMemo, useState } from "react";
import { IFantasyLeagueRound, IFantasyLeagueTeam } from "../../../types/fantasyLeague";
import { fantasyTeamService } from "../../../services/fantasyTeamService";
import { seasonService } from "../../../services/seasonsService";
import { IProAthlete } from "../../../types/athletes";
import { Position } from "../../../types/position";
import { IGamesLeagueConfig } from "../../../types/leagueConfig";
import { Loader, Check } from "lucide-react";
import PlayerProfileModal from "../../player/PlayerProfileModal";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import PlayerSelectionModal from "../../team-creation/PlayerSelectionModal";

type Props = {
    leagueRound?: IFantasyLeagueRound;
    leagueConfig?: IGamesLeagueConfig;
    team: IFantasyLeagueTeam;
    onTeamUpdated: () => Promise<void>;
    onEditChange?: (isEditing: boolean) => void;
}
/** Renders My Team Edit Grid */
export default function MyTeamEditView({ team, leagueConfig, leagueRound, onEditChange, onTeamUpdated }: Props) {

    const [playerModalPlayer, setPlayerModalPlayer] = useState<IFantasyTeamAthlete>();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const positions = FANTASY_TEAM_POSITIONS;

    const handlePlayerClick = (player: IFantasyTeamAthlete) => {
        setPlayerModalPlayer(player);
        setShowProfileModal(true);
    }

    const handleClosePlayerProfileModal = () => {
        setShowProfileModal(false);
        setPlayerModalPlayer(undefined);
    }

    const [captainAthleteId, setCaptainAthleteId] = useState<string | undefined>(
        () => team.athletes?.find(a => a.is_captain)?.athlete_id
    );


    const [players, setPlayers] = useState<IProAthlete[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | undefined>(undefined);
    const [swapState, setSwapState] = useState<{
        open: boolean;
        slot: number | null;
        position?: Position | null;
    }>({ open: false, slot: null, position: null });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const totalSpent = team.athletes.reduce((sum, player) => sum + (player.price || 0), 0);
    const budgetRemaining = (leagueConfig?.team_budget || 0) - totalSpent;


    const [editableAthletesBySlot, setEditableAthletesBySlot] = useState<
        Record<number, IFantasyTeamAthlete | undefined>
    >(() => {
        const map: Record<number, IFantasyTeamAthlete | undefined> = {};
        (team.athletes || []).forEach(a => {
            if (a?.slot != null) map[a.slot] = { ...a } as IFantasyTeamAthlete;
        });
        return map;
    });

    const [swapPlayer, setSwapPlayer] = useState<IProAthlete | undefined | IFantasyTeamAthlete>(undefined);

    useEffect(() => {
        // When team changes from parent, reset editable state
        const map: Record<number, IFantasyTeamAthlete | undefined> = {};
        (team.athletes || []).forEach(a => {
            if (a?.slot != null) map[a.slot] = { ...a } as IFantasyTeamAthlete;
        });
        setEditableAthletesBySlot(map);
        setCaptainAthleteId(team.athletes?.find(a => a.is_captain)?.athlete_id);
    }, [team.athletes]);

    const athletesBySlot = editableAthletesBySlot;

    // Original (non-edited) snapshot from props for diff detection
    const originalAthletesBySlot = useMemo(() => {
        const map: Record<number, IFantasyTeamAthlete | undefined> = {};
        (team.athletes || []).forEach(a => {
            if (a?.slot != null) map[a.slot] = a as IFantasyTeamAthlete;
        });
        return map;
    }, [team.athletes]);

    const originalCaptainAthleteId = useMemo(
        () => team.athletes?.find(a => a.is_captain)?.athlete_id,
        [team.athletes]
    );

    const isEditing = useMemo(() => {
        // Captain changed?
        if (captainAthleteId !== originalCaptainAthleteId) return true;
        // Any slot player changed?
        for (let i = 1; i <= positions.length; i++) {
            const orig = originalAthletesBySlot[i]?.athlete_id || undefined;
            const curr = editableAthletesBySlot[i]?.athlete_id || undefined;
            if (orig !== curr) return true;
        }
        return false;
    }, [
        captainAthleteId,
        originalCaptainAthleteId,
        originalAthletesBySlot,
        editableAthletesBySlot,
        positions.length,
    ]);

    // Notify parent when edit state changes
    useEffect(() => {
        if (onEditChange) onEditChange(isEditing);
    }, [isEditing, onEditChange]);

    // Cancel: revert to original team state
    const handleCancelEdits = () => {
        // rebuild from original team props
        const map: Record<number, IFantasyTeamAthlete | undefined> = {};
        (team.athletes || []).forEach(a => {
            if (a?.slot != null) map[a.slot] = { ...(a as IFantasyTeamAthlete) };
        });
        setEditableAthletesBySlot(map);
        setCaptainAthleteId(originalCaptainAthleteId);
    };

    // Load season players for swapping
    useEffect(() => {
        const loadAthletes = async () => {
            if (!leagueRound) return;
            try {
                const athletes = (await seasonService.getSeasonAthletes(leagueRound.season_id))
                    .filter(a => {
                        return a.power_rank_rating && a.power_rank_rating > 50;
                    })
                    .sort((a, b) => {
                        return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0);
                    });

                setPlayers(athletes);
            } catch (e) {
                console.error('Failed to load athletes for season', e);
            }
        };
        loadAthletes();
    }, [leagueRound]);

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

    const buildPayloadAndSave = async () => {
        if (!leagueRound?.is_open) return;
        try {
            setIsSaving(true);
            setSaveError(undefined);
            const athletesPayload = Object.entries(editableAthletesBySlot)
                .map(([slotStr, a]) => {
                    const slot = Number(slotStr);
                    if (!a) return undefined;
                    return {
                        athlete_id: a.athlete_id,
                        slot,
                        purchase_price: (a as any).price || a.purchase_price || 0,
                        is_starting: slot !== 6,
                        is_captain: a.athlete_id === captainAthleteId,
                    };
                })
                .filter(Boolean) as {
                    athlete_id: string;
                    slot: number;
                    purchase_price: number;
                    is_starting: boolean;
                    is_captain: boolean;
                }[];

            console.log('athletesPayload: ', athletesPayload);

            await fantasyTeamService.updateFantasyTeam(team.id, { athletes: athletesPayload });
            await onTeamUpdated();
            setShowSuccessModal(true);
        } catch (e) {
            console.error('Failed to update fantasy team', e);
            setSaveError('Failed to update team. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

    return (

        <Fragment>

            {isEditing && (
                <div className="mt-3 flex-col gap-2  relative z-[50]">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleCancelEdits}
                            disabled={isSaving}
                            className="w-1/2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 px-4 py-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <PrimaryButton
                            className="w-1/2"
                            disabled={isSaving || !leagueRound?.is_open}
                            onClick={buildPayloadAndSave}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </PrimaryButton>
                    </div>
                    {saveError && (
                        <div className="mt-2 text-sm text-red-600 dark:text-red-400">{saveError}</div>
                    )}
                </div>
            )}

            <div className="mt-4 grid gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))]">
                {positions.map((p, index) => {
                    const slot = index + 1;
                    const athlete = athletesBySlot[slot];
                    return (
                        <div key={athlete?.tracking_id} className="flex flex-col w-full min-w-0 ">
                            <div className="w-full min-w-0 h-60 flex items-center justify-center bg-transparent">
                                {athlete ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PlayerGameCard
                                            player={athlete}
                                            className="mx-auto"
                                            blockGlow
                                            onClick={() => {
                                                handlePlayerClick(athlete);
                                            }}
                                            detailsClassName="pl-6 pr-6 pb-7"
                                            priceClassName="top-12 left-6"
                                            teamLogoClassName="top-4 right-2"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full rounded-lg bg-white/40 dark:bg-gray-900/20">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{p.name}</span>
                                    </div>
                                )}
                            </div>

                            {athlete && (
                                <div className="mt-4 flex flex-col gap-2 z-50">
                                    <button
                                        className={`${captainAthleteId === athlete.athlete_id
                                            ? 'text-xs w-full rounded-lg py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                                            : 'text-xs w-full rounded-lg py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                                            }`}
                                        onClick={() => {
                                            if (captainAthleteId !== athlete.athlete_id)
                                                setCaptainAthleteId(athlete.athlete_id);
                                        }}
                                        disabled={isSaving || captainAthleteId === athlete.athlete_id}
                                    >
                                        {captainAthleteId === athlete.athlete_id ? 'Captain' : 'Make Captain'}
                                    </button>

                                    <button
                                        className="text-xs w-full rounded-lg py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 disabled:opacity-60"
                                        onClick={() => {
                                            const pos = toPosition(positions[index], index);
                                            setSwapState({ open: true, slot, position: pos });
                                            setSwapPlayer(athlete);
                                        }}
                                        disabled={isSaving || !leagueRound?.is_open}
                                    >
                                        Swap
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
                    isOpen={showProfileModal}
                    onClose={handleClosePlayerProfileModal}
                />
            )}

            {/* Swap selection modal */}
            {swapState.open && swapState.slot != null && swapState.position && (
                <PlayerSelectionModal
                    visible={swapState.open}
                    selectedPosition={swapState.position}
                    players={players.filter(p => p.tracking_id !== swapPlayer?.tracking_id)}
                    remainingBudget={budgetRemaining + (swapPlayer?.price || 0)}
                    selectedPlayers={Object.entries(editableAthletesBySlot)
                        .filter(([s]) => Number(s) !== swapState.slot)
                        .map(
                            ([, a]) => ({ tracking_id: a?.tracking_id || a?.athlete_id }) as AthleteWithTrackingId
                        )}
                    handlePlayerSelect={(athlete: IProAthlete) => {
                        setEditableAthletesBySlot(prev => {
                            const updated = { ...prev };
                            const slot = swapState.slot!;
                            const current = updated[slot];
                            updated[slot] = {
                                ...(current || ({} as IFantasyTeamAthlete)),
                                athlete_id: athlete.tracking_id,
                                tracking_id: athlete.tracking_id,
                                player_name: athlete.player_name || 'Unknown Player',
                                image_url: athlete.image_url,
                                position: athlete.position || current?.position || '',
                                price: athlete.price || 0,
                                points: athlete.power_rank_rating || 0,
                                team: athlete.team?.athstat_name || 'Unknown Team',
                                form: athlete.form || 'NEUTRAL',
                                power_rank_rating: athlete.power_rank_rating,
                                team_logo: athlete.team?.image_url,
                                slot,
                                is_captain: (current?.athlete_id || '') === captainAthleteId,
                            } as unknown as IFantasyTeamAthlete;
                            return updated;
                        });
                        setSwapState({ open: false, slot: null, position: null });
                    }}
                    onClose={() => setSwapState({ open: false, slot: null, position: null })}
                    roundId={parseInt(String(leagueRound?.id || '0'))}
                    roundStart={leagueRound?.start_round ?? undefined}
                    roundEnd={leagueRound?.end_round ?? undefined}
                    leagueId={String(leagueRound?.official_league_id || '')}
                />
            )}

            {/* Loading Modal */}
            {isSaving && !showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-primary-500 dark:text-primary-400">
                                <Loader className="w-10 h-10 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Saving</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Please wait while we save your team...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                                <Check size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Updated!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Your team changes have been saved for {leagueRound?.title}
                            </p>
                            <PrimaryButton
                                className="w-full"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    if (onTeamUpdated) {
                                        onTeamUpdated();
                                    }
                                }}
                            >
                                Great!
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}

        </Fragment>
    )
}
