import { ITeamAction, ITeamActionName } from "../types/games";


export type TeamHeadtoHeadItem = {
    action: string
    homeValue?: number,
    awayValue?: number,
    homeStrValue?: string
    awayStrValue?: string
    winner?: 'home' | 'away',
    hide?: boolean
}

/** Class that assits with team action stats */
export class TeamActionsParser {

    public constructor(
        private data: ITeamAction[],
        private homeTeamId: string,
        private awayTeamId: string
    ) { }

    private getForHomeAndAway(athstatAction: ITeamActionName) {
        const homeAction = this.data.find((ta) => {
            return ta.action === athstatAction && ta.team_id === this.homeTeamId
        });

        const awayAction = this.data.find((ta) => {
            return ta.action === athstatAction && ta.team_id === this.awayTeamId
        });

        const home = homeAction?.action_count ? Math.floor(homeAction?.action_count) : undefined;
        const away = awayAction?.action_count ? Math.floor(awayAction?.action_count) : undefined;

        return [home, away];
    }

    public getTries(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway("Tries")

        return {
            action: 'Tries',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away)
        }
    }

    public getConversionsRate(): TeamHeadtoHeadItem {
        const [homeMissed, awayMissed] = this.getForHomeAndAway('ConversionsMissed');
        const [homeMade, awayMade] = this.getForHomeAndAway('ConversionsScored');

        const homeTotal = (homeMade ?? 0) + (homeMissed ?? 0);
        const homePerc = (homeTotal > 0 ? (homeMade ?? 0) / homeTotal : 0) * 100;

        const awayTotal = (awayMade ?? 0) + (awayMissed ?? 0);
        const awayPerc = (awayTotal > 0 ? (awayMade ?? 0) / awayTotal : 0) * 100;

        const homeRate = `${homeMade ?? '-'}/${(homeMade || homeMissed) ? (homeMade ?? 0) + (homeMissed ?? 0) : '-'}`
        const awayRate = `${awayMade ?? '-'}/${(awayMade || awayMissed) ? (awayMade ?? 0) + (awayMissed ?? 0) : '-'}`

        return {
            action: "Conversion",
            homeStrValue: homeRate,
            awayStrValue: awayRate,
            homeValue: homePerc,
            awayValue: awayPerc,
            winner: this.calculateWinner(
                homeMade && homeMissed ? (homeMade) / (homeMade + homeMissed) : undefined,
                awayMade && awayMissed ? (awayMade) / (awayMade + awayMissed) : undefined,
            )
        }
    }

    public getPenaltyGoalsScored(): TeamHeadtoHeadItem {
        const [homeMade, awayMade] = this.getForHomeAndAway('PenaltyGoalsScored');

        return {
            action: "Penalty Goals",
            homeValue: homeMade ?? 0,
            awayValue: awayMade ?? 0,
            winner: this.calculateWinner(homeMade, awayMade)
        }
    }

    public getDropGoalsScored(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('DropGoalsScored');

        return {
            action: "Drop Goals",
            homeValue: home ?? 0,
            awayValue: away ?? 0,
            winner: this.calculateWinner(home, away)
        }
    }

    public getLineouts(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('Lineouts');
        return {
            action: 'Lineouts',
            homeValue: home,
            awayValue: away
        }
    }

    getLineoutsLost(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('LineoutsLost');
        return {
            action: 'Lineouts Lost',
            homeValue: home,
            awayValue: away
        }
    }

    getLineoutsWon(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('LineoutsWon');
        return {
            action: 'Lineouts Won',
            homeValue: home,
            awayValue: away
        }
    }

    getYellowCards(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('YellowCards');
        return {
            action: 'Yellow Cards',
            homeValue: home ?? 0,
            awayValue: away ?? 0,
            winner: this.calculateWinner(home ?? 0, away ?? 0)
        }
    }

    getRedCards(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('RedCards');
        return {
            action: 'Red Cards',
            homeValue: home ?? 0,
            awayValue: away ?? 0,
            winner: this.calculateWinner(home ?? 0, away ?? 0)
        }
    }

    getTurnoversConceded(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('TurnoversConceded');
        return {
            action: 'Turnovers Conceded',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away)
        }
    }

    getTurnoversWon(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('TurnoversWon');
        return {
            action: 'Turnovers Won',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away),
            hide: home === undefined && away === undefined
        }
    }

    getPenaltiesConceded(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('PenaltiesConceded');

        return {
            action: 'Penalties Conceded',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away),
            hide: home === undefined && away === undefined
        }
    }

    getPassesMade(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('Passes');
        return {
            action: 'Passes',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away),
            hide: home === undefined && away === undefined
        }
    }

    getTacklesMade(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('TacklesMade');
        return {
            action: 'Tackles Made',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away),
            hide: home === undefined && away === undefined
        }
    }

    getScrumsWon(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('ScrumsWon');
        return {
            action: 'Scrums Won',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away),
            hide: home === undefined && away === undefined
        }
    }

    getMaulsFormed(): TeamHeadtoHeadItem {
        const [home, away] = this.getForHomeAndAway('Mauls');
        return {
            action: 'Mauls',
            homeValue: home,
            awayValue: away,
            winner: this.calculateWinner(home, away),
            hide: home === undefined && away === undefined
        }
    }



    public calculateWinner(home: number | undefined, away: number | undefined): 'home' | 'away' | undefined {
        if (home !== undefined && away !== undefined) {
            if (home > away) {
                return 'home'
            }

            if (away > home) {
                return 'away'
            }
        }

        return undefined;
    }

}