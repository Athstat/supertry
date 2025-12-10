import { Trophy } from "lucide-react"
import { FantasyLeagueGroup } from "../../../../types/fantasyLeagueGroups"
import { LeagueGroupCardSmall } from "../../league_card_small/LeagueGroupCardSmall"
import { OutlinedButton } from "../../../shared/buttons/PrimaryButton"
import { useMemo, useState } from "react"
import CreateLeagueModal from "../../CreateLeagueModal"
import { useNavigate } from "react-router-dom"
import NoContentCard from "../../../shared/NoContentMessage"
import { IFantasySeason } from "../../../../types/fantasy/fantasySeason"
import useSWR from "swr"
import { fantasyLeagueGroupsService } from "../../../../services/fantasy/fantasyLeagueGroupsService"
import RoundedCard from "../../../shared/RoundedCard"
import SecondaryText from "../../../shared/SecondaryText"

type Props = {
    fantasySeason: IFantasySeason
}

/** Renders users league groups section */
export default function LeagueAndStandingsSection({ fantasySeason }: Props) {

    const navigate = useNavigate();
    const key = `/user-joined-leagues/${fantasySeason.id}`;

    const { data: fetchedLeagues, isLoading: loadingUserLeagues } = useSWR(
        key, () => fantasyLeagueGroupsFetcher(fantasySeason.id), {
        revalidateOnFocus: false
    });

    const leagues = useMemo(() => (fetchedLeagues ?? []), [fetchedLeagues]);
    const isLoading = loadingUserLeagues;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const toggle = () => setShowCreateModal(prev => !prev);

    const handleCreateLeague = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`);
    }

    const handleClickLeagueCard = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}/standings`);
    }

    if (isLoading) {
        return (
            <RoundedCard
                className="w-full border-none h-[280px] animate-pulse"
            />
        )
    }

    return (
        <RoundedCard className="flex flex-col gap-4 dark:border-none p-4" >
            <div className="flex flex-row items-center justify-between" >

                <div className="flex flex-row items-center gap-2" >
                    <Trophy className="w-4 h-4" />
                    <p className="text-md font-medium" >Leagues & Standings</p>
                    {/* <GamePlayHelpButton className="" iconHw="w-4 h-4" /> */}
                </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-2" >
                <OutlinedButton onClick={toggle} className="flex-1" >
                    <p>Create League</p>
                </OutlinedButton>

                <OutlinedButton onClick={toggle} className="flex-1" >
                    <p>Join League</p>
                </OutlinedButton>
            </div>



            <div className="flex flex-col gap-2" >
                <div className="flex font-medium flex-row items-center justify-between" >
                    <SecondaryText className="text-xs" >League</SecondaryText>
                    <SecondaryText className="text-xs" >Ranking</SecondaryText>
                </div>

                {leagues.map((l) => {
                    return (
                        <LeagueGroupCardSmall
                            leagueGroup={l}
                            key={l.id}
                            onClick={handleClickLeagueCard}
                        />
                    )
                })}
            </div>

            {leagues.length === 0 && (
                <NoContentCard
                    message="You haven't joined any leagues yet 👀!"
                />
            )}

            {showCreateModal && (
                <CreateLeagueModal
                    isOpen={showCreateModal}
                    onLeagueCreated={handleCreateLeague}
                    onClose={toggle}
                />
            )}
        </RoundedCard>
    )
}


async function fantasyLeagueGroupsFetcher(seasonId: string) {
    const joinedLeagues = await fantasyLeagueGroupsService.getJoinedLeagues(seasonId);
    const mineLeagues = await fantasyLeagueGroupsService.getMyCreatedLeagues(seasonId);

    const aggregate = [...mineLeagues, ...joinedLeagues];

    return aggregate;
}
