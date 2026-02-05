import { Check, Info, Loader, Shield } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { useFantasyTeam } from "../../hooks/fantasy/useFantasyTeam";
import { useSubmitTeam } from "../../hooks/fantasy/useSubmitTeam";
import { isGuestUserAtom } from "../../state/authUser.atoms";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { Toast } from "../ui/Toast";
import { useCreateFantasyTeam } from "../../hooks/fantasy/useCreateFantasyTeam";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";
import { useNavigationGuard } from "../../hooks/web/useNavigationGuard";
import UnsavedChangesWarningModal from "../ui/modals/UnsavedChangesModal";
import { useLeagueConfig } from "../../hooks/useLeagueConfig";
import { useTutorial } from "../../hooks/tutorials/useTutorial";
import { TUTORIAL_IDS } from "../../tutorials/tutorialIds";
import { getCreateTeamTutorialSteps, CREATE_TEAM_TUTORIAL_STEP_INDEX } from "../../tutorials/createTeamTutorial";


/** Renders Create Team View Header */
export default function CreateTeamViewHeader() {
    const {leagueConfig} = useLeagueConfig();
    const { totalSpent, selectedCount, leagueRound, isTeamFull, resetToOriginalTeam, setTeam: setRoundTeam } = useFantasyTeam();
    const { isActive, isFreeRoam, resumeTutorialAtStep, completeTutorial } = useTutorial();
    const isCreateTeamTutorialActive = isActive(TUTORIAL_IDS.CREATE_TEAM);

    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [showClaimAccountModal, setShowClaimAccountModal] = useState<boolean>(false);
    const [createdTeam, setCreatedTeam] = useState<IFantasyLeagueTeam>();

    const handleSuccess = useCallback((team: IFantasyLeagueTeam) => {
        setShowSuccessModal(true);
        setCreatedTeam(team);
    }, [setShowSuccessModal])

    const isGuestAccount = useAtomValue(isGuestUserAtom);

    const { handleSave, isSaving, saveError, clearSaveError } = useSubmitTeam(handleSuccess);

    const onSaveTeam = () => {
        handleSave();
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        if (isGuestAccount) {
            setShowClaimAccountModal(true);
        }

        // Perform Optimistic Update
        if (createdTeam) {
            setRoundTeam(createdTeam)
        }

        if (isCreateTeamTutorialActive) {
            completeTutorial(TUTORIAL_IDS.CREATE_TEAM);
        }
    }

    const handleCancelClaimAccount = () => {
        setShowClaimAccountModal(false);
    }

    const handleCloseClaimAccountModal = () => {
        setShowClaimAccountModal(false);
    }

    useEffect(() => {
        if (!isCreateTeamTutorialActive) {
            return;
        }

        if (!isTeamFull) {
            return;
        }

        if (!isFreeRoam) {
            return;
        }

        resumeTutorialAtStep(
            TUTORIAL_IDS.CREATE_TEAM,
            getCreateTeamTutorialSteps(),
            CREATE_TEAM_TUTORIAL_STEP_INDEX.FINAL_BANNER
        );
    }, [isCreateTeamTutorialActive, isTeamFull, isFreeRoam, resumeTutorialAtStep]);

    if (!leagueRound || !leagueConfig) {
        return;
    }


    return (
        <div className="px-4 flex flex-col gap-3.5" >

            <UnsavedChangesGuard />

            <div className="flex flex-row  items-center justify-between" >

                <div className="flex flex-col w-full  flex-1 items-start justify-start">
                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Selected
                    </div>
                    <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
                        {selectedCount}/6
                    </div>
                </div>


                <div className="flex flex-row items-center justify-center text-center gap-1">

                    <div className="flex flex-row items-center gap-1" >
                        <Shield />
                        <p className="font-semibold ">Pick Your Team</p>
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col items-end justify-center">
                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Total Spent
                    </div>
                    {leagueConfig && (
                        <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
                            {totalSpent}/{leagueConfig?.team_budget}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-2" >
                <PrimaryButton
                    onClick={resetToOriginalTeam}
                    className="text-xs w-[150px] dark:bg-slate-700/40 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"
                >
                    Reset
                </PrimaryButton>

                <PrimaryButton
                    className="text-xs w-[150px]"
                    disabled={!isTeamFull}
                    isLoading={isSaving}
                    onClick={onSaveTeam}
                    dataTutorial="create-team-button"
                >
                    Create Team
                </PrimaryButton>
            </div>


            {/* Loading Modal */}
            {isSaving && !showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-primary-500 dark:text-primary-400">
                                <Loader className="w-10 h-10 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Joining the Scrum...</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Please wait while we save your team
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    showCoachMessage={isCreateTeamTutorialActive}
                    onContinue={handleCloseSuccessModal}
                />
            )}

            {/* Claim/Complete Account Modal */}
            {showClaimAccountModal && (
                <ClaimAccountModal
                    onCancel={handleCancelClaimAccount}
                    onClose={handleCloseClaimAccountModal}
                />
            )}

            {saveError && (
                <Toast
                    type="error"
                    message={saveError}
                    onClose={clearSaveError}
                    isVisible={Boolean(saveError)}
                />
            )}


        </div>
    );
}


type SuccessModalProps = {
    onContinue?: () => void,
    showCoachMessage?: boolean
}

function SuccessModal({ onContinue, showCoachMessage }: SuccessModalProps) {

    const { leagueRound } = useFantasyTeam();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Submitted!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Your team has been successfully submitted
                        {leagueRound ? ` to ${leagueRound.season}` : ''}
                    </p>
                    {showCoachMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Great job! Next you can create a league and invite your friends.
                        </p>
                    )}
                    <PrimaryButton
                        className="w-full"
                        onClick={onContinue}
                    >
                        Let's Go!
                    </PrimaryButton>
                </div>
            </div>
        </div>
    )
}

