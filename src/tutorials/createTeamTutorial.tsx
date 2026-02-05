import { Step } from 'react-joyride';

export const CREATE_TEAM_TUTORIAL_SELECTORS = {
  dashboardCta: '[data-tutorial="dashboard-pick-team-cta"]',
  myTeamIntro: '[data-tutorial="my-team-intro"]',
  slot1Empty: '[data-tutorial="team-slot-1-empty"]',
  playerPickerFirstRow: '[data-tutorial="player-picker-first-row"]',
  slot1Player: '[data-tutorial="team-slot-1-player"]',
  playerActionModal: '[data-tutorial="player-action-modal"]',
  playerActionSwap: '[data-tutorial="player-action-swap"]',
  playerActionCaptain: '[data-tutorial="player-action-captain"]',
  slot2Empty: '[data-tutorial="team-slot-2-empty"]',
  playerPickerPriceColumn: '[data-tutorial="player-picker-price-column"]',
  playerPickerPrColumn: '[data-tutorial="player-picker-pr-column"]',
  playerPickerScoutingTab: '[data-tutorial="player-picker-scouting-tab"]',
  playerPickerFilter: '[data-tutorial="player-picker-filter"]',
  coachBanner: '[data-tutorial="coach-scrummy-banner"]',
  createTeamButton: '[data-tutorial="create-team-button"]',
} as const;

export const CREATE_TEAM_TUTORIAL_STEP_INDEX = {
  DASHBOARD_CTA: 0,
  INTRO: 1,
  SLOT_1_EMPTY: 2,
  PLAYER_PICKER_SLOT_1: 3,
  SLOT_1_PLAYER: 4,
  ACTION_MODAL_SWAP: 5,
  PLAYER_PICKER_SWAP: 6,
  SLOT_1_PLAYER_CAPTAIN_PROMPT: 7,
  ACTION_MODAL_CAPTAIN: 8,
  AFTER_CAPTAIN_NEXT: 9,
  SLOT_2_EMPTY: 10,
  PLAYER_PICKER_PRICE: 11,
  PLAYER_PICKER_PR: 12,
  PLAYER_PICKER_SCOUTING: 13,
  PLAYER_PICKER_FILTER: 14,
  PLAYER_PICKER_PICK: 15,
  FINAL_BANNER: 16,
} as const;

export function getCreateTeamTutorialSteps(): Step[] {
  return [
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.dashboardCta,
      placement: 'bottom',
      content: (
        <div>
          <p>Now that you’re set up, let’s build your team. Tap <strong>Pick Team</strong> to start.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.myTeamIntro,
      placement: 'bottom',
      content: (
        <div>
          <p>You’ll pick <strong>6 players</strong>: 5 starters + 1 super sub.</p>
          <p>You have <strong>240 SCRUM coins</strong> to spend, so balance stars with value.</p>
          <p>Tap players to <strong>Swap</strong>, <strong>Remove</strong>, or make them <strong>Captain</strong>.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.slot1Empty,
      placement: 'right',
      content: (
        <div>
          <p>Tap the first slot to pick your first player.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerFirstRow,
      placement: 'right',
      content: (
        <div>
          <p>Choose a player to fill this slot.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.slot1Player,
      placement: 'right',
      content: (
        <div>
          <p>Nice pick! Tap your player to see their actions.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerActionSwap,
      placement: 'top',
      content: (
        <div>
          <p>Start by tapping <strong>Swap</strong> to replace this player.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerFirstRow,
      placement: 'right',
      content: (
        <div>
          <p>Pick a replacement player to complete the swap.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.slot1Player,
      placement: 'right',
      content: (
        <div>
          <p>Tap your player again to set a captain.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerActionCaptain,
      placement: 'top',
      content: (
        <div>
          <p>Tap <strong>Make Captain</strong> to give them the armband.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerActionModal,
      placement: 'top',
      content: (
        <div>
          <p>Great! Captains score big. Next, let’s pick your second player.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.slot2Empty,
      placement: 'right',
      content: (
        <div>
          <p>Tap the next slot to pick your second player.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerPriceColumn,
      placement: 'top',
      content: (
        <div>
          <p><strong>Price</strong> is the cost in SCRUM coins.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerPrColumn,
      placement: 'top',
      content: (
        <div>
          <p><strong>Power Ranking</strong> reflects real‑world form from our custom analytics engine.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerScoutingTab,
      placement: 'top',
      content: (
        <div>
          <p><strong>Scouting List</strong> shows players you’ve saved from the Players screen.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerFilter,
      placement: 'top',
      content: (
        <div>
          <p>Filter by team to narrow the list.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerFirstRow,
      placement: 'right',
      content: (
        <div>
          <p>Pick a player for this slot.</p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: CREATE_TEAM_TUTORIAL_SELECTORS.coachBanner,
      placement: 'top',
      content: (
        <div>
          <p>Nice work — you’re all set. Tap <strong>Create Team</strong> when you’re ready.</p>
        </div>
      ),
      disableBeacon: true,
    },
  ];
}
