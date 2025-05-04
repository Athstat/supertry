import { IFixture } from "../types/games";

export function fixtureSumary(fixture: IFixture) {
    const { team_score, kickoff_time, round, game_status, opposition_score } = fixture;

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