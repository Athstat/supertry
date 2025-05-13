import { IFixture } from "../types/games";

export function fixtureSumary(fixture: IFixture) {
    const { team_score, kickoff_time, game_status, opposition_score } = fixture;

    const matchFinal = game_status === "completed" && team_score && opposition_score;

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const gameKickedOff = kickoff_time && (new Date(kickoff_time) < new Date());
    
    return {gameKickedOff, homeTeamWon, awayTeamWon, game_status};
}

export function summerizeGameStatus(fixture: IFixture) {
    const status = fixture.game_status;

    if (status) {
        if (status === "completed") return "Final";
        if (status === "in_progress") return "Live";
    }

    return "";
}

export function searchFixturesPredicate(fixture: IFixture ,query: string) {

    if (query === "") return true;

    let match = false;

    const phrases = [
        `${fixture.team_name} vs ${fixture.opposition_team_name}`,
        `${fixture.opposition_team_name} vs ${fixture.team_name}`,
    ];

    phrases.forEach((phrase: string) => {

        if (phrase === "") return false;
         
        phrase = phrase.toLowerCase();

        const flag = phrase.startsWith(query);

        match = match || flag;
    });


    return match;

}

/** Filters fixtures to only show those belonging to a certain round
 * and returns in ascending order of date
 */
export function getRoundFixtures(fixtures: IFixture[], start: number, end: number) {
    const filteredFixtures = fixtures.filter((f) => {
        return f.round >= start && f.round <= end;
    }).sort((a, b) => {
        const aDate = new Date(a.kickoff_time ?? new Date());
        const bDate = new Date(b.kickoff_time ?? new Date());

        return aDate.valueOf() - bDate.valueOf();
    });

    return filteredFixtures;
}

