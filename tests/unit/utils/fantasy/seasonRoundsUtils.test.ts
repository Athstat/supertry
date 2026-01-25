import { ISeasonRound } from './../../../../src/types/fantasy/fantasySeason';
import { addDays,subDays } from "date-fns";
import { getCurrentRound } from "../../../../src/utils/fantasy/seasonRoundsUtils";

describe('test getCurrentSeasonRound() function', () => {

    test('test season rouns when the season has not yet started', () => {

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
})