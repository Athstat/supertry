import { createContext } from 'react';
import { Step } from 'react-joyride';
import { TutorialId } from '../../tutorials/tutorialIds';

type TutorialContextValue = {
  activeTutorialId?: TutorialId;
  steps: Step[];
  run: boolean;
  stepIndex: number;
  isFreeRoam: boolean;
  startTutorial: (tutorialId: TutorialId, steps: Step[], startIndex?: number) => void;
  resumeTutorialAtStep: (tutorialId: TutorialId, steps: Step[], stepIndex: number) => void;
  enterFreeRoam: (tutorialId: TutorialId) => void;
  completeTutorial: (tutorialId: TutorialId) => void;
  skipTutorial: (tutorialId: TutorialId) => void;
  setStepIndex: (stepIndex: number) => void;
  isActive: (tutorialId: TutorialId) => boolean;
};

export const TutorialContext = createContext<TutorialContextValue | null>(null);