type ClaimAccountModalProps = {
    onCancel?: () => void,
    onClose?: () => void
}

function ClaimAccountModal({ onCancel, onClose }: ClaimAccountModalProps) {

    const navigate = useNavigate();

    const handleTakeAction = () => {

        if (onClose) {
            onClose();
        }

        navigate('/profile');
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
            <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                        <Info className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Complete Your Account</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Claim your account to secure your team, and manage your profile and notifications
                    </p>
                    <div className="flex flex-col gap-2">
                        <PrimaryButton
                            className="w-full rounded-lg py-2"
                            onClick={handleTakeAction}
                        >
                            Go to Profile
                        </PrimaryButton>
                        <PrimaryButton
                            className="w-full rounded-lg py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                            onClick={onCancel}
                        >
                            Maybe later
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

/** Renders component that warns user about leaving the
 * create team screen without saving their team */

function UnsavedChangesGuard() {

    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState<boolean>(false);

    const {
        changesDetected,
        selectedCount
    } = useCreateFantasyTeam();

    const toggleUnSavedChangesModal = () => {
        setShowUnsavedChangesModal(prev => !prev);
    }

    const hasUnsavedChanges = useMemo(() => {
        return changesDetected || selectedCount > 1
    }, [changesDetected, selectedCount]);

    const { hardPop } = useNavigateBack();

    const navigationGuard = useCallback(() => {
        if (hasUnsavedChanges) {
            toggleUnSavedChangesModal();
            return false;
        }

        return true;
    }, [hasUnsavedChanges]);

    useNavigationGuard(navigationGuard);

    const handleLeaveWithoutSavingChanges = () => {
        hardPop("/leagues", { bypassGuard: true });
    }

    return (
        <>

            <UnsavedChangesWarningModal
                isOpen={showUnsavedChangesModal}
                title="Unsaved Changes"
                message="Hold on! You’re still creating a team and haven’t saved it yet. Do you want to discard your progress?"
                onCancel={toggleUnSavedChangesModal}
                onDiscard={handleLeaveWithoutSavingChanges}
            />

        </>
    )
}
