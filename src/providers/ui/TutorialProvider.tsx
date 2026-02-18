import { ReactNode, useCallback, useMemo, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import { TutorialContext } from '../../contexts/ui/TutorialContext';
import { TutorialId } from '../../tutorials/tutorialIds';
import CoachScrummyTooltip from '../../components/tutorials/CoachScrummyTooltip';
import { setTutorialDone, setTutorialSkipped } from '../../utils/tutorials/tutorialStorage';
import { useAuth } from '../../contexts/auth/AuthContext';

type Props = {
  children?: ReactNode;
};

export default function TutorialProvider({ children }: Props) {
  const { authUser } = useAuth();
  const userId = authUser?.kc_id;

  const [activeTutorialId, setActiveTutorialId] = useState<TutorialId | undefined>(undefined);
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFreeRoam, setIsFreeRoam] = useState(false);

  const startTutorial = useCallback((tutorialId: TutorialId, nextSteps: Step[], startIndex = 0) => {
    setActiveTutorialId(tutorialId);
    setSteps(nextSteps);
    setRun(true);
    setIsFreeRoam(false);
    setStepIndex(startIndex);
  }, []);

  const resumeTutorialAtStep = useCallback(
    (tutorialId: TutorialId, nextSteps: Step[], nextStepIndex: number) => {
      setActiveTutorialId(tutorialId);
      setSteps(nextSteps);
      setRun(true);
      setIsFreeRoam(false);
      setStepIndex(nextStepIndex);
    },
    []
  );

  const enterFreeRoam = useCallback((tutorialId: TutorialId) => {
    if (activeTutorialId !== tutorialId) {
      return;
    }

    setRun(false);
    setIsFreeRoam(true);
  }, [activeTutorialId]);

  const completeTutorial = useCallback((tutorialId: TutorialId) => {
    if (activeTutorialId !== tutorialId) {
      return;
    }

    setTutorialDone(tutorialId, userId);
    setRun(false);
    setSteps([]);
    setStepIndex(0);
    setIsFreeRoam(false);
    setActiveTutorialId(undefined);
  }, [activeTutorialId, userId]);

  const skipTutorial = useCallback((tutorialId: TutorialId) => {
    if (activeTutorialId !== tutorialId) {
      return;
    }

    setTutorialSkipped(tutorialId, userId);
    setRun(false);
    setSteps([]);
    setStepIndex(0);
    setIsFreeRoam(false);
    setActiveTutorialId(undefined);
  }, [activeTutorialId, userId]);

  const isActive = useCallback((tutorialId: TutorialId) => activeTutorialId === tutorialId, [activeTutorialId]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (!activeTutorialId) {
      return;
    }

    if (status === STATUS.FINISHED) {
      completeTutorial(activeTutorialId);
      return;
    }

    if (status === STATUS.SKIPPED) {
      skipTutorial(activeTutorialId);
      return;
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextIndex = index + 1;

      setStepIndex(nextIndex);
    }

    if (action === ACTIONS.RESET) {
      setStepIndex(0);
    }
  }, [activeTutorialId, completeTutorial, skipTutorial]);

  const contextValue = useMemo(() => ({
    activeTutorialId,
    steps,
    run,
    stepIndex,
    isFreeRoam,
    startTutorial,
    resumeTutorialAtStep,
    enterFreeRoam,
    completeTutorial,
    skipTutorial,
    setStepIndex,
    isActive,
  }), [
    activeTutorialId,
    steps,
    run,
    stepIndex,
    isFreeRoam,
    startTutorial,
    resumeTutorialAtStep,
    enterFreeRoam,
    completeTutorial,
    skipTutorial,
    isActive,
  ]);

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showSkipButton
        showProgress
        disableOverlayClose
        spotlightClicks
        callback={handleJoyrideCallback}
        tooltipComponent={CoachScrummyTooltip}
        styles={{
          options: {
            zIndex: 2000,
            arrowColor: '#ffffff',
            backgroundColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      />
    </TutorialContext.Provider>
  );
}
