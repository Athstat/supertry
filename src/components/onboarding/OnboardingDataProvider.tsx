import { atom, useAtomValue, useSetAtom } from "jotai";
import { IProAthlete } from "../../types/athletes";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { djangoAthleteService } from "../../services/athletes/djangoAthletesService";
import useSWR from "swr";
import { swrFetchKeys } from "../../utils/swrKeys";
import { fantasyLeagueGroupsService } from "../../services/fantasy/fantasyLeagueGroupsService";
import { ReactNode, useEffect } from "react";
import ScrummyLoadingState from "../ui/ScrummyLoadingState";
import { ScopeProvider } from "jotai-scope";

const featuredPlayersAtom = atom<IProAthlete[]>([]);
const featuredLeagueAtom = atom<FantasyLeagueGroup>();

type Props = {
    children?: ReactNode
}

export default function OnboardingDataProvider({ children }: Props) {

    const atoms = [
        featuredLeagueAtom,
        featuredPlayersAtom
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <ProviderContent>
                {children}
            </ProviderContent>
        </ScopeProvider>
    )
}


/** Provides data for the onboarding screen */
function ProviderContent({ children }: Props) {

    const featuredLeagueId: string = 'c50b2d32-fdf1-4480-88d4-219cdd87cab0';
    const featuredPlayersId: string[] = [];

    const setFeaturedLeague = useSetAtom(featuredLeagueAtom);
    const setFeaturedPlayers = useSetAtom(featuredPlayersAtom);

    const playersKey = `/onboarding/featured-players/${featuredLeagueId.length}`;
    const { data: players, isLoading: loadingPlayers } = useSWR(playersKey, () => featuredPlayersFetcher(featuredPlayersId));

    const groupKey = swrFetchKeys.getFantasyLeagueGroupById(featuredLeagueId);
    const { data: league, isLoading: loadingGroup } = useSWR(groupKey, () => fantasyLeagueGroupsService.getGroupById(featuredLeagueId));

    const isLoading = loadingPlayers || loadingGroup;

    useEffect(() => {

        if (league) {
            setFeaturedLeague(league)
        }

        if (players) {
            setFeaturedPlayers(players);
        }

    }, [players, league]);

    if (isLoading) {
        return <ScrummyLoadingState />
    }

    return (
        <>
            {children}
        </>
    )


}

async function featuredPlayersFetcher(ids: string[]) {
    const players: IProAthlete[] = [];

    const promises = ids.map(async (playerId: string) => {
        const res = await djangoAthleteService.getAthleteById(playerId);
        if (res) {
            players.push(res);
        }
    });

    await Promise.all(promises);
}


/** Hook that provides data from the onboarding data provider */
export function useOnboarding() {
    const featuredPlayers = useAtomValue(featuredPlayersAtom);
    const featuredLeague = useAtomValue(featuredLeagueAtom);

    return {
        featuredLeague,
        featuredPlayers
    }
}