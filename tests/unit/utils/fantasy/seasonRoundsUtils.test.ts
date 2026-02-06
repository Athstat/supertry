/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISeasonRound } from './../../../../src/types/fantasy/fantasySeason';
import { addDays, subDays, addMinutes, subMinutes, addHours } from "date-fns";
import { getCurrentRound, getPreviousRound, getScoringRound } from "../../../../src/utils/fantasy/seasonRoundsUtils";
import { isSeasonRoundTeamsLocked } from '../../../../src/utils/leaguesUtils';

describe('test getCurrentRound() function', () => {

    test('test season rounds when the season has not yet started', () => {

        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: addDays(now, 7),
                games_start: addDays(now, 8),
                games_end: addDays(now, 10),
                coverage_end: addDays(now, 12),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },

            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: addDays(now, 14),
                games_start: addDays(now, 15),
                games_end: addDays(now, 17),
                coverage_end: addDays(now, 19),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },

            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: addDays(now, 21),
                games_start: addDays(now, 22),
                games_end: addDays(now, 24),
                coverage_end: addDays(now, 26),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ]

        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeDefined();
        expect(currentRound).toMatchObject<ISeasonRound>({
            id: "round-1",
            round_number: 1,
            round_title: "Round 1",
            build_up_start: addDays(now, 7),
            games_start: addDays(now, 8),
            games_end: addDays(now, 10),
            coverage_end: addDays(now, 12),
            created_at: now,
            season: "test_season_1",
            priority: 1
        })
    })


    test('test season rounds when the season has started', () => {

        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },

            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 6),
                games_start: subDays(now, 2),
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },

            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: addDays(now, 21),
                games_start: addDays(now, 22),
                games_end: addDays(now, 24),
                coverage_end: addDays(now, 26),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ]

        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeDefined();
        expect(currentRound).toMatchObject<ISeasonRound>({
            id: "round-2",
            round_number: 2,
            round_title: "Round 2",
            build_up_start: subDays(now, 6),
            games_start: subDays(now, 2),
            games_end: addDays(now, 4),
            coverage_end: addDays(now, 6),
            created_at: now,
            season: "test_season_1",
            priority: 1
        },)
    });

    test("test when season rounds have all ended, expect to be last round as current round", () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 100),
                games_start: subDays(now, 95),
                games_end: subDays(now, 90),
                coverage_end: subDays(now, 85),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },

            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 80),
                games_start: subDays(now, 75),
                games_end: subDays(now, 70),
                coverage_end: subDays(now, 65),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },

            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: subDays(now, 60),
                games_start: subDays(now, 55),
                games_end: subDays(now, 50),
                coverage_end: subDays(now, 45),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ]

        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeDefined();
        expect(currentRound).toMatchObject<ISeasonRound>({
            id: "round-3",
            round_number: 3,
            round_title: "Round 3",
            build_up_start: subDays(now, 60),
            games_start: subDays(now, 55),
            games_end: subDays(now, 50),
            coverage_end: subDays(now, 45),
            created_at: now,
            season: "test_season_1",
            priority: 1
        })
    })

    test('test with empty rounds array', () => {
        const seasonRounds: ISeasonRound[] = [];
        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeUndefined();
    });

    test('test with single round', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: addDays(now, 7),
                games_start: addDays(now, 8),
                games_end: addDays(now, 10),
                coverage_end: addDays(now, 12),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeDefined();
        expect(currentRound?.round_number).toBe(1);
    });

    test('test with unsorted rounds - rounds not in order', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: addDays(now, 21),
                games_start: addDays(now, 22),
                games_end: addDays(now, 24),
                coverage_end: addDays(now, 26),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: addDays(now, 7),
                games_start: addDays(now, 8),
                games_end: addDays(now, 10),
                coverage_end: addDays(now, 12),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: addDays(now, 14),
                games_start: addDays(now, 15),
                games_end: addDays(now, 17),
                coverage_end: addDays(now, 19),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeDefined();
        expect(currentRound?.round_number).toBe(1);
    });

    test('test with rounds missing round numbers', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: undefined as any,
                round_title: "Round 1",
                build_up_start: addDays(now, 7),
                games_start: addDays(now, 8),
                games_end: addDays(now, 10),
                coverage_end: addDays(now, 12),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeDefined();
        expect(currentRound?.id).toBe("round-1");
    });

    test('test with gap between current and next round', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: addDays(now, 21),
                games_start: addDays(now, 22),
                games_end: addDays(now, 24),
                coverage_end: addDays(now, 26),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const currentRound = getCurrentRound(seasonRounds);
        expect(currentRound).toBeDefined();
        expect(currentRound?.round_number).toBe(1);
    });
})

