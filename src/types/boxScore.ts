import { IProAthlete } from "./athletes"
import { SportActionDefinition } from "./sports_actions"

export type IBoxScoreItem = {
    athlete_id: string,
    game_id: string,
    athlete: IProAthlete
    player_type: string,
    player_name: string,
    passes: number,
    carries: number,
    carriesmadegainline: number,
    linebreaks: number,
    defendersbeaten: number,
    offloads: number,
    tries: number,
    metres: number,
    tacklesmade: number,
    tacklesuccess: number,
    tacklesmissed: number,
    turnoverswon: number,
    lineoutswonsteal: number,
    lineoutswon: number,
    penaltiesconceded: number,
    yellowcards: number,
    redcards: number,
    turnoversconceded: number,
    kicksfromhand: number,
    kicksfromhandmetres: number,
    retainedkicks: number,
    trykicks: number,
    conversionsscored: number,
    conversionsmissed: number,
    penaltygoalsscored: number,
    dropgoalsscored: number,
    points: number,
    minutesplayed: number
}

export type GameSportAction = {
    action: string,
    game_id: string,
    athlete_id: string,
    action_count: number,
    team_id: string,
    hidden: boolean,
    points?: number,
    data_source: string,
    definition?: SportActionDefinition
}

export type BoxscoreListRecordItem = {
    athleteId: string,
    stats: (number | string)[]
}

export type BoxscoreHeader = {
    lable: string,
    key?: string,
    tooltip?: string,
    title?: string
}