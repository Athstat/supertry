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

    const featuredLeagueId: string = 'f49b2adf-3902-4e6e-ac26-d3bfb54fff7d';
    
    const featuredPlayersId: string[] = [
        '3c7fb106-d5ea-5b30-8821-78687959f5bb',
        'ec22d71b-88a8-5945-8af7-cd9abdf4dbe2',
        '53db0e08-74c9-599e-a206-765c10ae44d1',
        '6de5a876-e9aa-5697-91df-df9988e69699',
        '52272d81-d403-5e62-83d3-9e3e9b4acef0',
        'f9d1fec6-d805-5694-ba61-b7f98b1a844c',
    ];

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

        console.log("Whats up with the API?? ", res);
    });

    await Promise.all(promises);

    return players;
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