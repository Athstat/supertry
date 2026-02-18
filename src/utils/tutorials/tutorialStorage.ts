import { TutorialId, TUTORIAL_IDS } from '../../tutorials/tutorialIds';

const buildKey = (tutorialId: TutorialId, userId: string, suffix: 'DONE' | 'SKIPPED') =>
  `TUTORIAL_${tutorialId.toUpperCase()}_${suffix}/${userId}`;

export function getTutorialStorageKeys(tutorialId: TutorialId, userId: string) {
  return {
    done: buildKey(tutorialId, userId, 'DONE'),
    skipped: buildKey(tutorialId, userId, 'SKIPPED'),
  };
}

export function getTutorialFlags(tutorialId: TutorialId, userId?: string) {
  if (typeof window === 'undefined' || !userId) {
    return { done: false, skipped: false };
  }

  const { done, skipped } = getTutorialStorageKeys(tutorialId, userId);

  return {
    done: localStorage.getItem(done) === 'true',
    skipped: localStorage.getItem(skipped) === 'true',
  };
}

export function setTutorialDone(tutorialId: TutorialId, userId?: string) {
  if (typeof window === 'undefined' || !userId) {
    return;
  }

  const { done } = getTutorialStorageKeys(tutorialId, userId);
  localStorage.setItem(done, 'true');
}

export function setTutorialSkipped(tutorialId: TutorialId, userId?: string) {
  if (typeof window === 'undefined' || !userId) {
    return;
  }

  const { skipped } = getTutorialStorageKeys(tutorialId, userId);
  localStorage.setItem(skipped, 'true');
}

export function clearTutorialFlags(tutorialId: TutorialId, userId?: string) {
  if (typeof window === 'undefined' || !userId) {
    return;
  }

  const { done, skipped } = getTutorialStorageKeys(tutorialId, userId);
  localStorage.removeItem(done);
  localStorage.removeItem(skipped);
}

export const TUTORIAL_STORAGE_IDS = {
  CREATE_TEAM: TUTORIAL_IDS.CREATE_TEAM,
};
