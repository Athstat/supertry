import { getAppTheme } from "./themes/theme.constants";
import { AppTheme } from "./themes/themes";
import { TooltipData } from "./ui";

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
  ROUND_ID_QUERY_KEY: 'round_id',
  ROUND_NUMBER_QUERY_KEY: 'round_number',
}

/** Classname for app lighter dark blue */
export const lighterDarkBlueCN = "dark:bg-[#161d29]";
export const backgroundCN = "bg-gray-50 dark:bg-dark-850";
export const backgroundTranslucentCN = "bg-white/80 dark:bg-dark-850/80 backdrop-blur-sm shadow-none";

const currentTheme: AppTheme = getAppTheme();

export const AppColours = {
  BLUE_BACKGROUND: 'bg-[#1196F5] dark:bg-[#1196F5]',
  BACKGROUND: currentTheme.backgroundCN,
  CARD_BACKGROUND: currentTheme.cardBackgroundCN
}


export const CACHING_CONFIG = {
  userProfileCachePeriod: 1000 * 60 * 60 * 24, // 24 Hours
  sportsActionCachePeriod: 1000 * 60 * 60 * 24, // 24 Hours
  fantasySeasonsCachePeriod: 1000 * 60 * 60 * 1, // 1 Hour
  athletesCachePeriod: 1000 * 60 * 60 * 1 // 1 Hours
}

/** The Cache Key for where cached app data should be stored */
export const APP_CACHE_KEY = 'app-cache';