describe('test getPreviousRound() function', () => {

    test('test get previous round when there is a previous round available', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 6),
                games_start: subDays(now, 2),
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: addDays(now, 21),
                games_start: addDays(now, 22),
                games_end: addDays(now, 24),
                coverage_end: addDays(now, 26),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const previousRound = getPreviousRound(seasonRounds);
        expect(previousRound).toBeDefined();
        expect(previousRound?.round_number).toBe(1);
        expect(previousRound?.id).toBe("round-1");
    });

    test('test get previous round when at round 1 (no previous round)', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: addDays(now, 7),
                games_start: addDays(now, 8),
                games_end: addDays(now, 10),
                coverage_end: addDays(now, 12),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: addDays(now, 14),
                games_start: addDays(now, 15),
                games_end: addDays(now, 17),
                coverage_end: addDays(now, 19),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const previousRound = getPreviousRound(seasonRounds);
        expect(previousRound).toBeUndefined();
    });

    test('test get previous round with empty rounds array', () => {
        const seasonRounds: ISeasonRound[] = [];
        const previousRound = getPreviousRound(seasonRounds);
        expect(previousRound).toBeUndefined();
    });

    test('test get previous round when all rounds have ended', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 100),
                games_start: subDays(now, 95),
                games_end: subDays(now, 90),
                coverage_end: subDays(now, 85),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 80),
                games_start: subDays(now, 75),
                games_end: subDays(now, 70),
                coverage_end: subDays(now, 65),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: subDays(now, 60),
                games_start: subDays(now, 55),
                games_end: subDays(now, 50),
                coverage_end: subDays(now, 45),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const previousRound = getPreviousRound(seasonRounds);
        expect(previousRound).toBeDefined();
        expect(previousRound?.round_number).toBe(2);
        expect(previousRound?.id).toBe("round-2");
    });

    test('test get previous round when current round is round 3', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 100),
                games_start: subDays(now, 95),
                games_end: subDays(now, 90),
                coverage_end: subDays(now, 85),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 80),
                games_start: subDays(now, 75),
                games_end: subDays(now, 70),
                coverage_end: subDays(now, 65),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: subDays(now, 40),
                games_start: subDays(now, 35),
                games_end: addDays(now, 5),
                coverage_end: addDays(now, 10),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const previousRound = getPreviousRound(seasonRounds);
        expect(previousRound).toBeDefined();
        expect(previousRound?.round_number).toBe(2);
        expect(previousRound?.id).toBe("round-2");
    });

    test('test get previous round when gap exists in round numbering', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: subDays(now, 6),
                games_start: subDays(now, 2),
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const previousRound = getPreviousRound(seasonRounds);
        expect(previousRound).toBeUndefined();
    });
})

describe('test getScoringRound() function', () => {

    test('test scoring round when current round is locked (games have started)', () => {
        const now = new Date();
        const gamesStart = subMinutes(now, 35);

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 6),
                games_start: gamesStart,
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeDefined();
        expect(scoringRound?.round_number).toBe(2);
        expect(scoringRound?.id).toBe("round-2");
    });

    test('test scoring round when current round is not locked and previous round exists', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 6),
                games_start: addDays(now, 2),
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeDefined();
        expect(scoringRound?.round_number).toBe(1);
        expect(scoringRound?.id).toBe("round-1");
    });

    test('test scoring round when current round is not locked and no previous round exists', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: addDays(now, 7),
                games_start: addDays(now, 8),
                games_end: addDays(now, 10),
                coverage_end: addDays(now, 12),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeUndefined();
    });

    test('test scoring round with empty rounds array', () => {
        const seasonRounds: ISeasonRound[] = [];
        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeUndefined();
    });

    test('test scoring round when exactly at lock threshold (30 minutes before games_start)', () => {
        const now = new Date();
        const gamesStart = addMinutes(now, 30);

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 6),
                games_start: gamesStart,
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeDefined();
        expect(scoringRound?.round_number).toBe(2);
        expect(scoringRound?.id).toBe("round-2");
    });

    test('test scoring round just before lock threshold (31 minutes before games_start)', () => {
        const now = new Date();
        const gamesStart = addMinutes(now, 31);

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 6),
                games_start: gamesStart,
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeDefined();
        expect(scoringRound?.round_number).toBe(1);
        expect(scoringRound?.id).toBe("round-1");
    });

    test('test scoring round just after lock threshold (29 minutes before games_start)', () => {
        const now = new Date();
        const gamesStart = addMinutes(now, 29);

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 21),
                games_start: subDays(now, 18),
                games_end: subDays(now, 15),
                coverage_end: subDays(now, 14),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 6),
                games_start: gamesStart,
                games_end: addDays(now, 4),
                coverage_end: addDays(now, 6),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeDefined();
        expect(scoringRound?.round_number).toBe(2);
        expect(scoringRound?.id).toBe("round-2");
    });

    test('test scoring round when all rounds have ended', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 100),
                games_start: subDays(now, 95),
                games_end: subDays(now, 90),
                coverage_end: subDays(now, 85),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 80),
                games_start: subDays(now, 75),
                games_end: subDays(now, 70),
                coverage_end: subDays(now, 65),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: subDays(now, 60),
                games_start: subDays(now, 55),
                games_end: subDays(now, 50),
                coverage_end: subDays(now, 45),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeDefined();
        expect(scoringRound?.round_number).toBe(3);
        expect(scoringRound?.id).toBe("round-3");
    });

    test('test scoring round with multiple rounds in different states', () => {
        const now = new Date();

        const seasonRounds: ISeasonRound[] = [
            {
                id: "round-1",
                round_number: 1,
                round_title: "Round 1",
                build_up_start: subDays(now, 100),
                games_start: subDays(now, 95),
                games_end: subDays(now, 90),
                coverage_end: subDays(now, 85),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-2",
                round_number: 2,
                round_title: "Round 2",
                build_up_start: subDays(now, 40),
                games_start: subDays(now, 35),
                games_end: subDays(now, 30),
                coverage_end: subDays(now, 25),
                created_at: now,
                season: "test_season_1",
                priority: 1
            },
            {
                id: "round-3",
                round_number: 3,
                round_title: "Round 3",
                build_up_start: subDays(now, 10),
                games_start: addDays(now, 2),
                games_end: addDays(now, 5),
                coverage_end: addDays(now, 10),
                created_at: now,
                season: "test_season_1",
                priority: 1
            }
        ];

        const scoringRound = getScoringRound(seasonRounds);
        expect(scoringRound).toBeDefined();
        expect(scoringRound?.round_number).toBe(2);
        expect(scoringRound?.id).toBe("round-2");
    });
})


