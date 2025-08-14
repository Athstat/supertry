import { PlayerAggregateStatAction, SportAction } from "../types/sports_actions";

export function mapSportsActionToAthstatName(rawActionName: string) {

    if (rawActionName) {
        // Split the word by that _
        // capitalize first word of each item
        // lower case every other letter

        const words = rawActionName.split("_");
        let outStr = "";

        words.forEach((w) => {
            if (w.length === 0) return;
            if (w.length === 1) {
                outStr += w.toUpperCase();
                return;
            }

            if (w.length > 1) {
                const firstLetter = (w[0] + "").toUpperCase();
                const restLetters = (w.slice(1, w.length) + "").toLowerCase();

                outStr += `${firstLetter}${restLetters}`;
            }
        })

        return outStr as PlayerAggregateStatAction;
    }

    return rawActionName as PlayerAggregateStatAction;

}

export function normaliseSportsActionName(rawActionName: string) {

    if (rawActionName) {
        // Split the word by that _
        // capitalize first word of each item
        // lower case every other letter

        const words = rawActionName.split("_");
        let outStr = "";

        words.forEach((w) => {
            if (w.length === 0) return;
            if (w.length === 1) {
                outStr += w.toUpperCase();
                return;
            }

            if (w.length > 1) {
                const firstLetter = (w[0] + "").toUpperCase();
                const restLetters = (w.slice(1, w.length) + "").toLowerCase();

                outStr += `${firstLetter}${restLetters} `;
            }
        })

        return outStr as PlayerAggregateStatAction;
    }

    return rawActionName as PlayerAggregateStatAction;

}

/** Returns true if a sport action should be shown on the UI */
export function shouldShowSportAction(sportAction: SportAction) {
    const {definition} = sportAction;

    if (definition && definition.action_name && definition.display_name && definition.show_on_ui) {
        return true;
    }

    return false
}