export const positionsTooltipMap: Map<string, TooltipData> = new Map([
  // === POSITION GROUPS / CLASSES ===
  [
    "front_row",
    {
      title: "Front Row",
      description:
        "The front row is made up of the props and hooker. They form the first line of the scrum and are essential for winning possession. Their strength allows the team to secure the ball, protect teammates, and create a solid platform to attack from.",
    },
  ],
  [
    "second_row",
    {
      title: "Second Row",
      description:
        "Second row players are usually the tallest on the field. They are crucial in winning lineouts and adding power to the scrum. Their work provides the team with clean ball and physical presence in both attack and defence.",
    },
  ],
  [
    "back_row",
    {
      title: "Back Row",
      description:
        "The back row links the forwards and backs. These players are involved everywhere on the field, making tackles, winning turnovers, and carrying the ball forward. Their energy and mobility help maintain momentum throughout the game.",
    },
  ],
  [
    "half_backs",
    {
      title: "Half Backs",
      description:
        "The half backs control how the game is played. They decide when to run, pass, or kick, setting the speed and direction of the team’s attack. Good half backs keep the team organised and calm under pressure.",
    },
  ],
  [
    "centres",
    {
      title: "Centres",
      description:
        "Centres operate in the middle of the field and are key to breaking defensive lines. They combine strength, speed, and passing to create space for teammates while also organising defence in a crucial area.",
    },
  ],
  [
    "back_three",
    {
      title: "Back Three",
      description:
        "The back three focus on finishing attacks and defending against kicks. They are often the fastest players and play a major role in counter-attacks, turning defence into instant scoring opportunities.",
    },
  ],

  // === INDIVIDUAL POSITIONS ===
  [
    "loosehead_prop",
    {
      title: "Loosehead Prop (1)",
      description:
        "The loosehead prop lines up on the left side of the scrum and helps anchor it. Their strength is vital for winning scrums and protecting the ball. Around the field, they carry the ball into contact and provide support in defence.",
    },
  ],
  [
    "hooker",
    {
      title: "Hooker (2)",
      description:
        "The hooker stands between the two props in the scrum and is responsible for winning the ball during scrums. They also throw the ball into lineouts and are heavily involved in tackling and supporting play.",
    },
  ],
  [
    "tighthead_prop",
    {
      title: "Tighthead Prop (3)",
      description:
        "The tighthead prop plays on the right side of the scrum and faces intense pressure. Their role is crucial for keeping the scrum stable, allowing the team to secure possession and attack confidently.",
    },
  ],
  [
    "lock",
    {
      title: "Lock (4–5)",
      description:
        "Locks are tall, powerful players who jump in lineouts to win the ball. In scrums, they provide pushing power. Their work helps the team control set pieces and maintain physical dominance.",
    },
  ],
  [
    "blindside_flanker",
    {
      title: "Blindside Flanker (6)",
      description:
        "The blindside flanker focuses on physical defence and stopping opposition attacks. They support ball carriers, make strong tackles, and help protect possession in tight areas.",
    },
  ],
  [
    "openside_flanker",
    {
      title: "Openside Flanker (7)",
      description:
        "The openside flanker is often the first to the breakdown, competing to win the ball back. Their speed and work rate disrupt the opposition and give their team extra attacking chances.",
    },
  ],
  [
    "number_8",
    {
      title: "Number Eight (8)",
      description:
        "The number eight controls the ball at the back of the scrum and provides powerful runs forward. They link the forwards and backs, helping transition play from set pieces into open attack.",
    },
  ],
  [
    "scrum_half",
    {
      title: "Scrum-Half (9)",
      description:
        "The scrum-half gathers the ball from the forwards and distributes it to the backs. They control the pace of the game and ensure the team stays organised during both attack and defence.",
    },
  ],
  [
    "outside_half",
    {
      title: "Outside Half (10)",
      description:
        "Also known as the fly-half, the outside half is the main decision-maker in attack. They choose when to pass, kick, or run, shaping how the team plays. A strong fly-half can control territory and create scoring opportunities. An outside half can be compared to a quaterback in american football",
    },
  ],
  [
    "inside_centre",
    {
      title: "Inside Centre (12)",
      description:
        "The inside centre combines strength and skill to break through defences. They often act as a second playmaker, helping distribute the ball while also defending a busy channel.",
    },
  ],
  [
    "outside_centre",
    {
      title: "Outside Centre (13)",
      description:
        "The outside centre focuses on exploiting space and breaking defensive lines. They also play an important defensive role, organising teammates and stopping opposition attacks in the midfield.",
    },
  ],
  [
    "wing",
    {
      title: "Wing (11 & 14)",
      description:
        "Wings play on the edges of the field and are usually the fastest players. Their main role is to finish attacks by scoring tries, while also defending wide areas and chasing kicks.",
    },
  ],
  [
    "full_back",
    {
      title: "Fullback (15)",
      description:
        "The fullback is the last line of defence and often fields opposition kicks. They must be safe under the high ball and are key to launching counter-attacks that can quickly turn defence into attack.",
    },
  ],

  [
    "back",
    {
      title: "Backs",
      description:
        "The backs are the faster, more skilful players who focus on attacking play. They use speed, passing, and kicking to move the ball into space and score tries. Backs are also important in defence, especially when covering wide areas of the field.",
    },
  ],

  [
    "prop",
    {
      title: "Props (1 & 3)",
      description:
        "Props play on either side of the scrum. They are powerful forwards whose main role is to provide strength and stability, helping the team win possession. Props are important because they allow the team to compete in scrums, protect the ball in contact, and gain ground through physical carries.",
    },
  ],

  [
    "left_wing",
    {
      title: "Left Wing (11)",
      description:
        "The left wingers player on the left edge of the field. Their main role is to use speed to finish attacking moves and score tries. Left wings are important because they stretch the defence wide and help turn space into points, while also defending the outside channel.",
    },
  ],

  [
    "right_wing",
    {
      title: "Right Wing (14)",
      description:
        "The right wingers play on the right edge of the field. They are fast attackers whose job is to finish chances, beat defenders, and score tries. Right wings also play a key defensive role by covering kicks and stopping attacks down the touchline.",
    },
  ],

  [
    "flanker",
    {
      title: "Flankers (6 & 7)",
      description:
        "Flankers are among the most active players on the field. They play on the sides of the scrum and are responsible for tackling, winning the ball, and supporting attacks. Flankers are important because their speed and work rate help the team regain possession and maintain pressure throughout the game.",
    },
  ],

  [
    "centre",
    {
      title: "Centres (12 & 13)",
      description:
        "Centres play in the middle of the backline and are key to both attack and defence. They use strength, speed, and passing skills to break defensive lines, create space for teammates, and stop opposition attacks in the midfield. Centres are crucial for linking forwards and backs and shaping the team’s attack.",
    },
  ],

]);
