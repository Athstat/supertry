/** Team Creation Atoms */

import { atom } from "jotai";
import { ITeamCreationPlayerSlot } from "../types/teamCreation";
import { RugbyPlayer } from "../types/rugbyPlayer";


export const teamCreationPlayerSlotsAtom = atom<ITeamCreationPlayerSlot[]>([]);

export const selectedTeamCreationPlayersAtom = atom<RugbyPlayer[]>((get) => {
    const slots = get(teamCreationPlayerSlotsAtom);
    const selectedPlayers: RugbyPlayer[] = [];

    slots.forEach((s) => {
        if (s.player) {
            selectedPlayers.push(s.player);
        }
    });

    return selectedPlayers;
});

export const teamNameAtom = atom<string>();

export const teamCompleteAtom = atom<boolean>((get) => {
    const selectedPlayers = get(selectedTeamCreationPlayersAtom);
    return selectedPlayers.length === 6;
});

