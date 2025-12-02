import { useAtom, useAtomValue } from "jotai";
import { fixtureAtom, fixtureSelectedPlayerAtom, showPlayerMatchModalAtom, showPlayerProfileAtom } from "../../state/fixtures/fixture.atoms";
import { IProAthlete } from "../../types/athletes";

export function useFixtureScreen() {
    const fixture = useAtomValue(fixtureAtom);
    const [selectedPlayer, setSelectedPlayer] = useAtom(fixtureSelectedPlayerAtom);
    const [showProfileModal, setShowProfileModal] = useAtom(showPlayerProfileAtom);
    const [showPlayerMatchModal, setShowPlayerMatchModal] = useAtom(showPlayerMatchModalAtom);

    const openPlayerMatchModal = (player: IProAthlete) => {
        setShowProfileModal(false);
        setSelectedPlayer(player);
        setShowPlayerMatchModal(true);
    }

    const closePlayerMatchModal = () => {
        setShowPlayerMatchModal(false);
        setSelectedPlayer(undefined);
        setShowPlayerMatchModal(false);
    }

    const openPlayerProfileModal = (player: IProAthlete) => {
        setSelectedPlayer(player);
        setShowProfileModal(true);
    }


    const closePlayerProfileModal = () => {
        setShowProfileModal(false);
    }

    return {
        fixture, selectedPlayer, showPlayerMatchModal, openPlayerProfileModal,
        closePlayerProfileModal, closePlayerMatchModal, openPlayerMatchModal,
        showProfileModal
    }
}