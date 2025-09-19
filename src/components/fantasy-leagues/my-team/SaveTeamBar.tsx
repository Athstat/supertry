import { Fragment, useMemo, useState } from "react";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useFantasyLeagueTeam } from "./FantasyLeagueTeamProvider";
import { fantasyTeamService } from "../../../services/fantasyTeamService";
import { IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils";
import { Check, Loader } from "lucide-react";
import { Toast } from "../../ui/Toast";

type Props = {
    onTeamUpdated: () => Promise<void>,
    leagueRound: IFantasyLeagueRound
}

/** Renders Save Team Bar */
export default function SaveTeamBar({ onTeamUpdated, leagueRound }: Props) {

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | undefined>(undefined);
    const isLocked = isLeagueRoundLocked(leagueRound);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        changesDetected,
        resetToOriginalTeam,
        isTeamFull, slots, team, teamCaptain
    } = useFantasyLeagueTeam();

    const isEditing = useMemo(() => {
        return changesDetected;
    }, [changesDetected]);

    // Cancel: revert to original team state
    const handleCancelEdits = () => {
        resetToOriginalTeam();
    };


    const buildPayloadAndSave = async () => {
        if (isLocked) return;

        if (!team) return;

        if (!teamCaptain) {
            setSaveError('Ooops! You forgot to set a captain');
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(undefined);
            const athletesPayload = slots
                .filter(s => Boolean(s.athlete))
                .map((s) => {
                    const slot = s.slotNumber;
                    const a = s.athlete;

                    if (!a) return undefined;
                    return {
                        athlete_id: a.athlete_id,
                        slot,
                        purchase_price: s.purchasePrice || (a as any).price || a.purchase_price || 0,
                        is_starting: slot !== 6,
                        is_captain: s.isCaptain,
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

            const newTeam = await fantasyTeamService.updateFantasyTeam(team.id, { athletes: athletesPayload });
            console.log("New Team ", newTeam);
            await onTeamUpdated();
            setIsSaving(false);
            setShowSuccessModal(true);
        } catch (e) {
            console.error('Failed to update fantasy team', e);
            setSaveError('Failed to update team. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Fragment>

            {isEditing && <div className="mt-3 flex-col gap-2  relative z-[50]">
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
                        disabled={isSaving || !leagueRound?.is_open || !isTeamFull}
                        onClick={buildPayloadAndSave}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </PrimaryButton>
                </div>
            </div>}

            {saveError && (
                <Toast 
                    message={saveError}
                    isVisible={Boolean(saveError)}
                    type="error"
                    onClose={() => setSaveError(undefined)}
                />
            )}

            {/* Success Modal */}
            {
                showSuccessModal && (
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
                )
            }

            {/* Loading Modal */}
            {
                isSaving && !showSuccessModal && (
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
                )
            }

        </Fragment>
    )
}
