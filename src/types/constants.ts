import { appTheme1, appTheme2 } from "./themes/theme.constants";
import { AppTheme } from "./themes/themes";

export const CACHE_DURATION = 5 * 60 * 1000;
export const URC_COMPETIION_ID = "b5cae2ff-d123-5f12-a771-5faa6d40e967";
export const ERPC_COMPETITION_ID = "d313fbf5-c721-569b-975d-d9ec242a6f19";
export const INVESTEC_CHAMPIONSHIP_CUP = "9a83c3bb-e99a-4255-ad58-73df4f4806c9";
export const AFRICA_CUP = "sr-1";

export const DEFAULT_FALLBACK_FEATURED_LEAGUE_ID = '5e9098c5-9c37-4454-b04f-0ee9011c803f';

export const FEATURED_PLAYER_IDS = [
  "447fac1b-cd71-59b2-a975-71b890e0eb3c"
  // 'c280f4d7-87fe-5bec-a099-473ebd78f41f',
  // '1188cb47-a7cd-571d-8f96-676691517662',
];

/** The amount of coins avaialble to a player to build their team */
export const MAX_TEAM_BUDGET = 240;

export const MAX_COMPARE_PLAYERS = 10;

export const APP_GOOGLE_PLAYSTORE_LINK = 'https://play.google.com/store/apps/details?id=com.scrummy&pcampaignid=web_share';
export const APP_IOS_APPSTORE_LINK = 'https://apps.apple.com/us/app/scrummy-fantasy-rugby/id6744964910';

export const FANTASY_TEAM_POSITIONS = [
    { name: 'Front Row', position_class: 'front-row' },
    { name: 'Second Row', position_class: 'second-row' },
    { name: 'Back Row', position_class: 'back-row' },
    { name: 'Halfback', position_class: 'half-back' },
    { name: 'Back', position_class: 'back' },
    { name: 'Super Sub', position_class: 'super-sub', isSpecial: true },
  ];


export const queryParamKeys = {
  ROUND_ID_QUERY_KEY: 'round_id'
}

/** Classname for app lighter dark blue */
export const lighterDarkBlueCN = "dark:bg-[#161d29]";
export const backgroundCN = "bg-gray-50 dark:bg-dark-850";
export const backgroundTranslucentCN = "bg-white/80 dark:bg-dark-850/80 backdrop-blur-sm shadow-none";

const currentTheme: AppTheme = appTheme2;

export const AppColours = {
  BLUE_BACKGROUND: 'bg-[#1196F5] dark:bg-[#1196F5]',
  BACKGROUND: currentTheme.backgroundCN,
  CARD_BACKGROUND: currentTheme.cardBackgroundCN
}

console.log("Background", window.DARK_BACKGROUND_CLASSNAME)
console.log("Card Background", window.DARK_CARD_BACKGROUND_CLASSNAME);