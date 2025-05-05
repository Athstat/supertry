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
        `${fixture.home_team} vs ${fixture.away_team}`,
        `${fixture.away_team} vs ${fixture.home_team}`,
    ];

    phrases.forEach((phrase: string) => {
        
        if (phrase === "") return false;
         
        phrase = phrase.toLowerCase();

        const flag = phrase.startsWith(query);

        match = match || flag;
    });




    return match;

}