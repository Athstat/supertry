import useSWR from "swr";
import { useFantasyLeaguesScreen } from "../../hooks/fantasy/useFantasyLeaguesScreen"
import { IFantasySeason } from "../../types/fantasy/fantasySeason"
import RoundedCard from "../shared/RoundedCard";
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService";
import SecondaryText from "../shared/SecondaryText";
import FantasyLeagueGroupDataProvider from "../fantasy-league/providers/FantasyLeagueGroupDataProvider";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { Trophy } from "lucide-react";
import { twMerge } from "tailwind-merge";
import UpcomingFixturesSection from "../dashboard/UpcomingFixturesSection";

/** Component rendered when there are not selected fantasy season pages */
export default function FantasySeasonsOverview() {

    const { fantasySeasons } = useFantasyLeaguesScreen();

    return (
        <div className="flex flex-col gap-2" >
            <div>
                <h1 className="font-bold text-lg" >Overview</h1>
            </div>

            <div className="flex flex-col gap-2" >
                {fantasySeasons.map((s, index) => {
                    return (
                        <FantasySeasonCard
                            fantasySeason={s}
                            index={index}
                        />
                    )
                })}
            </div>

            <div>
                <h1 className="font-bold text-lg" >Fixtures</h1>
            </div>

            <UpcomingFixturesSection hideTitleBar />

        </div>
    )
}

type FantasySeasonCardProps = {
    fantasySeason: IFantasySeason,
    index: number
}

function FantasySeasonCard({ fantasySeason, index }: FantasySeasonCardProps) {

    const { setSelectedSeason } = useFantasyLeaguesScreen();
    const featuredLeagueKey = `/featured-league/${fantasySeason.id}`;
    const { data: featuredLeagues, isLoading } = useSWR(featuredLeagueKey, () => fantasySeasonsService.getFantasySeasonFeaturedLeagues(fantasySeason.id));

    if (isLoading) {
        return (
            <RoundedCard className="h-[100px] w-full rounded-xl border-none animate-pulse" >
            </RoundedCard>
        )
    }

    const groups = (featuredLeagues ?? []);
    const featureGroup = groups.length > 0 ? groups[0] : undefined;

    const colours = [
        'dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-500 bg-blue-100 border-blue-300 text-blue-500',
        'dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-500 bg-purple-100 border-purple-300 text-purple-500',
        'dark:border-yellow-800/50 dark:bg-yellow-900/20 dark:text-yellow-500 bg-yellow-50 border-yellow-300 text-yellow-500'
    ]

    const onClick = () => {
        setSelectedSeason(fantasySeason);
    }

    return (
        <FantasyLeagueGroupDataProvider leagueId={featureGroup?.id} >
            <RoundedCard onClick={onClick} className="p-4 cursor-pointer" >

                <div className="flex flex-row items-center gap-2" >
                    <div className={twMerge(
                        'round-xl border rounded-xl w-fit p-4',
                        colours[index % colours.length]
                    )} >
                        <Trophy />
                    </div>

                    <div  >
                        <h1 className="font-semibold" >{fantasySeason.name}</h1>
                        <div className="flex flex-row items-center gap-0" >
                            <SecondaryText className="" >{featureGroup?.title}・</SecondaryText>

                            <CurrentRoundIndicator />
                        </div>
                    </div>
                </div>
            </RoundedCard>
        </FantasyLeagueGroupDataProvider>
    )
}

function CurrentRoundIndicator() {

    const { currentRound } = useFantasyLeagueGroup();

    return (
        <div>
            <SecondaryText>{currentRound?.title}</SecondaryText>
        </div>
    )
}