describe('test isSeasonRoundTeamsLocked() function', () => {
    test('test when round is locked (Extreme Boundary)', () => {

        const now = new Date();
        const gamesStart = addMinutes(now, 30);

        const seasonRound: ISeasonRound = {
            id: "test_season_round",
            round_number: 1,
            round_title: "Week 1",
            build_up_start: new Date(),
            games_start: gamesStart,
            games_end: new Date(),
            coverage_end: new Date(),
            season: "test season",
            priority: 1,
            created_at: new Date()
        }


        expect(isSeasonRoundTeamsLocked(seasonRound)).toBeTruthy();
    });

    test('test when round is locked (Normal)', () => {

        const now = new Date();
        const gamesStart = addMinutes(now, 20);

        const seasonRound: ISeasonRound = {
            id: "test_season_round",
            round_number: 1,
            round_title: "Week 1",
            build_up_start: new Date(),
            games_start: gamesStart,
            games_end: new Date(),
            coverage_end: new Date(),
            season: "test season",
            priority: 1,
            created_at: new Date()
        }


        expect(isSeasonRoundTeamsLocked(seasonRound)).toBeTruthy();
    });


    test('test when round is not locked (Extreme Boundary)', () => {

        const now = new Date();
        const gamesStart = addMinutes(now, 31);

        const seasonRound: ISeasonRound = {
            id: "test_season_round",
            round_number: 1,
            round_title: "Week 1",
            build_up_start: new Date(),
            games_start: gamesStart,
            games_end: new Date(),
            coverage_end: new Date(),
            season: "test season",
            priority: 1,
            created_at: new Date()
        }


        expect(isSeasonRoundTeamsLocked(seasonRound)).toBeFalsy();
    });

    test('test when round is not locked (Normal)', () => {

        const now = new Date();
        const gamesStart = addHours(now, 28);

        const seasonRound: ISeasonRound = {
            id: "test_season_round",
            round_number: 1,
            round_title: "Week 1",
            build_up_start: new Date(),
            games_start: gamesStart,
            games_end: new Date(),
            coverage_end: new Date(),
            season: "test season",
            priority: 1,
            created_at: new Date()
        }


        expect(isSeasonRoundTeamsLocked(seasonRound)).toBeFalsy();
    });

    test('test when second chance window is active, round is not locked', () => {

        const now = new Date();
        // games start within lock window (10 minutes from now) but second chance overrides locking
        const gamesStart = addMinutes(now, 10);

        const seasonRound: ISeasonRound = {
            id: "test_season_round",
            round_number: 1,
            round_title: "Week 1",
            build_up_start: new Date(),
            games_start: gamesStart,
            games_end: new Date(),
            coverage_end: new Date(),
            season: "test season",
            priority: 1,
            created_at: new Date(),
            // define a second chance window that includes `now`
            second_chance_start: subMinutes(now, 5),
            second_chance_end: addMinutes(now, 20)
        } as any;


        expect(isSeasonRoundTeamsLocked(seasonRound)).toBeFalsy();
    });
})