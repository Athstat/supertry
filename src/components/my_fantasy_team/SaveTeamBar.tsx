import { useCallback, useMemo, useState } from "react";
import { Check, Loader } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useFantasyTeam } from "../../hooks/fantasy/useFantasyTeam";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";
import { useNavigationGuard } from "../../hooks/web/useNavigationGuard";
import { fantasyAnalytics } from "../../services/analytics/fantasyAnalytics";
import { AppColours } from "../../types/constants";
import { isSeasonRoundTeamsLocked } from "../../utils/leaguesUtils";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { Toast } from "../ui/Toast";
import UnsavedChangesWarningModal from "../ui/modals/UnsavedChangesModal";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { fantasySeasonTeamService } from "../../services/fantasy/fantasySeasonTeamService";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useMyTeamScreen } from "../../contexts/ui/MyTeamScreenContext";

type Props = {
    onTeamUpdated: () => Promise<void>
    leagueRound: ISeasonRound
}

/** Renders Save Team Bar */
export default function SaveTeamBar({ leagueRound }: Props) {
    const {authUser} = useAuth();
    const {onUpdateTeam} = useMyTeamScreen();

    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | undefined>(undefined);
    const isLocked = isSeasonRoundTeamsLocked(leagueRound);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const toggleUnSavedChangesModal = () => {
        setShowUnsavedChangesModal(prev => !prev);
    }

    const {
        changesDetected,
        resetToOriginalTeam,
        isTeamFull, slots, team, teamCaptain
    } = useFantasyTeam();

    const {hardPop} = useNavigateBack();

    const navigationGuard = useCallback(() => {
        if (changesDetected) {
            toggleUnSavedChangesModal();
            return false;
        }

        return true;
    }, [changesDetected]);

    useNavigationGuard(navigationGuard);

    const isEditing = useMemo(() => {
        return changesDetected;
    }, [changesDetected]);

    // Cancel: revert to original team state
    const handleCancelEdits = () => {
        resetToOriginalTeam();
        fantasyAnalytics.trackCanceledTeamEdits();
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
                        purchase_price: s.purchasePrice || (a).price || a.purchase_price || 0,
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

            const updatedTeam = await fantasySeasonTeamService.updateRoundTeam(leagueRound.season, authUser?.kc_id || '', leagueRound.round_number,  {
                athletes: athletesPayload, user_id: authUser?.kc_id || '' 
            });

            // Apply optimistic update
            if (updatedTeam) {
                onUpdateTeam(updatedTeam);
            }

            setIsSaving(false);
            setShowSuccessModal(true);

            fantasyAnalytics.trackSaveTeamEdits();
        } catch (e) {
            console.error('Failed to update fantasy team', e);
            setSaveError('Failed to update team. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLeaveWithoutSavingChanges = () => {
        handleCancelEdits();
        hardPop("/leagues", {bypassGuard: true});
    }

    return (
        <div className="max-h-[36px] min-h-[36px] mt-3" >

            {isEditing && <div className="flex-col gap-2">
                <div className="flex gap-2 flex-row items-center justify-center">
                    <button
                        type="button"
                        onClick={handleCancelEdits}
                        disabled={isSaving}
                        className="w-[150px] text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 px-4 py-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
                    >
                        Cancel
                    </button>
                    <PrimaryButton
                        className="w-[150px] text-xs"
                        disabled={isSaving || isLocked || !isTeamFull}
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
                        <div className={twMerge(
                            "bg-white rounded-xl w-full max-w-md p-6",
                            AppColours.BACKGROUND
                        )}>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                                    <Check size={32} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Updated!</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Your team changes have been saved for {leagueRound.round_title}
                                </p>
                                <PrimaryButton
                                    className="w-full"
                                    onClick={() => {
                                        setShowSuccessModal(false);
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
                        <div className={twMerge(
                            "bg-white rounded-xl w-full max-w-md p-6",
                            AppColours.BACKGROUND
                        )}>
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
            
            <UnsavedChangesWarningModal 
                isOpen={showUnsavedChangesModal}
                title="Unsaved Changes"
                message="Wait up, are you sure you want to discard the changes you made to your team? Your changes will be lost"
                onCancel={toggleUnSavedChangesModal}
                onDiscard={handleLeaveWithoutSavingChanges}
            />

        </div>
    )
}
