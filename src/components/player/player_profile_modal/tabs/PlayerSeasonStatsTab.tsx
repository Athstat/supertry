import { useMemo, useState } from "react";
import { usePlayerData } from "../../../../providers/PlayerDataProvider";
import { IProAthlete } from "../../../../types/athletes"
import Dropdown from "../../../ui/forms/Dropdown";
import NoContentCard from "../../../ui/typography/NoContentMessage";
import { DropdownOption } from "../../../../types/ui";
import { IProSeason } from "../../../../types/season";
import { PlayerSeasonStatsList } from "../../../stats/PlayerSeasonStatsList";
import CoachScrummyPlayerReport from "../CoachScrummyPlayerReport";
import { abbreviateSeasonName } from "../../../../utils/stringUtils";

type Props = {
    player: IProAthlete
}

/** Renders season stats tab */
export default function PlayerSeasonStatsTab({ player }: Props) {

    const { sortedSeasons, currentSeason } = usePlayerData();
    const [selectedSeason, setSelectedSeason] = useState<IProSeason | undefined>(currentSeason);

    const dropdownOptions: DropdownOption[] = useMemo(() => {
        return sortedSeasons.map((s) => {
            return {
                label: s.name ? abbreviateSeasonName(s.name) : s.name,
                value: s.id
            }
        })
    }, [sortedSeasons]);

    const handleChangeSeason = (seasonId?: string) => {
        const foundSeason = sortedSeasons.find((s) => s.id === seasonId);

        if (foundSeason) {
            setSelectedSeason(foundSeason);
        }
    }

    const displaySeason = selectedSeason || currentSeason;

    return (
        <div className="pb-[200px]" >
            {sortedSeasons.length === 0 && (
                <NoContentCard message={`Career stats for ${player.player_name} are not available`} />
            )}

            {sortedSeasons.length > 0 && (
                <div className="flex flex-col gap-4" key={player.tracking_id + selectedSeason?.id} >
                    <div className="flex flex-row items-center gap-2 justify-between" >

                        <div>
                            <p className="font-semibold" >Season Stats</p>
                        </div>

                        <div>
                            <Dropdown
                                options={dropdownOptions}
                                className="max-w-[230px] min-w-[200px]"
                                onChange={handleChangeSeason}
                                value={displaySeason?.id}
                            />
                        </div>
                    </div>

                    {displaySeason !== undefined && (
                        <PlayerSeasonStatsList.Root
                            season={displaySeason}
                            player={player}
                        >
                            <PlayerSeasonStatsList.Header />

                            <PlayerSeasonStatsList.Category
                                categoryName="general"
                                label="General"
                                skeletonItemCount={1}
                            />

                            <PlayerSeasonStatsList.Category
                                categoryName="attack"
                                label="Attacking"
                            />

                            <PlayerSeasonStatsList.Category
                                categoryName="defense"
                                label="Defense"
                            />

                            <PlayerSeasonStatsList.Category
                                categoryName="discipline"
                                label="Discipline"
                            />

                        </PlayerSeasonStatsList.Root>
                    )}

                    <CoachScrummyPlayerReport 
                        player={player}
                    />
                </div>
            )}
        </div>
    )
}
