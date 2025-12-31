# Supertry (Scrummy Web App) - Complete Wiki

Welcome to the comprehensive documentation for **Supertry**, the fantasy rugby web application that brings the excitement of fantasy sports to rugby fans worldwide.

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Architecture](#project-architecture)
5. [Core Features](#core-features)
6. [Development Guide](#development-guide)
7. [Testing](#testing)
8. [API Services](#api-services)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

---

## 🏉 Project Overview

**Supertry** (formerly Scrummy Web App) is a fantasy rugby platform built with modern web technologies. The application allows users to:

- Create and manage fantasy rugby teams
- Join and compete in fantasy leagues with friends
- Track player statistics and performance
- Follow professional and school-based rugby competitions
- Make match predictions and compete in rankings
- Scout players and manage team transfers
- Engage with the rugby community

### Target Audience
- Rugby fans and enthusiasts
- Fantasy sports players
- School rugby supporters
- Professional rugby followers

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2.0** - Modern UI library with the latest features
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.2** - Fast build tool and development server

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** with Autoprefixer - CSS processing
- **Lucide React 0.502.0** - Icon library
- **React Icons 5.5.0** - Additional icons
- **Framer Motion 12.6.0** - Animation library

### State Management & Data Fetching
- **Jotai 2.12.4** - Atomic state management
- **SWR 2.3.3** - Data fetching and caching
- **React Router DOM 6.29.0** - Client-side routing

### Authentication
- **JWT Decode 4.0.0** - Token handling
- **React OAuth Google 0.12.2** - Google authentication
- **React Apple Signin Auth 1.1.2** - Apple authentication

### Analytics & Tracking
- **Amplitude Analytics Browser 2.17.3** - User analytics
- **AppsFlyer** - Marketing attribution tracking

### Data Visualization
- **Chart.js 4.4.9** - Charting library
- **React ChartJS 2 5.3.0** - React wrapper for Chart.js

### Utilities
- **Axios 1.8.2** - HTTP client
- **Date-fns 4.1.0** - Date manipulation
- **Tailwind Merge 3.2.0** - Class name merging

### Development Tools
- **ESLint 9.9.1** - Code linting
- **Prettier 3.2.5** - Code formatting
- **Jest 29.7.0** - Unit testing
- **Maestro** - E2E testing for web
- **pnpm** - Package manager

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **pnpm** (package manager)
- **Git** for version control
- **Google Chrome** (for E2E testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Athstat/supertry.git
   cd supertry
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory. Use `.env.example` as a template:

   ```bash
   cp .env.example .env
   ```

### Environment Variables

Create a `.env` file with the following variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_APP_ENV` | Environment identifier (production, qa, etc.) | `qa` or `production` |
| `VITE_API_BASE_URL` | Backend API base URL | `https://scrummy-django-server.onrender.com` |
| `VITE_AMPLITUDE_API_KEY` | Amplitude analytics API key | `your_amplitude_key` |
| `VITE_AF_ONELINK_BASE_URL` | AppsFlyer OneLink URL for marketing tracking | `https://onrender.onelink.me/FOO/bar` |
| `VITE_FEATURE_LEAGUE_GROUP_ID` | Featured fantasy league group ID | `45031b65-31df-419b-8693-29199ebfe08c` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `your_client_id.apps.googleusercontent.com` |
| `VITE_APPLE_CLIENT_ID` | Apple Sign In client ID | `com.your-domain.web` |

**Important:** Without these environment variables, the app will crash on startup with detailed error messages indicating which variable is missing.

### Running the Development Server

**macOS/Linux:**
```bash
pnpm dev
```

**Windows:**
```bash
pnpm dev-win
```

The app will be available at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
pnpm build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

---

## 🏗️ Project Architecture

### Directory Structure

```
supertry/
├── .maestro/                    # E2E test configuration and flows
│   ├── flows/                   # Test flow definitions
│   │   ├── auth/               # Authentication tests
│   │   ├── teams/              # Team management tests
│   │   └── helpers/            # Reusable test helpers
│   ├── test-data/              # Test data files
│   └── config.yaml             # Maestro configuration
├── docs/                        # Project documentation
├── public/                      # Static assets
│   ├── fonts/                  # Custom fonts
│   ├── images/                 # Images and icons
│   ├── pitch/                  # Rugby pitch graphics
│   ├── player_card_backgrounds/ # Player card designs
│   ├── pro_logos/              # Professional team logos
│   └── sbr_logos/              # School-based rugby logos
├── src/
│   ├── components/             # React components
│   │   ├── analytics/          # Analytics components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── fantasy-league/     # Fantasy league components
│   │   ├── fixtures/           # Fixture displays
│   │   ├── match_center/       # Match center components
│   │   ├── player/             # Player-related components
│   │   ├── player-picker/      # Team selection interface
│   │   ├── players/            # Player lists and cards
│   │   ├── predictions/        # Prediction features
│   │   ├── profile/            # User profile components
│   │   ├── rankings/           # Ranking displays
│   │   ├── sbr/                # School-based rugby features
│   │   ├── scouting/           # Player scouting components
│   │   ├── stats/              # Statistics displays
│   │   ├── team/               # Team management
│   │   ├── shared/             # Shared/common components
│   │   └── ui/                 # UI primitives
│   ├── contexts/               # React Context providers
│   │   ├── AppStateContext.tsx # Global app state
│   │   ├── AuthContext.tsx     # Authentication state
│   │   ├── ThemeContext.tsx    # Theme management
│   │   └── ...                 # Other contexts
│   ├── data/                   # Static data and constants
│   ├── hooks/                  # Custom React hooks
│   │   ├── athletes/           # Athlete-related hooks
│   │   ├── auth/               # Authentication hooks
│   │   ├── fantasy/            # Fantasy league hooks
│   │   ├── fixtures/           # Fixture hooks
│   │   ├── leagues/            # League management hooks
│   │   └── ...                 # Other hooks
│   ├── providers/              # Additional providers
│   ├── screens/                # Page-level components
│   │   ├── auth/               # Authentication screens
│   │   ├── fantasy-leagues/    # Fantasy league screens
│   │   ├── players/            # Player screens
│   │   ├── predictions/        # Prediction screens
│   │   ├── scouting/           # Scouting screens
│   │   └── ...                 # Other screens
│   ├── services/               # API service layer
│   │   ├── analytics/          # Analytics services
│   │   ├── athletes/           # Athlete services
│   │   ├── auth/               # Auth services
│   │   ├── fantasy/            # Fantasy services
│   │   ├── sbr/                # SBR services
│   │   ├── teams/              # Team services
│   │   └── ...                 # Other services
│   ├── state/                  # State management
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── Routes.tsx              # Route definitions
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles
├── tests/                      # Test files
├── .cursorrules                # AI assistant rules
├── .gitignore                  # Git ignore patterns
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # Dependency lock file
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Project readme
```

### Key Architecture Patterns

#### Component Organization
Components are organized by feature domain:
- **Domain-specific folders** (e.g., `auth/`, `fantasy-league/`, `players/`)
- **Shared components** in `shared/` and `ui/`
- **Screen-level components** in `screens/`

#### State Management
- **Jotai** for atomic state management
- **React Context** for app-wide state (Auth, Theme, App State)
- **SWR** for server state and caching

#### Service Layer
All API calls are abstracted into service modules:
- Clear separation of concerns
- Reusable API functions
- Centralized error handling

---

## ✨ Core Features

### 1. Authentication System

**Screens:**
- Sign Up (`SignUpScreen`)
- Sign In (`SignInScreen`)
- Forgot Password (`ForgotPasswordScreen`)
- Reset Password (`ResetPasswordScreen`)
- Email Verification (`VerifyEmailScreen`)
- Complete Profile (`CompleteProfileScreen`)

**Authentication Methods:**
- Email/Password authentication
- Google OAuth integration
- Apple Sign In
- Guest mode with restrictions

**Context:**
- `AuthContext` - Manages user authentication state

### 2. Fantasy League Management

**Screens:**
- Fantasy Overview (`FantasyScreen`)
- League Details (`FantasyLeagueScreen`)
- League Standings (`FantasyLeagueGroupStandingsScreen`)
- Join Group (`JoinGroupScreen`)
- League Member Team View (`LeagueMemberTeamScreen`)
- Featured Fantasy League Groups (`FeaturedFantasyLeagueGroups`)

**Features:**
- Create and join fantasy leagues
- Invite friends to leagues
- View league standings and rankings
- Track league performance
- Compare teams within leagues

**Services:**
- `leagueService` - League CRUD operations
- `leagueGroupService` - League group management
- `fantasyTeamService` - Team operations
- `userCreatedLeagueService` - User league management

### 3. Team Management

**Screens:**
- Review Team (`ReviewTeamScreen`)
- My Teams List (`MyTeamsListScreen`)

**Features:**
- Create fantasy teams with budget constraints
- Player selection interface (Player Picker)
- Transfer management
- Team formation visualization
- View team statistics and performance

**Components:**
- `PlayerPicker` - Interactive team selection
- `TeamCard` - Team display card
- Team creation wizard

### 4. Player Management & Scouting

**Screens:**
- Players Overview (`PlayersOverviewScreen`)
- All Players (`AllPlayersScreen`)
- Players by Country (`PlayersByCountryScreen`)
- Players by Position (`PlayersByPositionClassScreen`)
- Players by Team (`PlayersByTeamScreens`)
- Player Profile (`PlayerProfileScreen`)
- Fantasy Top Performers (`FantasyTopPerformersScreen`)
- Scouting List (`ScoutingListScreen`)

**Features:**
- Browse all available players
- Filter players by country, position, team
- View detailed player statistics
- Player comparison tool
- Add players to scouting list
- Track player performance over time
- Season statistics breakdown

**Components:**
- `PlayerCard` - Player display card
- `PlayerCompareModal` - Side-by-side player comparison
- `PlayerSeasonStatsTray` - Statistical breakdown
- `SportActionCategoryList` - Performance categories

**Context:**
- `AthleteContext` - Athlete data management
- `PlayersScreenContext` - Player screen state
- `PlayerAggregateStatsContext` - Aggregated stats

### 5. School-Based Rugby (SBR)

**Screens:**
- SBR Dashboard (`SbrScreen`)
- SBR Fixture Details (`SbrFixtureScreen`)
- Schools Directory (`SchoolsScreen`)
- SBR Chat (`SBRChatScreen`)

**Features:**
- School rugby fixtures and results
- Man of the Match (MOTM) voting
- School-specific statistics
- School rugby community chat
- School rankings and standings

**Context:**
- `SbrContext` - SBR-specific state
- `SbrMotmVotingBoxContext` - MOTM voting state

**Services:**
- `sbrMotmService` - MOTM operations
- SBR-specific fixture handling

### 6. Fixtures & Match Center

**Screens:**
- Fixtures Overview (`FixturesScreen`)
- Fixture Details (`FixtureScreen`)
- Fixture List (`FixtureListScreen`)
- Pro Fixtures Tab (`ProFixturesTab`)
- Seasons Overview (`CompetitionsScreen`)
- Season Details (`SeasonScreen`)

**Features:**
- View upcoming and past fixtures
- Live match updates
- Match statistics and box scores
- Fixture filtering by competition
- Match predictions
- Pro and SBR fixture separation

**Services:**
- `gamesService` - Game/fixture operations
- `boxScoreService` - Match statistics
- `seasonsService` - Season management

### 7. Dashboard & Home

**Screens:**
- Dashboard (`DashboardScreen`)
- Onboarding (`OnBoardingScreen`)

**Features:**
- Personalized dashboard
- Quick access to leagues and teams
- Recent activity feed
- Featured content
- News and updates
- Call-to-action banners

**Components:**
- `NewsCard` - News display
- `LeagueCard` - League quick view
- `JoinLeagueCard` - League join CTA
- Dashboard widgets

### 8. Rankings & Predictions

**Screens:**
- Fantasy Rankings (`FantasyRankingsScreen`)
- Predictions Rankings (`PredictionsRankingScreen`)

**Features:**
- Global fantasy rankings
- League-specific rankings
- Prediction leaderboards
- Power rankings
- Weekly/seasonal rankings

**Services:**
- `fantasyRankingsService` - Fantasy rankings
- `powerRankingsService` - Power rankings
- `leaguePredictionsService` - Prediction rankings
- `proPredictionsRankings` - Pro prediction rankings

### 9. User Profile & Settings

**Screens:**
- User Profile (`UserProfileScreen`)
- Edit Account Info (`EditAccountInfoScreen`)
- Notification Preferences (`NotificationPreferencesScreen`)
- In-App Messages (`InAppMessagesScreen`)

**Features:**
- View and edit profile information
- Manage notification settings
- View message inbox
- Account management
- Profile customization

**Services:**
- `userService` - User CRUD operations
- `notificationsService` - Notification management

### 10. Social & Community

**Screens:**
- Invite Friends (`InviteFriendsScreen`)
- Onboarding Flows (`JoinLeagueOnboardingScreen`, `InviteStepsScreen`)

**Features:**
- Invite friends to app and leagues
- Social sharing
- League invitations
- Community engagement

### 11. Additional Features

- **Theme Support**: Dark/Light mode toggle
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive error boundaries
- **Analytics**: User behavior tracking with Amplitude
- **Performance**: Optimized loading and caching with SWR
- **Accessibility**: Semantic HTML and ARIA labels

---

### E2E Testing with Maestro

The project uses Maestro for end-to-end testing of the web application.

#### Prerequisites
- Maestro CLI installed
- Chrome browser
- Development server running

#### Installing Maestro

**macOS:**
```bash
brew tap mobile-dev-inc/tap
brew install maestro
```

**Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Windows:**
```powershell
iwr -useb 'https://get.maestro.mobile.dev' | iex
```

#### Running E2E Tests

**All tests:**
```bash
pnpm test:e2e
```

**Authentication tests:**
```bash
pnpm test:e2e:signin
```

**Team management tests:**
```bash
pnpm test:e2e:teams
```

**Specific test:**
```bash
maestro test .maestro/flows/auth/02-signin.yaml
```

#### Debugging Tests

Use Maestro Studio for visual debugging:
```bash
maestro studio
```

For detailed output:
```bash
maestro test --debug-output .maestro/flows/auth/01-signup.yaml
```

See `.maestro/README.md` for comprehensive testing documentation.

---

## 🔌 API Services

### Service Modules

The application uses a well-organized service layer for API communication:

#### Authentication Services
- `authService` - Login, signup, password reset
- OAuth integration services

#### Fantasy Services
- `fantasyTeamService` - Team CRUD operations
- `leagueService` - League management
- `leagueGroupService` - League group operations
- `userCreatedLeagueService` - User-created leagues
- `fantasyRankingsService` - Fantasy rankings

#### Player/Athlete Services
- `athleteSportsActions` - Player actions and stats
- `sportActionsService` - Sport-specific actions
- Athlete-specific service modules in `services/athletes/`

#### Game/Fixture Services
- `gamesService` - Fixture management
- `boxScoreService` - Match statistics
- `seasonsService` - Season data

#### SBR Services
- `sbrMotmService` - Man of the Match functionality
- SBR-specific services in `services/sbr/`

#### Prediction Services
- `leaguePredictionsService` - League predictions
- `proPredictionsRankings` - Professional predictions
- `powerRankingsService` - Power rankings

#### Other Services
- `userService` - User profile management
- `notificationsService` - Notification handling
- `logger` - Logging utilities
- `errors` - Error handling

### API Configuration

API base URL is configured via environment variable:
```
VITE_API_BASE_URL=https://scrummy-django-server.onrender.com
```

---

## 🚀 Deployment

### Deployment Configuration



---

## 🤝 Contributing

### Development Workflow

### Code Review Process

### Commit Message Convention

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Test additions
- `chore:` - Maintenance

---

## 📚 Additional Resources

### Project Links
- **Repository:** https://github.com/Athstat/supertry
- **Backend API:** Scrummy Django Server (hosted on Render)

### Documentation
- Main README: `README.md`
- Maestro Testing Guide: `.maestro/README.md`

### External Documentation
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Jotai Documentation](https://jotai.org)
- [SWR Documentation](https://swr.vercel.app)
- [Maestro Documentation](https://maestro.mobile.dev)

---

## 📄 License

Please refer to the repository for license information.

---

## 📧 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

---

**Last Updated:** December 2025

**Version:** Based on React 19.2.0, Vite 5.4.2

---

*This wiki is maintained by the Supertry development team. For updates and corrections, please submit a pull request.*
