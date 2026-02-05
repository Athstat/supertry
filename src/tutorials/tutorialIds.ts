export const TUTORIAL_IDS = {
  CREATE_TEAM: 'create-team',
} as const;

export type TutorialId = typeof TUTORIAL_IDS[keyof typeof TUTORIAL_IDS];
