import React, { useState, useEffect } from "react";
import {
  Users,
  Lock,
  Unlock,
  Plus,
  Search,
  ChevronRight,
  Trophy,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { leagueService } from "../services/leagueService";
import { teamService } from "../services/teamService";
import { IFantasyLeague } from "../types/fantasyLeague";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import { LeagueActions } from "../components/leagues/LeagueActions";
import { MyLeagueCard } from "../components/leagues/MyLeagueCard";
import { AvailableLeagueCard } from "../components/leagues/AvailableLeagueCard";
import { JoinPrivateLeagueModal } from "../components/leagues/JoinPrivateLeagueModal";
import { CreatePrivateLeagueModal } from "../components/leagues/CreatePrivateLeagueModal";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  NoSearchResults,
} from "../components/leagues/LeagueStates";

interface League {
  id: string;
  name: string;
  entryFee: string;
  prizePool: string;
  players: number;
  maxPlayers: number;
  isPrivate: boolean;
}

export function JoinLeagueScreen() {
  const navigate = useNavigate();
  const [showPrivateLeagueForm, setShowPrivateLeagueForm] = useState(false);
  const [availableLeagues, setAvailableLeagues] = useState<IFantasyLeague[]>(
    []
  );
  const [currentLeagues, setCurrentLeagues] = useState<IFantasyLeague[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeagues, setFilteredLeagues] = useState<IFantasyLeague[]>([]);
  const [isJoiningPrivate, setIsJoiningPrivate] = useState(false);
  const [privateLeagueCode, setPrivateLeagueCode] = useState("");
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [userJoinedLeagueIds, setUserJoinedLeagueIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoadingUserTeams, setIsLoadingUserTeams] = useState(true);
  const [userJoinedLeagues, setUserJoinedLeagues] = useState<Set<string>>(
    new Set()
  );

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: custom * 0.1, // Add delay based on index
      },
    }),
  };

  // Add a separate container animation for the Available Leagues section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2, // 0.5 second delay for the Available Leagues section
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setIsLoading(true);
        const leagues = await leagueService.getAllLeagues();

        // Filter leagues based on is_open status
        const available = leagues.filter(
          (league) => league.is_open && !league.has_ended
        );

        //const current = leagues.filter((league) => !league.has_ended);

        setAvailableLeagues(available);
        //setCurrentLeagues(current);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch leagues:", err);
        setError("Failed to load leagues. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeagues(availableLeagues);
    } else {
      const filtered = availableLeagues.filter((league) =>
        league.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeagues(filtered);
    }
  }, [searchTerm, availableLeagues]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        setIsLoadingUserTeams(true);
        const userTeams = await teamService.fetchUserTeams("");
        console.log("userTeams", userTeams);

        // Extract league IDs from user teams
        const joinedLeagueIds = new Set<string>();
        userTeams.forEach((team) => {
          if (team.league_id) {
            joinedLeagueIds.add(team.league_id);
          }
        });

        setUserJoinedLeagueIds(joinedLeagueIds);
      } catch (err) {
        console.error("Failed to fetch user teams:", err);
      } finally {
        setIsLoadingUserTeams(false);
      }
    };

    fetchUserTeams();
  }, []);

  useEffect(() => {
    const checkUserLeagueStatuses = async () => {
      if (!availableLeagues.length) return;

      const joinedLeagueIds = new Set<string>();

      // Process leagues in batches to avoid too many simultaneous requests
      const batchSize = 3;
      for (let i = 0; i < availableLeagues.length; i += batchSize) {
        const batch = availableLeagues.slice(i, i + batchSize);

        // Process each batch in parallel
        const results = await Promise.all(
          batch.map(async (league) => {
            const leagueId = league.official_league_id || league.id;
            const hasJoined = await leagueService.checkUserLeagueStatus(
              leagueId
            );
            return { leagueId, hasJoined };
          })
        );

        // Add joined league IDs to the set
        results.forEach(({ leagueId, hasJoined }) => {
          console.log("leagueId: ", leagueId);
          console.log("hasJoined: ", hasJoined);
          if (hasJoined) joinedLeagueIds.add(leagueId);
        });
      }

      setUserJoinedLeagues(joinedLeagueIds);
    };

    checkUserLeagueStatuses();
  }, [availableLeagues]);

  const handleJoinLeague = (league: IFantasyLeague) => {
    navigate(`/${league.official_league_id}/create-team`, {
      state: { league },
    });
  };

  const handleViewLeague = (league: IFantasyLeague) => {
    navigate(`/league/${league.official_league_id}`, {
      state: { league },
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleJoinPrivateLeague = async () => {
    if (!privateLeagueCode.trim()) {
      setCodeError("Please enter a league code");
      return;
    }

    try {
      setIsSubmittingCode(true);
      setCodeError(null);

      // This would be replaced with actual API call to join a private league
      // const league = await leagueService.joinPrivateLeague(privateLeagueCode);

      // For now, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response - in a real app, you'd use the API response
      setIsJoiningPrivate(false);
      setPrivateLeagueCode("");

      // If successful, you would navigate to the team creation screen
      // navigate(`/${league.official_league_id}/create-team`, { state: { league } });
    } catch (err) {
      console.error("Failed to join private league:", err);
      setCodeError("Failed to join league. Please try again.");
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const handleCreatePrivateLeague = () => {
    setShowPrivateLeagueForm(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const hasUserJoinedLeague = (league: IFantasyLeague): boolean => {
    const leagueId = league.official_league_id || league.id;

    // Check all possible indicators that a user has joined
    return (
      league.is_joined === true ||
      league.user_has_joined === true ||
      userJoinedLeagueIds.has(leagueId) ||
      userJoinedLeagues.has(leagueId)
    );
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-100">Leagues</h1>

        {/* League Actions */}
        <LeagueActions
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onCreateLeague={handleCreatePrivateLeague}
          onJoinPrivate={() => setIsJoiningPrivate(true)}
        />

        {/* Loading, Error and Empty States */}
        <LoadingState isLoading={isLoading} />
        <ErrorState error={error} isLoading={isLoading} />
        <EmptyState
          isLoading={isLoading}
          availableLeagues={availableLeagues}
          currentLeagues={currentLeagues}
          error={error}
          cardVariants={cardVariants}
        />
        <NoSearchResults
          isLoading={isLoading}
          searchTerm={searchTerm}
          filteredLeagues={filteredLeagues}
          availableLeagues={availableLeagues}
          cardVariants={cardVariants}
          onClearSearch={handleClearSearch}
        />

        {/* My Leagues */}
        {/* {!isLoading && (
          <div className="space-y-4 mb-10">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
              <Trophy size={20} className="text-primary-500" />
              My Leagues
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {filteredLeagues.map((league, index) => (
                  <>
                    {" "}
                    <AvailableLeagueCard
                      key={league.id}
                      league={league}
                      onJoinLeague={handleJoinLeague}
                      onViewLeague={handleViewLeague}
                      cardVariants={cardVariants}
                      isAlreadyJoined={true}
                      custom={index}
                    />
                  </>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )} */}

        {/* Available Leagues */}
        {!isLoading && filteredLeagues.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
              <Users size={20} className="text-primary-500" />
              Available Leagues
            </h2>
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {filteredLeagues.map((league, index) => (
                    <AvailableLeagueCard
                      key={league.id}
                      league={league}
                      onJoinLeague={handleJoinLeague}
                      onViewLeague={handleViewLeague}
                      cardVariants={cardVariants}
                      isAlreadyJoined={hasUserJoinedLeague(league)}
                      showBothButtons={true}
                      custom={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        <JoinPrivateLeagueModal
          isOpen={isJoiningPrivate}
          onClose={() => setIsJoiningPrivate(false)}
          onJoin={handleJoinPrivateLeague}
          code={privateLeagueCode}
          onCodeChange={(e) => setPrivateLeagueCode(e.target.value)}
          error={codeError}
          isSubmitting={isSubmittingCode}
        />
      </AnimatePresence>

      <AnimatePresence>
        <CreatePrivateLeagueModal
          isOpen={showPrivateLeagueForm}
          onClose={() => setShowPrivateLeagueForm(false)}
        />
      </AnimatePresence>
    </main>
  );
}
