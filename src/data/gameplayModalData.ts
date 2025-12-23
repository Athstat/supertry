import { GameplayModalData } from '../types/gameplayModal';

export const gameplayModalData: GameplayModalData = {
  "title": "Welcome to SCRUMMY",
  "subTitle": "Learn the game play basics",
  "description": "",
  "subTopics": [
    {
      "title": "Pick 6 Players",
      "description": "Build your ultimate fantasy squad by selecting 6 rugby players. Balance is everything, the right mix will give you the edge.",
      "emoji": "👥",
      "subTopics": [
        {
          "title": "Positions",
          "description": "There are 6 slots. The first two slots are for the front row players, second 2 are for your half backs and the last row are is for back. The 6th and final slot is for a substitute playing at any position"
        },
        {
          "title": "Available Data",
          "description": "We give you access to player stats, recent performance data, and form insights to help you make smarter picks. Don't just choose by name — use the data to your advantage."
        },
        {
          "title": "Strategy",
          "description": "Go for reliable stars or gamble on rising talent — the choice is yours. Mixing proven players with hidden gems is often the winning formula."
        }
      ],
    },
    {
      "title": "Budget",
      "description": "There is a catch! You have $240 to build your squad. Managing your funds is as important as picking your players. Overspend on a star, and you may have to compromise elsewhere.",
      "emoji": "💰",
      "subTopics": [
        {
          "title": "Star Players",
          "description": "Top-tier players will eat up your budget, but they bring consistent points. Decide if you want one or two anchors for your squad."
        },
        {
          "title": "Hidden Gems",
          "description": "Cheaper players can be game-changers if they outperform expectations. Keep an eye out for underrated talent."
        },
        {
          "title": "Balance",
          "description": "Spread your budget wisely across positions to avoid weaknesses. A well-rounded squad often outperforms a star-heavy one."
        }
      ]
    },
    {
      "title": "Weekly Gameplay",
      "emoji": "🚀",
      "description": "Scrummy is fast-paced and week-focused. Every week is a new chance to win, making it exciting from the very first match to the last.",
      "subTopics": [
        {
          "title": "One Week at a Time",
          "description": "Unlike season-long leagues. Each week stands alone, giving everyone a chance to shine."
        },
        {
          "title": "Adjustments",
          "description": "Player form changes, injuries happen — adapt quickly. Returning each week to tweak your squad is the key to staying competitive."
        },
        {
          "title": "Engagement",
          "description": "Come back every week to stay in the action. A quick lineup change can be the difference between winning and losing."
        }
      ]
    },
    {
      "title": "Create/Join Leagues",
      "emoji": "🏆",
      "description": "Compete with friends or jump into a new challenge. Scrummy leagues make the experience more social and competitive.",
      "subTopics": [
        {
          "title": "Create a League",
          "description": "Start your own private league, set the rules, and invite friends. Perfect for bragging rights within your crew."
        },
        {
          "title": "Join with Code",
          "description": "Got an invite code from a friend? Enter it and join their league instantly. No hassle, just action."
        },
        {
          "title": "Compete & Climb",
          "description": "Track the leaderboard, challenge your friends, and celebrate victories. Leagues make every win sweeter when bragging rights are on the line."
        }
      ]
    },
    {
      "title": "Fantasy Points Breakdown",
      "emoji": "📊",
      "description": "Understanding how players earn fantasy points is key to building a winning squad. Points are awarded based on in-game actions, with different values for attacking plays, defensive efforts, and disciplinary actions.",
      "subTopics": [
        {
          "title": "High Value Actions",
          "description": "Tries: 4 points | Try Assist: 2 points | Kick Try Scored: 2 points. These are the game-changing moments that can make or break your fantasy week."
        },
        {
          "title": "Core Defensive & Attacking Actions",
          "description": "Clean Breaks, Defenders Beaten, Dominant Tackles, Lineout Won Steal, Offload, Tackle Turnover, Turnover Won: 1 point each. Consistent performers in these areas rack up solid points."
        },
        {
          "title": "Goal Kicking",
          "description": "Conversion Goals, Penalty Goals, Drop Goals Converted: 0.5 points each. Reliable kickers add steady points throughout the match."
        },
        {
          "title": "Minor Actions",
          "description": "Tackles: 0.5 points | Carries Crossed Gain Line: 0.3 points | Post Contact Metres: 0.1 points | Carry Metres Total & Ruck Arrival Attack: 0.05 points each. The small actions that add up over time."
        },
        {
          "title": "Penalties",
          "description": "Missed Tackles/Conversions/Penalties/Drop Goals: -0.5 points each | Turnovers Conceded: -1 point | Red Cards & Second Yellow: -5 points each. Discipline matters — poor decisions cost you points."
        }
      ]
    }
  ]
};
